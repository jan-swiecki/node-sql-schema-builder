module.exports = require("autowire")(function(_, Promise, escodegen, esprima) {

  /**
   * fieldProperties format:
   *   {Boolean} isNull - is null allowed
   *   {Boolean} isUnique - has unique constraint
   *   {Boolean} hasLength - if false then `length` is undefined
   *   {boolean} hasDefault - if false then `default` is undefined
   *   {String} type - one of "string", "number", "json", "timestamp"
   *   {Number} length - maximum length of string (works only in context of `type === "string"` if `hasLength` is `true`)
   *   {Mixed} default - default value of field
   *
   * @param fieldProperties see format above
   * @param value value to validate against
   * @param optionalName optional name of the field which we are validating
   * @returns {Promise}
   * @constructor
   */
  function FieldValidator(fieldProperties, value, optionalName) {

    var postfix = optionalName ? " (name: "+optionalName+")" : "";

    if(_.isUndefined(value)) {
      // use null instead
      return promiseReject("value cannot be undefined"+postfix);
    }

    if(_.isNull(value)) {
      if(fieldProperties.isNull) {
        return Promise.resolve();
      } else {
        return promiseReject("value cannot be null"+postfix);
      }
    }

    // -- below this line value is not null --

    if(fieldProperties.type === "uuid") {
      return rejectIfNotString().then(function(){
        return finish(
          value.match(/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$/i),
          "value is not in the UUID format"+postfix
        );
      });
    } else if(fieldProperties.type === "string") {
      return rejectIfNotString().then(function(){
        return new Promise(function(res, rej){
          if(fieldProperties.hasLength) {

            if(value.length <= fieldProperties.length) {
              res();
            } else {
              rej(error("String size exceeded, maximum is "+fieldProperties.length+", actual size: "+value.length));
            }

          } else {
            return res();
          }
        })
      });
    } else if(fieldProperties.type === "number") {
      return new Promise(function(res, rej){
        if(_.isNumber(value)){
          throw new Error("Not implemented: check number length"+postfix);
        } else {
          rej(error("value is not a number"));
        }
      });
    } else if(fieldProperties.type === "timestamp with time zone") {
      return rejectIfNotString().then(function(){
        return finish(
          validateTimestampWithTimezone(value),
          "value is not in the TIMESTAMP WITH TIME ZONE format"+postfix
        );
      });
    } else if(fieldProperties.type === "timestamp") {
      return rejectIfNotString().then(function(){
        return finish(
          validateTimestampWithoutTimezone(value),
          "value is not in the TIMESTAMP WITH TIME ZONE format"+postfix
        );
      });
    } else if(fieldProperties.type === "json") {
      var isProperJson = finish(
        _.isPlainObject(value) || _.isArray(value) || _.isString(value)
        || _.isBoolean(value) || _.isNumber(value),
        'value is not in json format'
      );

      if(fieldProperties.hasDefault) {
        return isProperJson.then(function() {
          if(jsonSameStructures(value, fieldProperties.default)) {
            return Promise.resolve();
          } else {
            return promiseReject("value is not in the same format as default value");
          }
        });
      } else {
        return isProperJson;
      }
    }

    return promiseReject("encountered unknown type during validation: \""+fieldProperties.type.name+"\"");

    function rejectIfNotString() {
      if(! _.isString(value)) {
        return Promise.reject("value must be a string"+postfix);
      } else {
        return Promise.resolve();
      }
    }

    function finish(check, errorMsg) {
      if(check) {
        return Promise.resolve();
      } else {
        return promiseReject(errorMsg);
      }
    }

    function error(msg) {
      return {
        message: msg,
        name: optionalName
      }
    }

    function promiseReject(msg) {
      return Promise.reject(error(msg));
    }

    // -- date operations --

    /**
     * @author http://stackoverflow.com/a/1433119/1637178
     * @param m
     * @param y
     * @returns {number}
     */
    function daysInMonth(m, y) { // m is 0 indexed: 0-11
      switch (m) {
        case 1:
          return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
        case 8: case 3: case 5: case 10:
        return 30;
        default:
          return 31
      }
    }

    function isValidDate(d, m, y) {
      return m >= 0 && m < 12 && d > 0 && d <= daysInMonth(m, y);
    }

    function getTimestampRegExp(timezone) {
      timezone = timezone || false;

      var dateFormat = "YYYY-mm-dd";
      var timeFormat = "H:i:s";
      var timezoneFormat1 = "STT";
      var timezoneFormat2 = "STT:00";

      var withTZ = "^"+dateFormat+"(?: "+timeFormat+"(?:"+timezoneFormat1+"| "+timezoneFormat2+"|)|)$";
      var withoutTZ = "^"+dateFormat+"(?: "+timeFormat+"|)$";

      function replace(str) {
        return str.replace(/YYYY/g, "([0-9]{4})")
          .replace(/dd/g, "([0-9]{2})")
          .replace(/mm/g, "(0[1-9]|1[0-2])")
          .replace(/H/g, "(?:0[0-9]|1[0-9]|2[0-3])")
          .replace(/STT/g, "((?:\\+|\\-)(?:[0-9]{1,2}))")
          .replace(/i/g, "[0-5][0-9]")
          .replace(/s/g, "[0-5][0-9]");
      }

      return new RegExp(replace(timezone ? withTZ : withoutTZ));
    }

    function getTimestampRegExpWithoutTimezone() {
      return getTimestampRegExp(false);
    }

    function getTimestampRegExpWithTimezone() {
      return getTimestampRegExp(true);
    }

    function validateTimestamp(timestamp, timezone) {
      var regExp = getTimestampRegExp(timestamp, timezone);

      var m = timestamp.match(regExp);

      if(m) {
        var year = m[1];
        var month = m[2];
        var day = m[3];
        var tz = m[4] || m[5];

        var validTz;
        if(timezone) {
          if(typeof tz !== 'undefined') {
            var tzInt = parseInt(tz, 10);
            validTz = tzInt >= -11 && tzInt <= 14;
          } else {
            validTz = true;
          }
        } else {
          validTz = typeof tz === 'undefined';
        }

        return validTz && isValidDate(day, month-1, year);
      } else {
        return false;
      }
    }

    function validateTimestampWithTimezone(timestamp) {
      return validateTimestamp(timestamp, true);
    }

    function validateTimestampWithoutTimezone(timestamp) {
      return validateTimestamp(timestamp, false);
    }

    // -- json operations --
    function jsonSameStructures(obj1, obj2) {
      if(_.isArray(obj1)) {
        return _.isArray(obj2);
      }

      // replace all leaves with same value
      var obj1Clone = _.clone(obj1);
      var obj2Clone = _.clone(obj2);

      walk(obj1Clone);
      walk(obj2Clone);

      return JSON.stringify(obj1Clone) === JSON.stringify(obj2Clone);

      // convert to same structure with same values
      function walk(obj) {
        _.each(_.keys(obj), function(key) {
          if(_.isPlainObject(obj[key])) {
            walk(obj[key]);
          } else if(_.isArray(obj[key])) {
            obj[key] = [];
          } else if(_.isBoolean(obj[key])) {
            obj[key] = true;
          } else {
            obj[key] = "";
          }
        });
      }
    }

  }

  FieldValidator.toCode = function() {
    var code = [];
    code.push("function FieldValidatorFactory(_, Promise) {");
    code.push("return "+FieldValidator.toString()+";");
    code.push("}");
    return escodegen.generate(esprima.parse(code.join("\n")));
  };

  return FieldValidator;

});