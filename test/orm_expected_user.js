function User(options) {
  options = options || {};
  this.id = options.id;
  this.name = options.name;
  this.about = options.about;
  this.emails = options.emails;
  this.createdAt = options.createdAt;
  this.modifiedAt = options.modifiedAt;
}
User.prototype.getId = function () {
  return this.id;
};
User.prototype.getName = function () {
  return this.name;
};
User.prototype.getAbout = function () {
  return this.about;
};
User.prototype.getEmails = function () {
  return this.emails;
};
User.prototype.getCreatedAt = function () {
  return this.createdAt;
};
User.prototype.getModifiedAt = function () {
  return this.modifiedAt;
};
User.prototype.setId = function (id) {
  this.id = id;
  return this;
};
User.prototype.setName = function (name) {
  this.name = name;
  return this;
};
User.prototype.setAbout = function (about) {
  this.about = about;
  return this;
};
User.prototype.setEmails = function (emails) {
  this.emails = emails;
  return this;
};
User.prototype.setCreatedAt = function (createdAt) {
  this.createdAt = createdAt;
  return this;
};
User.prototype.setModifiedAt = function (modifiedAt) {
  this.modifiedAt = modifiedAt;
  return this;
};
User.prototype.create = function () {
  var sql = 'insert into "User" (\'id\', \'name\', \'about\', \'emails\', \'createdAt\', \'modifiedAt\') values (' + this.id + ', ' + this.name + ', ' + this.about + ', ' + this.emails + ', ' + this.createdAt + ', ' + this.modifiedAt + ')';
  return PgClient.query(sql);
};
User.prototype.save = function () {
  if (!this.id) {
    throw new Error('Cannot remove User, id is undefined');
  }
  var sql = 'update "User" set "id" = \'' + this.id + '\', "name" = \'' + this.name + '\', "about" = \'' + this.about + '\', "emails" = \'' + this.emails + '\', "createdAt" = \'' + this.createdAt + '\', "modifiedAt" = \'' + this.modifiedAt + '\'';
  return PgClient.query(sql);
};
User.prototype.delete = function () {
  if (!this.id) {
    throw new Error('Cannot remove User, id is undefined');
  }
  return PgClient.query('delete from "User" where id = ' + this.id + '');
};