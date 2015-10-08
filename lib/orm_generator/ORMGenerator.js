module.exports = require('autowire')(function(_, Reindent, EntityValidator, FieldValidator,
                                              Promise, TempModuleGenerator){

  function showCode(code) {
    code = _(code).map(function(line){
      return line.split("\n");
    }).flatten().value();
    _.each(code, function(line, n){
      console.log((n+1)+":", line+"\n");
    });
  }

  function firstUpperCase(str) {
    return str[0].toUpperCase()+str.slice(1);
  }

  function ORMGenerator(table) {
    if(this instanceof ORMGenerator) {
      this.table = table;
    } else {
      return new ORMGenerator(table);
    }
  }

  /**
   *
   * @param {Table} table
   * @returns {*}
   */
  ORMGenerator.prototype.getConstructor = function() {
    var self = this;
    return Reindent("function "+self.table.name+"(options) {" +
      "if(this instanceof "+self.table.name+") {" +
      "  if(typeof options !== 'undefined') {" +
      "    this.validate(options).catch(function(error){" +
      "      console.error('Warning: Invalid values for \""+self.table.name+"\" model: '+JSON.stringify(error)); " +
      "    });" +
      "  }" +
      "  options = options || {};" +

      _(self.table.columns).map(function(column, columnName){
        return "  this."+columnName+" = options."+columnName+";";
      }).flatten().value().join("\n") +

      "} else {" +
      "  return new "+self.table.name+"(options);" +
      "}" +
        //"this._model = "+tableName+".model;" +

      "}");
  };

  ORMGenerator.prototype.getGetters = function() {
    var self = this;

    // getters
    return _.map(self.table.columns, function(column, columnName){
      return Reindent(self.table.name+".prototype.get"+firstUpperCase(columnName)+" = function(){"+
        "return this."+columnName+";" +
        "};")
    });
  };

  ORMGenerator.prototype.getSetters = function() {
    var self = this;

    // getters
    return _.map(self.table.columns, function(column, columnName){
      return Reindent(self.table.name+".prototype.set"+firstUpperCase(columnName)+" = function("+columnName+"){"+
        "this."+columnName+" = "+self.table.name+".validate("+columnName+");" +
        "return this;" +
        "};")
    });
  };

  ORMGenerator.prototype.getCreate = function() {
    var self = this;

    return Reindent(
      self.table.name+".prototype.getCreateSql = function() {" +
      " return \""+getSql()+"\"" +
      "};" +
      self.table.name+".prototype.create = function() {" +
      "  return this.validate().then(function(){" +
      "    var sql = this.getCreateSql();" +
      "    return PgClient.query(sql);" +
      "  });" +
      "};"
    );

    function getSql() {
      var columns = [];
      var values = [];
      _.each(self.table.columns, function(column, columnName){
        columns.push("\\\""+columnName+"\\\"");
        //values.push("\"+valueMapper(this."+columnName+")+\"");
        values.push("'\"+this.valueMapper(this."+columnName+")+\"'");
      });
      return "insert into \\\"" + self.table.name + "\\\" (" + columns.join(", ") + ") values (" + values.join(", ") + ")";
    }
  };

  ORMGenerator.prototype.getSave = function() {
    var self = this;

    return Reindent(
      self.table.name+".prototype.getSaveSql = function() {" +
      "  return \""+getSql()+"\";" +
      "};" +
      self.table.name+".prototype.save = function() {" +
      "  return this.validate().then(function(){" +
      "    var sql = this.getSaveSql();" +
      "    return PgClient.query(sql);" +
      "  });" +
      "};"
    );

    function getSql() {
      var set = [];
      _.each(self.table.columns, function(column, columnName){
        set.push("\\\""+columnName+"\\\" = '\"+this."+columnName+"+\"'");
      });
      return "update \\\"" + self.table.name + "\\\" set "+set.join(", ");
    }
  };

  ORMGenerator.prototype.getDelete = function() {
    var self = this;
    var code = [];
    code.push(self.table.name+".prototype.getDeleteSql = function() {");
    code.push("  return \"delete from \\\""+self.table.name+"\\\" where id = \"+this.id+\"\";");
    code.push("};");
    code.push(self.table.name+".prototype.delete = function() {");
    code.push("  if(! this.id) {");
    code.push("    throw new Error(\"Cannot remove "+self.table.name+", id is undefined\");");
    code.push("  }");
    code.push("  return PgClient.query(this.getDeleteSql());");
    code.push("}");
    code.push("");

    return Reindent(code);
  };

  ORMGenerator.prototype.getFieldValidator = function() {
    var self = this;

    var FieldValidatorFactoryCode = FieldValidator.toCode();

    var code = [
      "function(name, value) {",
      FieldValidatorFactoryCode,
      "var fieldValidator = FieldValidatorFactory(_, Promise);",
      "var column = "+self.table.name+".table.columns[name];",
      "if(! column) {",
      "  throw new Error('Column '+name+' is not defined on this model');",
      "}",
      "var validatorProperties = column.getValidationProperties();",
      "return fieldValidator(validatorProperties, value, name);",
      "}"
    ];

    return code.join("\n");
  };

  ORMGenerator.prototype.getValidator = function() {
    var self = this;

    var EntityValidatorFactoryCode = EntityValidator.toCode();
    var FieldValidatorFactoryCode = FieldValidator.toCode();

    var code = [
      "/**",
      "*",
      "* @param {object} options field->value map (optional - will use this if not available instead)",
      "* @returns {string}",
      "*/",
      "function(options) {",
      "options = options || this;",
      FieldValidatorFactoryCode,
      EntityValidatorFactoryCode,
      "var fieldValidator = FieldValidatorFactory(_, Promise);",
      "var entityValidator = EntityValidatorFactory(_, Promise, fieldValidator);",
      "var validatorProperties = "+self.table.name+".table.validationProperties;",
      "return entityValidator(validatorProperties, options, '"+self.table.name+"');",
      "}"
    ];

    return code.join("\n");
  };

  ORMGenerator.prototype.getValueMapper = function() {
    var self = this;
    var code = [
      "function(value) {",
      "  if(_.isPlainObject(value) || _.isArray(value) || _.isBoolean(value) || _.isNull(value)) {",
      "    return JSON.stringify(value);",
      "  } else if(_.isString(value)) {",
      "    return value.replace(/'/g, \"''\");",
      "  } else {",
      "    return value;",
      "  }",
      "};"
    ];

    return code.join("\n");
  };

  ORMGenerator.prototype.generateCode = function() {
    var self = this;
    var code = [];

    code.push(self.getConstructor());
    code.push(self.table.name+".table = "+JSON.stringify(self.table, undefined, 2)+";");
    code.push(self.table.name+".table.validationProperties = "+JSON.stringify(self.table.getValidationProperties(), undefined, 2)+";");
    code.push(self.table.name+".validateField = "+self.getFieldValidator()+";");
    code.push(self.table.name+".prototype.validate = "+self.getValidator()+";");
    code.push(self.table.name+".prototype.valueMapper = "+self.getValueMapper()+";");

    code.push(self.getGetters());
    code.push(self.getSetters());
    code.push(self.getCreate());
    code.push(self.getSave());
    code.push(self.getDelete());

    return Reindent(code);
  };

  ORMGenerator.prototype.getOrm = function(PgClient) {
    var self = this;
    var code = Reindent([
      "module.exports = function(_, Promise, PgClient) {",
      self.generateCode(),
      "return "+self.table.name+";",
      "};"
    ]);
    return TempModuleGenerator(code)(_, Promise, PgClient);
  };

  return ORMGenerator;
});