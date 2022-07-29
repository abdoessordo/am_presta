const Collaborateur = require("../../models/Collaborateur");
const Societe = require("../../models/Societe");
module.exports = async (req, res) => {
  companies = await Societe.findAll({
    limit: 3,
    order: ["createdAt"],
    include: {
      model: Collaborateur,
      attributes: ["nom", "prenom"],
      where: {
        admin: true,
      },
    },
  });
  return res.send({
    companies,
  });
};