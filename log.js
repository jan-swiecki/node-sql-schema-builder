module.exports = require('autowire')(function(DebugLogger){

    function Fn() {
        return DebugLogger.getLogger(undefined, 4);
    };

    Fn.executeOnEachImport = true;

    return Fn;

});

