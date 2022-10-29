const db = require("../../config/database");

const { User, Collaborateur, Societe, SuperAdmin } = db.models;
const argon2 = require("argon2");
const { sign } = require("jsonwebtoken");
const GetType = require("./GetType");
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.send({ status: false, msg: "Check parameters" });
    }
    const user = await User.findOne({
      include: [
        {
          model: Collaborateur,
          attributes: ["id"],
          include: {
            model: Societe,
          },
        },
        {
          model: SuperAdmin,
        },
      ],
      where: {
        [Op.or]: { username, email: username },
      },
    });

    if (user === null)
      return res.send({ status: false, msg: "User Not found!" });

    const pep = process.env.PEPPER;
    let changedpass = "";

    // start - BRICOLE DYAL DELETEDAT
    const checkSuperadmin = user.SuperAdmin ? true : false;
    if (!checkSuperadmin) {
      const sociterNotDeleted = user.Collaborateur.Societe ? true : false;
      if (!sociterNotDeleted) {
        return res.send({ status: false, msg: "Societe deleted" });
      }
    }

    // end - BRICOLE DYAL DELETEDAT
    const checkUser = await argon2.verify(user.password, password + pep);
    if (checkUser) {
      type = await GetType(user);

      if (type === "Error") {
        return res.json({ status: false, msg: "Undefined User Type " });
      }

      payload = { user_id: user.id, type };
      if (type === "Societe") {
        id = await user.getCollaborateur();
        socid = id.SocieteId;
        payload.id = socid;
        changedpass = id.changedpass;
        payload.changedpass = changedpass;
      }
      if (type === "Collab") {
        id = await user.getCollaborateur();
        console.log("\x1b[42mPAYLOAD ihuhuhu\x1b[0m");
        console.log(id.id);
        payload.id = id.id;
        changedpass = id.changedpass;
        payload.changedpass = changedpass;
      }
      console.log("\x1b[44mPAYLOAD\x1b[0m");
      console.log(payload);
      const refreshtoken = sign(payload, process.env.JWT_REFRESH_SALT, {
        expiresIn: "7d",
      });

      res.cookie("jbid", refreshtoken, {
        httpOnly: true,
        // sameSite: "None",
        secure: true,
      });
      accesstoken = sign(payload, process.env.JWTSALT, {
        expiresIn: "15m",
      });

      return res.json({
        status: true,
        accesstoken,
        type,
        changedpass,
        id: user.id,
      });
    }

    return res.send({ status: false, msg: "Username or Password incorrect" });
  } catch (err) {

    console.log(err);
    return res.send("error: " + err);
  }
};
