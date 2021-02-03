const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");

const { User } = require("../models");

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (err) {
        console.log(err);
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
        }
        throw new UserInputError("Bad input", { errors: err });
      }
    }
  }
};
