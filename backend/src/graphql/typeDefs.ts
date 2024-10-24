import { gql } from 'apollo-server';

export default gql`
    type Player {
        username: String!
        userID: Int!
        characterName: String!
        characterClass: String!
        race: String!
        abilityScores: [Int!]!
    }

    input RegisterInput {
        username: String!
    }

    input LoginInput {
        username: String!
    }

    input PlayerInput {
        username: String!
        userID: Int!
        characterName: String!
        characterClass: String!
        race: String!
        abilityScores: [Int!]!
    }

    input EditPlayerInput {
        username: String!
        userID: Int!
        characterName: String!
        characterClass: String!
        race: String!
        abilityScores: [Int!]!
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

    type Character {
        name: String!
        class: String!
        race: String!
        abilityScores: [Ability!]!
    }

    type User {
        userName: String!
        userID: ID!
        character: Character!
    }

    type Query {
        player(ID: ID!): Player!
        getPlayer(amount: Int): [Player]
        monsters: [Monster!]!
        monster(id: String!): Monster!
        user(id: ID!): User!
    }

    type Mutation {
        createPlayer(playerInput: PlayerInput): Player!
        deletePlayer(ID: ID!): Boolean
        editPlayer(ID: ID!, editRecipeInput: EditPlayerInput): Boolean

        registerUser(registerInput: RegisterInput): User
        loginUser(loginInput: LoginInput): User

        fetchMonsters: String!
    }
`;