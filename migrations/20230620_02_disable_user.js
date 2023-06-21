const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: querySelector }) => {
    await querySelector.addColumn("users", "disabled", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },
  down: async ({ context: querySelector }) => {
    await querySelector.removeColumn("users", "disabled");
  },
};
