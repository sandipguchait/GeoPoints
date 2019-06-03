const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config();

//GraphQl Typedefs and resolvers
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true})
  .then(() => console.log("DB CONNECTED"))
  .catch(err => console.log(err));

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`)
});