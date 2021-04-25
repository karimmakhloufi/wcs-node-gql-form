const { ApolloServer, gql } = require("apollo-server");

const mongoose = require("mongoose");

const WilderModel = require("./models/Wilder");

//Database
mongoose
  .connect("mongodb://127.0.0.1:27017/wilderdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

const typeDefs = gql`
  type Skill {
    id: ID
    title: String
    votes: Int
  }
  type Wilder {
    id: ID
    name: String
    city: String
    skills: [Skill]
  }
  type Query {
    allWilders: [Wilder]
  }
`;

const resolvers = {
  Query: {
    allWilders: () => WilderModel.find(), // to test in playground: {allWilders {name, city, skills {title, votes}}}
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
