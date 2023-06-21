const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: querySelector }) => {
    await querySelector.addColumn("lists", "read", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },
  down: async ({ context: querySelector }) => {
    await querySelector.removeColumn("lists", "read");
  },
};
