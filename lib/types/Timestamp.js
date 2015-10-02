module.exports = Autowire(function(_, util, Type) {
  function Timestamp() {
    if(this instanceof Timestamp) {
      this._withTimezone = false;
      Timestamp.super_.call(this, "timestamp");
    } else {
      return new Timestamp();
    }
  }

  Timestamp.prototype.clone = function() {
    var clone = Object.create(Timestamp.prototype);
    _.extend(clone, this);
    return clone;
  };

  util.inherits(Timestamp, Type);

  Timestamp.prototype.withTimezone = function() {
    var clone = this.clone();
    clone.addKeyword("WITH TIME ZONE");
    return clone;
  };

  Type.TIMESTAMP = Timestamp();
  Type.TIMESTAMPTZ = Timestamp().withTimezone();

  return Timestamp;
});