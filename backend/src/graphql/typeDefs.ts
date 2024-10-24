import { gql } from 'apollo-server';

export default gql`
    type Player {
        characterName: String!
        characterClass: String!
        race: String!
    }
    
    type Race{
         index: String!
         name: String!
         speed: String!
         alignment: String!
         size: Int!
         size_description: String!
         img: String!
    }
    
    type Class{
         index: String!
         name: String!
         hit_die: int!
    
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
        monsters(searchTerm: String, offset: Int, limit: Int): MonsterResult!
        monster(id: String!): Monster!
        user(id: ID!): User!
        race(id: ID!): Race!
    }

    type MonsterResult {
        monsters: [Monster!]!
        totalMonsters: Int!
    }
    type RaceResult{
        races: [Race!]!
        totalRaces: Int!
        }

    type Mutation {
        createPlayer(playerInput: PlayerInput): Player!
        deletePlayer(ID: ID!): Boolean
        editPlayer(ID: ID!, editRecipeInput: EditPlayerInput): Boolean

        registerUser(registerInput: RegisterInput): User
        loginUser(loginInput: LoginInput): User
        
        fetchRaces: String!

        fetchMonsters: String!
    }
`;
