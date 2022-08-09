const Sequelize = require("sequelize");

const Collaborateur = (db) => {
  db.define(
    "Collaborateur",
    {
      // Model attributes are defined here
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      nom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      prenom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email_institu: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      instructor: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
    },
    {
      Sequelize,
      paranoid: true,
      deletedAt: "deletedAt",
    }
  );
};
module.exports = Collaborateur;
