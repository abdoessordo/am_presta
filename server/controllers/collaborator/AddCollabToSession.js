const db = require("../../config/database");
const { Cours, Collaborateur, Session, Quota, Provider } = db.models;
module.exports = async (req, res) => {
  const { session, collab } = req.body;
  if (!session || !collab) {
    return res.sendStatus(403);
  }

  try {
    const sess = await Session.findByPk(session, {
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
                },
              ],
            },
          ],
        },
      ],
    });
    const collabo = await Collaborateur.findByPk(collab);
    sess.addCollaborateur(collabo);
    return res.send({ status: true, msg: "Collab Added" });
  } catch (err) {
    console.log(err);
    return res.send({ status: false, msg: "Something Wrong" });
  }
};