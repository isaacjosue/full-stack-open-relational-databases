const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: querySelector }) => {
    await querySelector.createTable(
      "accesses",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "users", key: "id" },
        },
        can_access: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        modelName: "access",
      }
    );
  },
  down: async ({ context: querySelector }) => {
    await querySelector.dropTable("access");
  },
};
