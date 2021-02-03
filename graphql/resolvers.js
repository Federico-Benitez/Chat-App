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
      const { username, email, password, confirmPassword } = args;
      try {
        //TODO: Validar input

        //TODO: Comprobar si el username/ email existe

        //TODO: Crear usuario
        const user = await User.create({
          username,
          email,
          password
        });
        //TODO: Return user
        return user;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  }
};
