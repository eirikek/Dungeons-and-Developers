import { gql } from 'apollo-server';

export default gql`
    type Monster {
        index: String!
        name: String!
        size: String!
        type: String!
        alignment: String!
        hit_points: Int!
        hit_dice: String!
        strength: Int!
        dexterity: Int!
        intelligence: Int!
        wisdom: Int!
        charisma: Int!
        image: String
    }

    type Ability {
        name: String!
        score: Int!
    }

    type Equipment {
        name: String!
    }


    type User {
        id: ID!
        userName: String!
        class: String,
        race: String!
        abilityScores: [Ability]!
        equipments: [Equipment]!
    }

    type Query {
        getUser(amount: Int): [User]
        checkUsername(userName: String!): Boolean!
        monsters(searchTerm: String, offset: Int, limit: Int): MonsterResult!
        monster(id: String!): Monster!
        user(id: ID!): User!
    }

    type MonsterResult {
        monsters: [Monster!]!
        totalMonsters: Int!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Mutation {
        fetchMonsters: String!
        createUser(userName: String!): AuthPayload!
        loginUser(userName: String!): AuthPayload!
    }
`;