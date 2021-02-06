const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const { Message, User } = require("../../models");

module.exports = {
  Query: {
    getUsers: async (_, ___, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unathenticated");

        let users = await User.findAll({
          attributes: ["username", "imageUrl", "createdAt"],
          //Para evitar obtener nuestro propio usuario
          where: { username: { [Op.ne]: user.username } }
        });

        const allUserMessages = await Message.findAll({
          where: {
            [Op.or]: [{ from: user.username }, { to: user.username }]
          },
          order: [["createdAt", "DESC"]]
        });

        users = users.map((otherUser) => {
          const latestMessage = allUserMessages.find(
            (m) => m.from === otherUser.username || m.to === otherUser.username
          );
          otherUser.latestMessage = latestMessage;
          return otherUser;
        });

        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    login: async (_, args) => {
      const { username, password } = args;
      let errors = {};

      try {
        if (username.trim === "") {
          errors.username = "Ingrese un nombre de usuario";
          throw new UserInputError("user empty", { errors });
        }
        if (password === "") {
          errors.password = "Ingrese la contraseña";
          throw new UserInputError("password empty", { errors });
        }

        const user = await User.findOne({
          where: {
            username
          }
        });

        if (!user) {
          errors.username = "Usuario no válido";
          throw new UserInputError("user not found", { errors });
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
          errors.password = "La contraseña es incorrecta";
          throw new UserInputError("password is incorrect", { errors });
        }

        const token = jwt.sign(
          {
            username
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return {
          ...user.toJSON(),
          token
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
  Mutation: {
    register: async (_, args) => {
      let { username, email, password, confirmPassword } = args;
      let errors = {};
      try {
        //Validar input
        if (email.trim() === "") {
          errors.email = "El email no puede estar vacio";
        }
        if (username.trim() === "") {
          errors.username = "El username no puede estar vacio";
        }
        if (password.trim() === "") {
          errors.password = "El password no puede estar vacio";
        }
        if (confirmPassword.trim() === "") {
          errors.confirmPassword =
            "La confirmacion de la contraseña no puede estar vacia";
        }
        if (password !== confirmPassword) {
          errors.password = "No coincide con la confirmacion de contraseña";
          errors.confirmPassword = "No coincide con la contraseña";
        }

        //Comprobar si el username/ email existe
        // const userByUsername = await User.findOne({ where: { username } });
        // const userByEmail = await User.findOne({ where: { email } });

        // if (userByUsername) errors.username = "El nombre de usuario ya existe";
        // if (userByEmail) errors.email = "Ya existe una cuenta con este email";

        //Comprobar si existen errores
        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        //Encriptar contraseña
        password = await bcrypt.hash(password, 6);
        //poner todo en minusculas el nombre de usuario
        username = username.toLowerCase();

        //Crear usuario
        const user = await User.create({
          username,
          email,
          password
        });
        //Return user
        return user;
      } catch (err) {
        console.log(err);
        if (err.name === "SequelizeUniqueConstraintError") {
          err.errors.forEach(
            (e) => (errors[e.path] = `${e.path} ya esta siendo utilizado`)
          );
        } else if (err.name === "SequelizeValidationError") {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad input", { errors });
      }
    }
  }
};
