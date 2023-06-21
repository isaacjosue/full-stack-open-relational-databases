const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../utils/db");

class Access extends Model {}
Access.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    canAccess: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: "access",
  }
);

module.exports = Access;
