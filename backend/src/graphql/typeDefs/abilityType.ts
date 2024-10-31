import { gql } from 'apollo-server';

export const abilityType = gql`
  type AbilityScore{
        name: String!
        index: String!
        desc: [String!]!
        skills: [Skills!]!
         }
    type Skills{
        name: String!
        index: String!
        }
    type Ability {
        name: String!
        score: Int!
    }
    
    type AbilityResult {
        abilities: [AbilityScore!]!
        totalAbilities: Int!
        }
        
    type Query { 
        abilities(offset: Int, limit: Int): AbilityResult! 
        ability(id: ID!): AbilityScore!
    }
    
    type Mutation{
        fetchAbilityScores: String!
    }
`