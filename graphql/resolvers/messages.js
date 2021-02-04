const { UserInputError, AuthenticationError } = require("apollo-server");

const { User, Message } = require("../../models");

module.exports = {
  Mutation: {
    sendMessage: async (parent, { to, content }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        //buscar a quien va dirigido el mensaje
        const receptor = await User.findOne({ where: { username: to } });

        if (!receptor) {
          throw new UserInputError("Destinatario no encontrado");
        } else if (receptor.username === user.username) {
          //TODO: que se pueda mandar a uno mismo mensajes para guardar cosas
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
