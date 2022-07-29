const { Sequelize } = require("sequelize");
const db = require("../config/database");
const Cours = require("./Cours");
const Provider = db.define("Provider", {
  image: {
    type: Sequelize.STRING,
  },
  nom: {
    type: Sequelize.STRING,
  },
});
Provider.hasMany(Cours);
Cours.belongsTo(Provider);

module.exports = Provider;
