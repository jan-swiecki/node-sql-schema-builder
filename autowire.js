var Autowire = require("autowire");
Autowire.addImportPath("./lib/types");
Autowire.addImportPath("./lib/validator");
Autowire.addImportPath("./lib/orm_generator");
Autowire.alias("_", "lodash");
Autowire.alias("Promise", "bluebird");

module.exports = Autowire;