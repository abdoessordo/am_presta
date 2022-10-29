const Sequelize = require("sequelize");

const Notifications_object = (db) => {
  db.define(
    "Notifications_object",
    {
      // Model attributes are defined here
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      // hooks: {
      //   afterUpdate: async (notif) => {

      //     ws = connections.get(recepteurCollab.UserId);
      //     console.log("ws=", recepteurCollab.UserId);
      //     if (ws) {
      //       ws.send(
      //         JSON.stringify({
      //           type: "notif",
      //         })
      //       );
      //     }
      //   },
      // },
      Sequelize,
      paranoid: true,

      deletedAt: "deletedAt",
      // If you want to give a custom name to the deletedAt column
    }
  );
};
module.exports = Notifications_object;
