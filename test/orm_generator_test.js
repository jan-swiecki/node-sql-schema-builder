require("../index");
var Autowire = require("../autowire");

Autowire(function(_, uuid, path, assert, fs,
                  FieldValidator, Builder,
                  ORMGenerator, esprima) {

  var currentDir = path.parse(module.id).dir;

  /**
   * Returns function which executes <code>done</code> without arguments.
   *
   * @param done
   * @returns {Function}
   */
  function wrap(done) {
    return function () {
      return done();
    };
  }

  /**
   * Compare code logical equivalence (token-equivalence).
   * @param codeString1
   * @param codeString2
   * @returns {Boolean} true if codes are token-equivalent
   */
  function compareCode(codeString1, codeString2) {

    return convert(codeString1) === convert(codeString2);

    function convert(code){
      return JSON.stringify(esprima(code));
    }

  }

  var Table = Builder.Table;
  var Column = Builder.Column;
  var ForeignKey = Builder.ForeignKey;
  var Type = Builder.Type;

  describe("ORMGenerator", function () {
    var User = Table("User").add(
      Column("id", Type.UUID).primaryKey(),
      Column("name", Type.VARCHAR(64)).notNull(),
      Column("about", Type.JSON)
        .notNull()
        .default({"info": "", "bulletPoints": []}),
      // TODO: later this kind of field should have another non-db related validation like email validation
      Column("emails", Type.JSON)
        .notNull()
        .default([]),
      Column("createdAt", Type.TIMESTAMPTZ).notNull(),
      Column("modifiedAt", Type.TIMESTAMPTZ).notNull()
    );

    var expectedOrmString = fs.readFileSync(__dirname + "/orm_expected_user.js", "utf8");
    var actualCodeString = ORMGenerator(User).generateCode();

    it('should generate proper ORM code', function(){
      assert.strictEqual(actualCodeString, expectedOrmString, "code should be identical");
    });

  });

});