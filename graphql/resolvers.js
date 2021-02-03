module.exports = {
  Query: {
    getUsers: () => {
      const users = [
        { username: "Micaela", email: "micaela@email.com" },
        { username: "Fede", email: "fede@email.com" },
        { username: "Carlos", email: "carlos@email.com" }
      ];

      return users;
    }
  }
};
