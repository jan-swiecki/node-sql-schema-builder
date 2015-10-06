module.exports = require('autowire')(function(_, os, fs, esprima,
                                              escodegen, path) {

  /**
   *
   * @param {string|object} code
   * @constructor
   */
  function TempModuleGenerator(code) {

    if(! _.isString(code)) {
      code = escodegen.generate(code);
    }

    var tmpDir = os.tmpdir();
    var tmpFilename = Math.random().toString(36).substring(2)+".js";

    var filepath = tmpDir+path.sep+tmpFilename;

    fs.writeFileSync(filepath, code, "utf8");

    process.on('exit', function(){
      fs.unlinkSync(filepath);
    });

    return require(filepath);
  }

  return TempModuleGenerator;

});