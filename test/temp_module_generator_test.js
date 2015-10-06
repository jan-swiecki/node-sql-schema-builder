require("../index");
var Autowire = require("../autowire");

Autowire(function(_, uuid, path, fs,
                  assert, child_process,
                  TempModuleGenerator) {

  var currentDir = path.parse(module.id).dir;

  describe("TempModuleGenerator", function () {
    it('should create module', function(){
      var value = "test123";
      var code = "module.exports = '"+value+"';";
      var _module = TempModuleGenerator(code);

      assert.strictEqual(_module, value);
    });

    it('should remove module after process exit', function(done){

      spawn('temp_module_generator_remove_tester').then(function(output){
        var modulePath = output.split("\n")[0];
        if(fs.existsSync(modulePath)) {
          done(new Error("module \""+modulePath+"\" still exists after process exit"));
        } else {
          done();
        }
      }).catch(function(modulePath){
        done(new Error("Error in "+modulePath));
      });

    });

    it('should not remove module after process exit', function(done){

      spawn('temp_module_generator_remove_tester2').then(function(modulePath){
        done(new Error('Should exit with code 1'))
      }).catch(function(output) {
        var modulePath = output.split("\n")[0];
        if(fs.existsSync(modulePath)) {
          done();
        } else {
          done(new Error("module \""+modulePath+"\" should still exist after process exit"));
        }
      });

    });
  });

  function spawn(test) {
    return new Promise(function(resolve, reject){
      var spawn = child_process.spawn;
      var node = spawn('node', ['test/'+test+'.js']);

      var data = '';
      var err = '';
      node.stdout.on('data', function(d) {
        data += d;
      });

      node.stderr.on('data', function(e){
        err += e;
      });

      node.on('close', function (code) {
        if(code === 0) {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }


});