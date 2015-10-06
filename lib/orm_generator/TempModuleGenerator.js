module.exports = require('autowire')(function(_, os, fs, esprima,
                                              escodegen, path) {

  /**
   *
   * @param {string|object} code
   * @param optionalPrefix
   */
  function TempModuleGenerator(code, optionalPrefix) {

    optionalPrefix = optionalPrefix ? optionalPrefix+"_" : "";

    if(! _.isString(code)) {
      code = escodegen.generate(code);
    }

    var tmpDir = os.tmpdir();
    var tmpFilename = Math.random().toString(36).substring(2)+".js";

    var filepath = optionalPrefix+tmpDir+path.sep+tmpFilename;

    fs.writeFileSync(filepath, code, "utf8");

    process.on('exit', function(code){
      if(code === 0) {
        fs.unlinkSync(filepath);
      } else {
        process.stdout.write("[TempModuleGenerator] File \""+filepath+"\" is not being removed because of error exit code\n");
      }
    });

    return require(filepath);
  }

  return TempModuleGenerator;

});