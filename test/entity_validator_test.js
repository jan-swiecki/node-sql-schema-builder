require("../index");

Autowire(function(_, Builder, uuid, EntityValidator){

  var Table = Builder.Table;
  var Column = Builder.Column;
  var ForeignKey = Builder.ForeignKey;
  var Type = Builder.Type;

  describe('Group validation', function(){
    var Group = Table("Group").add(
      Column("id", Type.UUID).primaryKey(),
      Column("name", Type.VARCHAR(64)).notNull(),
      Column("test", Type.VARCHAR(4)).notNull(),
      Column("canBeNull", Type.VARCHAR(10))
    );

    testSuccess('should validate', Group, {
      id: uuid.v4(),
      name: "Haskell",
      test: "asd",
      canBeNull: null
    });

    testSuccess('should validate', Group, {
      id: uuid.v4(),
      name: "Haskell",
      test: "asd",
      canBeNull: "yes"
    });

    testError('should fail', Group, {
      id: uuid.v4(),
      name: "Haskell",
      test: null,
      canBeNull: null
    }, "test");

    testError('should fail', Group, {
      id: uuid.v4(),
      name: "Haskell",
      test: "123",
      canBeNull: undefined
    }, "canBeNull");

    testError('should fail', Group, {
      id: uuid.v4().replace(/./, "-"),
      name: "Haskell",
      test: "123",
      canBeNull: null
    }, "id");

    testError('should fail', Group, {
      id: uuid.v4(),
      name: "Haskell",
      test: "12345",
      canBeNull: null
    }, "test");

    testError('should fail', Group, {
      id: uuid.v4(),
      name: "Haskell",
      canBeNull: null
    }, "test");

    testError('should fail', Group, {
    }, "id");

  });

  describe('User validation', function() {
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

    testSuccess('should validate', User, {
      id: uuid.v4(),
      name: "Jan",
      about: {
        info: "test",
        bulletPoints: ["123"]
      },
      emails: ["email"],
      createdAt: '2015-01-01',
      modifiedAt: '2015-01-01'
    });

    testSuccess('should validate', User, {
      id: uuid.v4(),
      name: "Jan",
      about: {
        info: "test",
        bulletPoints: []
      },
      emails: [],
      createdAt: '2015-01-01',
      modifiedAt: '2015-01-01'
    });

    testError('should fail', User, {
      id: uuid.v4(),
      name: "Jan",
      about: {
        bulletPoints: []
      },
      emails: [],
      createdAt: '2015-01-01',
      modifiedAt: '2015-01-01'
    }, "about");

    testError('should fail', User, {
      id: uuid.v4(),
      name: "Jan",
      about: {
        info: "",
        bulletPoints: {}
      },
      emails: [],
      createdAt: '2015-01-01',
      modifiedAt: '2015-01-01'
    }, "about");

    testError('should fail', User, {
      id: uuid.v4(),
      name: "Jan",
      about: {
        info: "",
        bulletPoints: []
      },
      emails: true,
      createdAt: '2015-01-01',
      modifiedAt: '2015-01-01'
    }, "emails");

    testError('should fail', User, {
      id: uuid.v4(),
      name: "Jan",
      about: {
        info: "",
        bulletPoints: []
      },
      emails: [],
      createdAt: '20150101',
      modifiedAt: '2015-01-01'
    }, "createdAt");

  });

    /**
   * Returns function which executes <code>done</code> without arguments.
   *
   * @param done
   * @returns {Function}
   */
  function wrap(done) {
    return function() {
      return done();
    };
  }

  function testSuccess(msg, table, entity) {
    it(msg+": "+JSON.stringify(entity), function(done) {
      var validationProperties = table.getValidationProperties();
      EntityValidator(validationProperties, entity, table.name).then(wrap(done)).catch(function(err){
        if(err instanceof Error) {
          done(err);
        } else {
          done(new Error(err));
        }
      });
    });
  }

  /**
   *
   * @param msg
   * @param table
   * @param entity
   * @param expectedFailedField field on which validation should fail
   */
  function testError(msg, table, entity, expectedFailedField) {
    it(msg+": "+JSON.stringify(entity), function(done) {
      var validationProperties = table.getValidationProperties();
      EntityValidator(validationProperties, entity, table.name).then(function(){
        done(new Error("Succeeded but should fail"));
      }).catch(function(err){
        if(err.name === expectedFailedField) {
          done();
        } else {
          done(new Error('Validation should fail on field \"'+expectedFailedField+'\" but failed on \"'+err.name+'\" field instead'));
        }
      });
    });
  }

});