const { ApolloServer } = require('apollo-server');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

//GraphQl Typedefs and resolvers
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { findOrCreateUser } = require('./controllers/userController');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true})
  .then(() => console.log("DB CONNECTED"))
  .catch(err => console.log(err));

app.use(cors());

app.use(express.static('public'));



const server = new ApolloServer({
  typeDefs,
  resolvers,
  //context catches all request made to headers
  //context from apollo server
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
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

server.applyMiddleware({
  path: '/traveller', // you should change this to whatever you want
  app,
});


if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));

  app.get('*', (req,res) => {
      res.sendFile(path.resolve(__dirname, 'client','build', 'index.html'));
  })
}

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server listening on ${url}`)
});