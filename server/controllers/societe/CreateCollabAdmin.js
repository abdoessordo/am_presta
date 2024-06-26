const argon2 = require("argon2");
const db = require("../../config/database");
const Email = require("../../emails/Email");
const { Collaborateur, Societe, User } = db.models;
module.exports = async (req, res) => {
  const { account } = req.body;
  if (!account) {
    return res.sendStatus(403);
  }
  const pep = process.env.PEPPER;
  try {
    var { nom, prenom, email, societe } = account;
    if (!societe) {
      return res.send({ status: false, msg: "Please specify a company" });
    }
    const societes = await Societe.findOne({
      attributes: ["name"],
      where: { id: societe },
    });
    if (!prenom || !email || !nom) return res.sendStatus(403);
    nom = nom.trim().toLowerCase();
    prenom = prenom.trim().toLowerCase();
    email = email.trim();
    emailCheck = await User.findOne({ where: { email } });

    if (emailCheck) {
      return res.send({ status: false, msg: "Email exists " });
    }
    username = `${nom.replace(/\s/g, "_")}.${prenom.replace(/\s/g, "_")}`;
    const password = Array(8)
      .fill()
      .map(() => ((Math.random() * 36) | 0).toString(36))
      .join("");
    i = 1;
    while (true) {
      usernameCheck = await User.findOne({ where: { username } });
      if (!usernameCheck) {
        break;
      }
      username = `${username}${i}`;
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
          SocieteId: societe,
          admin: false,
          instructor: false,
        },
      },
      {
        include: [{ association: User.Collaborateur }],
      }
    );
    Email.sendRegister(email, email_institu, username, password, societes.name);
    return res.send({
      status: true,
      msg: "Users Created Successfully",
      id: user.Collaborateur.id,
    });
  } catch (err) {
    console.log(err);
    return res.send({ msg: "error " + err });
  }
};
