const Sequelize = require("sequelize");

const User = (db) => {
  db.define(
    "User",
    {
      // Model attributes are defined here

      username: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false, // defaults to true
      },
    },
    {
      Sequelize,
      paranoid: true,

      // If you want to give a custom name to the deletedAt column
      deletedAt: "destroyTime",
    }
  );
};
module.exports = User;
