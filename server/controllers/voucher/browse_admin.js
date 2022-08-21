const sequelize = require("sequelize");
const db = require("../../config/database");
const { Voucher, Provider, Societe } = db.models;

module.exports = async (req, res) => {
  try {
    const vouchers = await Voucher.findAll({
      attributes: ["id", "code"],
      include: [
        {
          model: Provider,
          attributes: ["id", "nom", "image"],
        },
        {
          model: Societe,
          attributes: ["id", "name"],
        },
      ],
      where: {
        SessionCollabId: null,
      },
      order: [
        ["Provider", "id"],
        ["Societe", "id"],
      ],
    });
    return res.send(vouchers);
  } catch (error) {
    return res.send({ status: false });
  }
 
};

