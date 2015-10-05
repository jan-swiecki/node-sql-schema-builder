module.exports = Autowire(function(_, Promise, FieldValidator, EntityValidator) {

  function EntityValidator(fieldPropertiesMap, valuesMap, optionalName) {
    var postfix = optionalName ? " (name: "+optionalName+")" : "";

    var promises = _.map(fieldPropertiesMap, function(fieldProperties, name){
      return FieldValidator(fieldProperties, valuesMap[name], name);
    });

    return Promise.all(promises);
  }

  return EntityValidator;

});