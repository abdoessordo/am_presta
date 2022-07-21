const argon2 = require("argon2");
const Collaborateur = require("../../models/Collaborateur");
const Departement = require("../../models/Departement");
const Societe = require("../../models/Societe");
const User = require("../../models/Users");

module.exports = async (req, res) => {
  try {
    const { username, password, nom, prenom, societe } = req.body;

    const pep = process.env.PEPPER;
    if (!societe || !prenom || !nom || !username || !password)
      return res.sendStatus(403);

    const societeCheck = await Societe.findOne({ where: { name: societe } });
    if (societeCheck)
      return res.json({ status: false, msg: "societe already used" });
    const usernameCheck = await User.findOne({ where: { username } });
    if (usernameCheck)
      return res.json({ status: false, msg: "Username already used" });

    const hash = await argon2.hash(password + pep);
    const user = await User.create(
      {
        username: username,
        password: hash,
        Collaborateur: {
          nom,
          prenom,

          Societe: {
            name: societe,
          },
          admin: true,
          instructor: false,
        },
      },
      {
        include: [
          { association: User.Collaborateur, include: [Collaborateur.Societe] },
        ],
      }
    );

    return res.send({ status: true, msg: "User Created Successfully" });
  } catch (err) {
    return res.send({ msg: "error " + err });
  }
};
