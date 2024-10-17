const { gql } = require('apollo-server');

module.exports = gql`
  type Monster {
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
    image: String!
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
    user(id: ID!): User!
    monster(id: String!): Monster!
  }
`;
