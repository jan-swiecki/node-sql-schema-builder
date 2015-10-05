module.exports = require("autowire")(function(_, Promise, FieldValidator, esprima, escodegen) {

  function EntityValidator(fieldPropertiesMap, valuesMap, optionalName) {
    var postfix = optionalName ? " (name: "+optionalName+")" : "";

    var promises = _.map(fieldPropertiesMap, function(fieldProperties, name){
      return FieldValidator(fieldProperties, valuesMap[name], name);
    });

    return Promise.all(promises);
  }

  EntityValidator.toCode = function() {
    var code = [];
    code.push("function EntityValidatorFactory(_, Promise, FieldValidator) {");
    code.push("return "+EntityValidator.toString()+";");
    code.push("}");
    return escodegen.generate(esprima.parse(code.join("\n")));
  };


  return EntityValidator;

});