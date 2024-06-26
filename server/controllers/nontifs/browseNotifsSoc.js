const sequelize = require("sequelize");
const db = require("../../config/database");

const {
  Notifications_object,
  Notification_change,
  Notifications_Entity,
  Collaborateur,
  Provider,
  Session,
  Voucher,
  Request,
  User,
  Session_Collab,
  Cours,
} = db.models;

module.exports = async (req, res) => {
  const { societe } = req;
  try {
    const notifs = await Notifications_object.findAll({
      attributes: ["id", "read"],
      include: [
        {
          required: true,
          model: Notification_change,
          attributes: ["id"],
          include: [
            {
              required: true,
              model: Collaborateur,
              as: "emetteur",
              attributes: [
                "nom",
                "prenom",
                "admin",
                "SocieteId",
                "UserId",
                "image",
              ],
            },
            {
              model: Collaborateur,
              as: "recepteur",
              required: true,
              attributes: [
                "nom",
                "prenom",
                "admin",
                "SocieteId",
                "UserId",
                "image",
              ],
              where: {
                SocieteId: societe,
                admin: true,
              },
            },
          ],
        },
        {
          model: Notifications_Entity,
          attributes: ["entity", "description"],
        },
        {
          model: Session,
        },
        {
          model: Provider,
          attributes: ["nom", "image"],
        },
        {
          model: Voucher,
        },
        {
          model: Session_Collab,
          include: {
            model: Session,
          },
        },
        {
          model: Request,
          include: {
            model: Cours,
            attributes: ["nom"],
          },
        },
      ],
      where: {
        read: false,
      },
    });
    return res.send(notifs);
  } catch (error) {
    console.log(error);
    return res.send({ status: false });
  }
};
