require("../index");
var Autowire = require("../autowire");

Autowire(function(_, uuid, path, assert,
                  TempModuleGenerator) {

  var code = "module.exports = 'test123';";
  var _module = TempModuleGenerator(code);

  var keys = Object.keys(require.cache);
  process.stdout.write(keys[keys.length - 1]+"\n");

  throw new Error('test');

});