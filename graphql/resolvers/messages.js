const { UserInputError, AuthenticationError } = require("apollo-server");
const { Op } = require("sequelize");
const { User, Message } = require("../../models");

module.exports = {
  Query: {
    getMessages: async (parent, { from }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        const receptor = await User.findOne({
          where: { username: from }
        });
        if (!receptor)
          throw new UserInputError("No existen mensajes con esta persona");

        const userNames = [user.username, receptor.username];

        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: userNames },
            to: { [Op.in]: userNames }
          },
          order: [["createdAt", "DESC"]]
        });

        return messages;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
  Mutation: {
    sendMessage: async (parent, { to, content }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        //buscar a quien va dirigido el mensaje
        const receptor = await User.findOne({ where: { username: to } });

        if (!receptor) {
          throw new UserInputError("Destinatario no encontrado");
        }
        if (receptor.username === user.username) {
          console.log("aca entra");
          throw new UserInputError("No puedes mandarte mensajes a ti mismo");
        }

        if (content.trim() === "") {
          //el receptor fue encontrado
          //comprobacion si el mensaje esta vacio
          throw new UserInputError("Mensaje vacio");
        }
        //creamos el mensaje
        const message = await Message.create({
          from: user.username,
          to,
          content
        });

        return message;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  }
};
