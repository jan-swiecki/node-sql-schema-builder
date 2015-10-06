require("../index");
var Autowire = require("../autowire");

Autowire(function(_, uuid, path, fs,
                  assert, child_process,
                  TempModuleGenerator) {

  var currentDir = path.parse(module.id).dir;

  describe("TempModuleGenerator", function () {
    var value = "test123";
    var code = "module.exports = '"+value+"';";
    var _module = TempModuleGenerator(code);

    it('should create module', function(){
      assert.strictEqual(_module, value);
    });

    it('should remove module after process exit', function(done){

      spawn().then(function(modulePath){
        if(fs.existsSync(modulePath)) {
          done(new Error("module \""+modulePath+"\" still exists after process exit"));
        } else {
          done();
        }
      }).catch(function(error){
        done(new Error(error));
      });

      function spawn() {
        return new Promise(function(resolve, reject){
          var spawn = child_process.spawn;
          var node = spawn('node', ['test/temp_module_generator_remove_tester.js']);

          var data = '';
          var err = '';
          node.stdout.on('data', function (d) {
            data += d;
          });

          node.stderr.on('data', function(e){
            err += e;
          });

          node.on('close', function (code) {
            if(err.length > 0) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      }
    });
  });

});