const { ApolloServer } = require("apollo-server");

require("dotenv").config();

const { sequelize } = require("./models");

// A map of functions which return data for the schema.
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
const contextMiddleware = require("./util/contextMiddleware");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
  subscriptions: { path: "/" }
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);

  sequelize
    .authenticate()
    .then(() => console.log("DB connected!!"))
    .catch((err) => console.log(err));
});
