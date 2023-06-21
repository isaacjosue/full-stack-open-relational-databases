const Blog = require("./Blog");
const User = require("./User");
const ReadingList = require("./ReadingList");
const Access = require("./Access");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: "readings" });
Blog.hasMany(ReadingList, { as: "readingLists" });

User.hasOne(Access);
Access.belongsTo(User);

module.exports = { Blog, User, ReadingList, Access };
