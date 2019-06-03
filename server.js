const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config();

//GraphQl Typedefs and resolvers
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { findOrCreateUser } = require('./controllers/userController');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true})
  .then(() => console.log("DB CONNECTED"))
  .catch(err => console.log(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  //context catches all request made to headers
  //context from apollo server
  context: async ({ req }) => {
    let authToken = null
    let currentUser = null
    try {
     authToken = req.headers.authorization
     if(authToken) {
       //try to find user or create
      currentUser = await findOrCreateUser(authToken)
     }
    } catch(err) {
      console.log(`Unable to authenticate user with token ${authToken}`)
    }
    return { currentUser }
  }
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`)
});