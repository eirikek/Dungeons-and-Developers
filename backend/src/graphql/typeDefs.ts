import { gql } from 'apollo-server';

export default gql`

    type Race{
        index: String!
        name: String!
        speed: Int!
        alignment: String!
        size: String!
        size_description: String!
        img: String
    }

    type Class{
        index: String!
        name: String!
        hit_die: Int!
        proficiency_choices: [String!]

    }

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
        class: Class!
        race: Race!
        abilityScores: [Ability]!
        equipments: [Equipment]!
    }

    type Query {
        getUser(amount: Int): [User]
        checkUsername(userName: String!): Boolean!
        monsters(searchTerm: String, offset: Int, limit: Int): MonsterResult!
        monster(id: String!): Monster!
        user(id: ID!): User!
        races(offset: Int, limit: Int): RaceResult!
        race(id: ID!): Race!
        classes(offset: Int, limit: Int): ClassResult!
        class(id: ID!): Class!

    }

    type MonsterResult {
        monsters: [Monster!]!
        totalMonsters: Int!
    }
    type RaceResult{
        races: [Race!]!
        totalRaces: Int!
    }

    type ClassResult {
        classes: [Class!]!
        totalClasses: Int!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Mutation {
        fetchRaces: String!
        fetchClasses: String!
        fetchMonsters: String!
        createUser(userName: String!): AuthPayload!
        loginUser(userName: String!): AuthPayload!
    }
`;
