//var fs = require("fs");
//var assert = require("assert");
//var uuid = require("uuid");
//
//var Validator = require("../lib/validator/Validator");
require("../index");
var Autowire = require("../autowire");

Autowire(function(_, uuid, path, assert, fs, FieldValidator, Builder){
  var currentDir = path.parse(module.id).dir;

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

  describe("Field Validator", function(){

    var Table = Builder.Table;
    var Column = Builder.Column;
    var ForeignKey = Builder.ForeignKey;
    var Type = Builder.Type;

    // build
    var Group = Table("Group").add(
      Column("id", Type.UUID).primaryKey(),
      Column("name", Type.VARCHAR(64)).notNull(),
      Column("test", Type.VARCHAR(4)).notNull(),
      Column("canBeNull", Type.VARCHAR(10))
    );

    var User = Table("User").add(
      Column("id", Type.UUID).primaryKey(),
      Column("name", Type.VARCHAR(64)).notNull(),
      Column("about", Type.JSON)
        .notNull()
        .default({"info": "", "bulletPoints": []}),
      Column("emails", Type.JSON)
        .notNull()
        .default([]),
      Column("createdAt", Type.TIMESTAMPTZ).notNull(),
      Column("modifiedAt", Type.TIMESTAMPTZ).notNull(),
      Column("group", Type.UUID),
      ForeignKey("group", Group, "id")
    );

    //describe('Group validation by Column #1', function(){
    //  var group = {
    //    id: uuid.v4(),
    //    name: "Microsoft",
    //    test: "x",
    //    canBeNull: null
    //  };
    //
    //  _.each(Group.columns, function(column, key){
    //    it('should validate column '+key, function(done) {
    //      var validationProperties = column.getValidationProperties();
    //      Validator(validationProperties, group[key], key).then(done);
    //    });
    //  });
    //});

    describe('UUID validation', function(){
      var column = Column("id", Type.UUID).primaryKey();

      testSuccess('should succeed on good format', column, uuid.v4());
      testSuccess('should succeed on good format', column, uuid.v4());
      testSuccess('should succeed on good format', column, uuid.v4());
      testSuccess('should succeed on good format', column, uuid.v4());
      testSuccess('should succeed on good format', column, uuid.v4());
      testSuccess('should succeed on good format', column, uuid.v4().toUpperCase());
      testSuccess('should succeed on null', column, null);

      testError('should fail on wrong format', column, '111');
      testError('should fail on wrong format', column, uuid.v4()+"x");
      testError('should fail on wrong format', column, uuid.v4().replace(/./, "["));
      testError('should fail on wrong format', column, uuid.v4().replace(/./g, "a"));

      testError('should fail on wrong type', column, 123);
      testError('should fail on wrong type', column, new RegExp(""));
      testError('should fail on wrong type', column, new Date());
      testError('should fail on wrong type', column, undefined);

    });

    describe('Null validation', function() {
      var notNullColumn = Column("name", Type.VARCHAR).notNull();
      testError('should fail on null', notNullColumn, null);

      var nullColumn = Column("name", Type.VARCHAR);
      testSuccess('should not fail on null', nullColumn, null);
    });

    describe('Unlimited string validation', function(){
      var column = Column("name", Type.VARCHAR).primaryKey();

      testSuccess('should succeed on good format', column, randomString(10, 100));
      testSuccess('should succeed on good format', column, randomString(10, 100));
      testSuccess('should succeed on good format', column, randomString(10, 100));
      testSuccess('should succeed on good format', column, randomString(0, 1000));
      testSuccess('should succeed on good format', column, randomString(0, 1000));
      testSuccess('should succeed on good format', column, randomString(0, 1));
      testSuccess('should succeed on good format', column, randomString(0, 1));
      testSuccess('should succeed on good format', column, "");
      testSuccess('should succeed on good format', column, "!@#$%^&*((&)*($&*^$&#;'][<>?<./,/~/\\|");
      testSuccess('should succeed on null', column, null);

      testError('should fail on wrong type', column, 123);
      testError('should fail on wrong type', column, new RegExp(""));
      testError('should fail on wrong type', column, new Date());
      testError('should fail on wrong type', column, undefined);
    });

    describe('randomString', function(){
      test(0);
      test(1);
      test(2);
      test(5);
      test(10);
      test(11);
      test(20);

      it('randomString(-1) should be length 0', function() {
        assert.equal(randomString(-1).length, 0);
      });

      function test(size) {
        it('randomString('+size+') should be length '+size, function() {
          assert.equal(randomString(size).length, size);
        });
      }
    });

    describe('Limited string validation', function(){
      var column = Column("name", Type.VARCHAR(32)).primaryKey();

      testSuccess('should succeed on good length', column, randomString(32));
      testSuccess('should succeed on good length', column, randomString(32));
      testSuccess('should succeed on good length', column, randomString(32));
      testSuccess('should succeed on good length', column, randomString(16));
      testSuccess('should succeed on good length', column, randomString(16));
      testSuccess('should succeed on good length', column, randomString(16));
      testSuccess('should succeed on good length', column, randomString(1));
      testSuccess('should succeed on good length', column, randomString(1));
      testSuccess('should succeed on good length', column, randomString(1));
      testSuccess('should succeed on good length', column, "");

      testSuccess('should succeed on null', column, null);

      testError('should fail on wrong length', column, randomString(33));
      testError('should fail on wrong length', column, randomString(34));
      testError('should fail on wrong length', column, randomString(64));
      testError('should fail on wrong length', column, randomString(128));
      testError('should fail on wrong length', column, randomString(1024));

      testError('should fail on wrong type', column, 123);
      testError('should fail on wrong type', column, new RegExp(""));
      testError('should fail on wrong type', column, new Date());
      testError('should fail on wrong type', column, undefined);
    });

    describe('Timestamp with time zone validation', function(){
      var column = Column("date", Type.TIMESTAMPTZ).notNull();

      testSuccess('should succeed on good format', column, '1999-01-08');
      testSuccess('should succeed on good format', column, '1999-01-08 04:05:06');
      testSuccess('should succeed on good format', column, '1999-01-08 04:05:06 -8:00');
      testSuccess('should succeed on good format', column, '1999-01-08 04:05:06+02');
      testSuccess('should succeed on good format', column, '9999-12-31 23:59:59+14');
      testSuccess('should succeed on good format', column, '9999-12-31 23:59:59-11');
      testSuccess('should succeed on good format', column, '9999-12-31 23:59:59+00');

      // failing dates found in full validation
      testSuccess('should succeed on good format', column, '2015-10-04 00:34:52');

      testError('should fail on null', column, null);

      testError('should fail on wrong format', column, '1999-13-01');
      testError('should fail on wrong format', column, '1999-01-01 24:00:00');
      testError('should fail on wrong format', column, '1999-01-01 10:60:00');
      testError('should fail on wrong format', column, '1999-01-01 10:74:00');
      testError('should fail on wrong format', column, '1999-01-01 10:00:60');
      testError('should fail on wrong format', column, '1999-01-01 10:00:91');
      testError('should fail on wrong format', column, '1999-01-01 10:00:1111');
      testError('should fail on wrong format', column, '1999-01-01 1111:11:00');
      testError('should fail on wrong format', column, '1999-01-01 11:1111:00');
      testError('should fail on wrong format', column, '1999-01-01 10:00:00+99');
      testError('should fail on wrong format', column, '1999-01-01 10:00:00+99');
      testError('should fail on wrong format', column, '1999-01-01 10:00:00+15');
      testError('should fail on wrong format', column, '1999-01-01 10:00:00-12');
      testError('should fail on wrong format', column, '1999-01-01 10:00:00 +50:00');
      testError('should fail on wrong format', column, '1999-01-01 10:00:00 -50:00');
      testError('should fail on wrong format', column, '1999-01-01 10:00:00 +5:30');
      testError('should fail on wrong format', column, '1999-01-01 10:00:00 -5:30');
      testError('should fail on wrong format', column, '9999-12-31 23:59:59+23');
      testError('should fail on wrong format', column, '9999-12-31 23:59:59-23');
      testError('should fail on wrong format', column, '2015-01-01 10:00:00+');
      testError('should fail on wrong format', column, '2015-01-01 10:00:00-');

      testError('should fail on wrong format', column, 'asd');
      testError('should fail on wrong length', column, '99-01-08');
      testError('should fail on wrong length', column, '04:05:06');
      testError('should fail on wrong length', column, '1999-09');

      testError('should fail on wrong type', column, 123);
      testError('should fail on wrong type', column, new RegExp(""));
      testError('should fail on wrong type', column, new Date());
      testError('should fail on wrong type', column, undefined);
    });

    describe('Timestamp without time zone validation', function(){
      var column = Column("date", Type.TIMESTAMP).notNull();

      testSuccess('should succeed on good format', column, '1999-01-08');
      testSuccess('should succeed on good format', column, '1999-01-08 04:05:06');
      testSuccess('should succeed on good format', column, '2015-12-31 23:59:59');
      testError('should fail on wrong format', column, '1999-01-08 04:05:06 -8:00');
      testError('should fail on wrong format', column, '1999-01-08 04:05:06+02');
      testError('should fail on wrong format', column, '9999-12-31 23:59:59+14');
      testError('should fail on wrong format', column, '9999-12-31 23:59:59-11');
      testError('should fail on wrong format', column, '9999-12-31 23:59:59+00');

      testError('should fail on null', column, null);

      testError('should fail on wrong format', column, '1999-13-01');
      testError('should fail on wrong format', column, '1999-01-01 24:00:00');
      testError('should fail on wrong format', column, '1999-01-01 10:60:00');
      testError('should fail on wrong format', column, '1999-01-01 10:74:00');
      testError('should fail on wrong format', column, '1999-01-01 10:00:60');
      testError('should fail on wrong format', column, '1999-01-01 10:00:91');
      testError('should fail on wrong format', column, '1999-01-01 10:00:1111');
      testError('should fail on wrong format', column, '1999-01-01 1111:11:00');
      testError('should fail on wrong format', column, '1999-01-01 11:1111:00');
      testError('should fail on wrong format', column, '1999-01-01 10:00:00+99');
      testError('should fail on wrong format', column, '1999-01-01 10:00:00+99');
      testError('should fail on wrong format', column, '1999-01-01 10:00:00+15');
      testError('should fail on wrong format', column, '1999-01-01 10:00:00-12');
      testError('should fail on wrong format', column, '1999-01-01 10:00:00 +50:00');
      testError('should fail on wrong format', column, '1999-01-01 10:00:00 +5:30');
      testError('should fail on wrong format', column, '9999-12-31 23:59:59+23');

      testError('should fail on wrong format', column, 'asd');
      testError('should fail on wrong length', column, '99-01-08');
      testError('should fail on wrong length', column, '04:05:06');
      testError('should fail on wrong length', column, '1999-09');

      testError('should fail on wrong type', column, 123);
      testError('should fail on wrong type', column, new RegExp(""));
      testError('should fail on wrong type', column, new Date());
      testError('should fail on wrong type', column, undefined);
    });

    describe('Timestamp with time zone FULL VALIDATION', function() {
      var column = Column("date", Type.TIMESTAMPTZ).notNull();

      // approx 1000 deltaTimes in one year
      //var deltaTime = 1036800;
      var yearAndAHalf = 1.5*24*60*60*265*1000;
      var currTime = new Date().getTime();

      var i;
      for(i = 0; i <= 100; i++) {
        var delta = yearAndAHalf * Math.random();
        var date = new Date(currTime + delta);

        var timestamp = date.getFullYear()+
          "-"+prefix(date.getMonth()+1)+
          "-"+prefix(date.getDay()+1)+
          " "+prefix(date.getHours())+
          ":"+prefix(date.getMinutes())+
          ":"+prefix(date.getSeconds());

        testSuccess('should succeed on good format', column, timestamp);

        function prefix(x) {
          return x < 10 ? "0"+x : x+"";
        }
      }

    });

    describe('JSON without default value', function() {
      var column = Column("date", Type.JSON).notNull();

      testSuccess('should succeed on good format', column, {});
      testSuccess('should succeed on good format', column, {x: 1});
      testSuccess('should succeed on good format', column, []);
      testSuccess('should succeed on good format', column, [1,2,3]);
      testSuccess('should succeed on good format', column, true);
      testSuccess('should succeed on good format', column, false);
      testSuccess('should succeed on good format', column, "string");
      testSuccess('should succeed on good format', column, 123);

      testError('should fail on null', column, null);
      testError('should fail on wrong format', column, function() {});
      testError('should fail on wrong format', column, Class);
      testError('should fail on wrong format', column, new Class());

      function Class() {
      }

      testError('should fail on wrong type', column, new RegExp(""));
      testError('should fail on wrong type', column, new Date());
      testError('should fail on wrong type', column, undefined);
    });

    describe('JSON with default value []', function() {
      var column = Column("date", Type.JSON)
        .default([])
        .notNull();

      testError('should fail on wrong format', column, {});
      testError('should fail on wrong format', column, {x: 1});
      testSuccess('should succeed on good format', column, []);
      testSuccess('should succeed on good format', column, [1,2,3]);
      testError('should fail on wrong format', column, true);
      testError('should fail on wrong format', column, false);
      testError('should fail on wrong format', column, "string");

      testError('should fail on null', column, null);
      testError('should fail on wrong format', column, function() {});
      testError('should fail on wrong format', column, Class);
      testError('should fail on wrong format', column, new Class());

      function Class() {
      }

      testError('should fail on wrong type', column, 123);
      testError('should fail on wrong type', column, new RegExp(""));
      testError('should fail on wrong type', column, new Date());
      testError('should fail on wrong type', column, undefined);
    });

    describe('JSON with default value {"info": "", "bulletPoints": []}', function() {
      var column = Column("date", Type.JSON)
        .default({"info": "", "bulletPoints": []})
        .notNull();

      testSuccess('should succeed on good format', column, {"info": "asd", "bulletPoints": ["123"]});
      testSuccess('should succeed on good format', column, {"info": "asd", "bulletPoints": ["123", "5432"]});

      testError('should fail on wrong format', column, {"info": "asd"});
      testError('should fail on wrong format', column, {"bulletPoints": ["123"]});

      testError('should fail on wrong format', column, {});
      testError('should fail on wrong format', column, {x: 1});
      testError('should fail on wrong format', column, []);
      testError('should fail on wrong format', column, [1,2,3]);
      testError('should fail on wrong format', column, true);
      testError('should fail on wrong format', column, false);
      testError('should fail on wrong format', column, "string");

      testError('should fail on null', column, null);
      testError('should fail on wrong format', column, function() {});
      testError('should fail on wrong format', column, Class);
      testError('should fail on wrong format', column, new Class());

      function Class() {
      }

      testError('should fail on wrong type', column, 123);
      testError('should fail on wrong type', column, new RegExp(""));
      testError('should fail on wrong type', column, new Date());
      testError('should fail on wrong type', column, undefined);
    });

    function testSuccess(msg, column, value) {
      it(msg+": "+value, function(done) {
        var validationProperties = column.getValidationProperties();
        FieldValidator(validationProperties, value, column.name).then(wrap(done)).catch(function(err){
          if(err instanceof Error) {
            done(err);
          } else {
            done(new Error(err));
          }
        });
      });
    }

    function testError(msg, column, value) {
      it(msg+": "+value, function(done) {
        var validationProperties = column.getValidationProperties();
        FieldValidator(validationProperties, value, column.name).then(function(x){
          done(new Error("Succeeded but should fail"));
        }).catch(function(err){
          done();
        });
      });
    }

    function randomChar() {
      return Math.random().toString(36)[3];
    }

    function randomString(size) {
      var i;
      var ret = [];
      for(i = 0; i < size; i++) {
        ret.push(randomChar());
      }
      return ret.join("");
    }

  });

});