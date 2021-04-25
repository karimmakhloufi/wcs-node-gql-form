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
  input InputWilder {
    name: String!
    city: String!
  }
  type Mutation {
    createWilder(input: InputWilder): Wilder
  }
`;

const resolvers = {
  Query: {
    allWilders: () => WilderModel.find(), // to test in playground: {allWilders {name, city, skills {title, votes}}}
  },
  Mutation: {
    createWilder: async (parent, args) => {
      /* To test in playground:
      mutation CreateWilder($input: InputWilder) {
        createWilder(input: $input) {
          id, name, city
        }
      }

      Query Variables:
      {
        "input": {
          "name": "GraphQL Wilder",
          "city": "Space"
        }
      }
      */
      await WilderModel.init();
      const wilder = new WilderModel(args.input);
      const result = await wilder.save();
      return result;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
