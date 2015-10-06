module.exports = require('autowire')(function(_, Reindent,
                                              TempModuleGenerator){

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
      "options = options || {};" +

      _(self.table.columns).map(function(column, columnName){
        return "this."+columnName+" = options."+columnName+";";
      }).flatten().value().join("\n") +

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
        "this."+columnName+" = "+columnName+";" +
        "return this;" +
        "};")
    });
  };

  ORMGenerator.prototype.getCreate = function() {
    var self = this;

    return Reindent(
      self.table.name+".prototype.create = function() {" +
      "var sql = \""+getSql()+"\";" +
      "return PgClient.query(sql);" +
      "};"
    );

    function getSql() {
      var columns = [];
      var values = [];
      _.each(self.table.columns, function(column, columnName){
        columns.push("'"+columnName+"'");
        //values.push("\"+valueMapper(this."+columnName+")+\"");
        values.push("\"+this."+columnName+"+\"");
      });
      return "insert into \\\"" + self.table.name + "\\\" (" + columns.join(", ") + ") values (" + values.join(", ") + ")";
    }
  };

  ORMGenerator.prototype.getSave = function() {
    var self = this;

    return Reindent(
      self.table.name+".prototype.save = function() {" +
      "if(! this.id) {" +
      "  throw new Error(\"Cannot remove "+self.table.name+", id is undefined\");" +
      "}" +
      "var sql = \""+getSql()+"\";" +
      "return PgClient.query(sql);" +
      "};"
    );

    function getSql() {
      var set = [];
      _.each(self.table.columns, function(column, columnName){
        set.push("\\\""+columnName+"\\\" = \"+this."+columnName+"+\"");
      });
      return "update \\\"" + self.table.name + "\\\" set "+set.join(", ");
    }
  };

  ORMGenerator.prototype.getDelete = function() {
    var self = this;
    var code = [];
    code.push(self.table.name+".prototype.delete = function() {");
    code.push("  if(! this.id) {");
    code.push("    throw new Error(\"Cannot remove "+self.table.name+", id is undefined\");");
    code.push("  }");
    code.push("  return PgClient.query(\"delete from \\\""+self.table.name+"\\\" where id = \"+this.id+\"\");");
    code.push("}");
    code.push("");

    return Reindent(code);
  };

  ORMGenerator.prototype.generateCode = function() {
    var self = this;
    var code = [];

    code.push(self.getConstructor());
    //code.push(table+".table = "+JSON.stringify(table, undefined, 2));

    code.push(self.getGetters());
    code.push(self.getSetters());
    code.push(self.getCreate());
    code.push(self.getSave());
    code.push(self.getDelete());

    return Reindent(code);
  };

  ORMGenerator.prototype.getOrm = function() {
    var self = this;
    var code = self.generateCode();
    code = code + "\nmodule.exports = "+self.table.name+";";
    return TempModuleGenerator(code);
  };

  return ORMGenerator;
});