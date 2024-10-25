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
    type AbilityScore{
        name: String!
        index: String!
        desc: [String!]!
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
        monsters(searchTerm: String, offset: Int, limit: Int): MonsterResult!
        monster(id: String!): Monster!
        user(id: ID!): User!
        races(offset: Int, limit: Int): RaceResult!
        race(id: ID!): Race!
        classes(offset: Int, limit: Int): ClassResult! 
        class(id: ID!): Class!
        abilities(offset: Int, limit: Int): AbilityResult! 
        ability(id: ID!): AbilityScore!
        
        
    }
    
    type AbilityResult {
        abilities: [AbilityScore!]!
        totalAbilities: Int!
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

    type Mutation {
        fetchRaces: String!
        fetchClasses: String!
        fetchMonsters: String!
        fetchAbilityScores: String!
    }
`;
