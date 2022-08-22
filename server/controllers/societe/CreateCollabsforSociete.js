const argon2 = require("argon2");
const db = require("../../config/database");
const Email = require("../../emails/Email");
const { Collaborateur, Societe, User } = db.models;
module.exports = async (req, res) => {
  const { accounts } = req.body;
  if (!accounts) {
    return res.sendStatus(403);
  }
  const pep = process.env.PEPPER;
  for (account of accounts) {
    try {
      const { nom, prenom, email } = account;

      if (!prenom || !nom) return res.sendStatus(403);
      username = `${nom}.${prenom}`;
      const password = "@AMPRESTA@";
      i = 1;
      while (true) {
        usernameCheck = await User.findOne({ where: { username } });
        if (!usernameCheck) {
          break;
        }
        username = `${nom}.${prenom}${i}`;
        i++;
      }
      email_institu = `${username}@institute-eca.ma`;
      const hash = await argon2.hash(password + pep);
      const user = await User.create(
        {
          username,
          password: hash,
          email,
          Collaborateur: {
            nom,
            prenom,
            email_institu,
            SocieteId: req.societe,
            admin: false,
            instructor: false,
          },
        },
        {
          include: [{ association: User.Collaborateur }],
        }
        );
      Email.sendRegister(email)
    } catch (err) {
      return res.send({ msg: "error " + err });
    }
  }
  return res.send({
    status: true,
    msg: "Users Created Successfully",
  });
};
