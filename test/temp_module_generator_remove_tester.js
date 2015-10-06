require("../index");
var Autowire = require("../autowire");

Autowire(function(_, uuid, path, assert,
                  TempModuleGenerator) {

  var value = "test123";
  var code = "module.exports = '"+value+"';";
  var _module = TempModuleGenerator(code);

  var keys = Object.keys(require.cache);
  process.stdout.write(keys[keys.length - 1]);

});