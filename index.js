import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from 'node:http'

const schema = createSchema({
  typeDefs: `
type Query {
hello: String!
name: String!
idade: Int
}
`,
  resolvers: {
    Query: {
      hello: () => "Hello, GraphQL",
      name: () => "Um nome aqui",
      idade: () => 21
    },
  },
});

const yoga = createYoga({
  schema,
});

const server = createServer(yoga);
const porta = 4000;
server.listen(porta, () => {
  console.info(`Servidor disponível em http://localhost:${porta}`);
});
