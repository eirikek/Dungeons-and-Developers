import { gql } from 'apollo-server';

export const classType = gql`
    type Class {
        index: String!
        name: String!
        hit_die: Int!
        proficiency_choices: [String!]
    }

    type ClassResult {
        classes: [Class!]!
        totalClasses: Int!
    }

    extend type Query {
        classes(offset: Int, limit: Int): ClassResult!
        class(id: ID!): Class!
    }

    extend type Mutation {
        fetchClasses: String!
    }
`;