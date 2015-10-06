/**
 * This module exports function that parses and regenerates parsed code.
 *
 * Input can be any string, array of strings or array of array of strings.
 * Everything will be joined with '\n' newline character.
 *
 * The purpose is to have nicely indented code.
 */
module.exports = require('autowire')(function(_, esprima, escodegen) {

  /**
   * Reindents code and return it as string.
   *
   * @param {string|Array} code code in string, or array of strings or array of array of strings
   * @returns {string} reindented code joined with '\n' new line character (in case of array/arrays)
   * @constructor
   */
  function Reindent(code) {
    code = toString(code);
    return escodegen.generate(parse(code), {indent: '  '});
  }

  return Reindent;

  function toString(code) {
    if(_.isArray(code)) {
      return _.map(code, function(line) {
        return toString(line);
      }).join("\n");
    } else {
      return code.toString();
    }
  }

  function parse(code) {
    try {
      return esprima.parse(code);
    } catch(error) {
      console.error("Error from generating below code");
      console.error("--------------------------------");
      console.error(code.split("\n").map(function(line, i){
        return i+":"+line;
      }).join("\n"));

      throw error;
    }
  }
});