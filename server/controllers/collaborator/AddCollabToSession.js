const { Op } = require("sequelize");
const db = require("../../config/database");
const { Cours, Collaborateur, Request, Session, Quota, Provider } = db.models;
module.exports = async (req, res) => {
  const { session, collab, request } = req.body;
  if (!session || !collab) {
    return res.sendStatus(403);
  }

  try {
    const sess = await Session.findByPk(session, {
      where: {
        SocieteId: req.societe,
      },
      include: [
        {
          model: Cours,
          required: true,
          include: [
            {
              model: Provider,
              required: true,
              include: [
                {
                  model: Quota,
                  required: true,
                  where: {
                    quota: {
                      [Op.gt]: 0,
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    });
    const collabo = await Collaborateur.findByPk(collab);
    sess.addCollaborateur(collabo);
    session.Cours.Provider.Quota.quota = session.Cours.Provider.Quota.quota - 1;
    sess.save();
    if (request) {
      Request.destroy({
        where: {
          CourId: sess.CourId,
          CollaborateurId: collab,
        },
      });
    }

    return res.send({ status: true, msg: "Collab Added" });
  } catch (err) {
    return res.send({ status: false, msg: "Check your quota" });
  }
};
