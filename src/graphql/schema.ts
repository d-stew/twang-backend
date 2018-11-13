import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date';
import { gql } from 'apollo-server-express';

import * as MainGraphQL from './main.graphql';

const SchemaDefinition = gql`
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;

const RootQueryType = gql`
  type RootQuery {
    ${MainGraphQL.queries}
  }
`;

const RootMutationType = gql`
  type RootMutation {
    ${MainGraphQL.mutations}
  }
`;

const ScalarTypes = gql`
  scalar GraphQLDate
  scalar GraphQLDateTime
`;

const ResultType = gql`
  """
  A generic representation of updates and deletes through the API.
  """
  type Result {
    success: Boolean!
    count: Int!
    added: Int
    removed: Int
    updated: Int
    ignored: Int
    ignoredReasons: [String!]
  }
`;

const rootResolvers = {
  RootQuery: {
    ...MainGraphQL.queryResolvers,
  },
  RootMutation: {
    ...MainGraphQL.mutationResolvers,
  }
};

const types = [
  ScalarTypes,
  ResultType,
  ...MainGraphQL.types,
];

export default {
  typeDefs: [SchemaDefinition, RootQueryType, RootMutationType, ...types],
  resolvers: {
    ...rootResolvers,
    GraphQLDate,
    GraphQLDateTime,
  }
};
