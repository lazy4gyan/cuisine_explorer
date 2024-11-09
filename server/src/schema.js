const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Dish {
    name: String
    ingredients: String
    diet: String
    prep_time: Int
    cook_time: Int
    flavor_profile: String
    course: String
    state: String
    region: String
  }

  type SearchResult {
    name: String
    ingredients: String
    state: String
    region: String
    matchType: String
  }

  input DishFilter {
    flavor: Boolean
    diet: String
    course: String
    state: String
    region: String
  }

  type Query {
    dishes(filter: DishFilter): [Dish]
    getDishByName(name: String!): Dish
    getDishesByIngredients(ingredients: [String!]!): [Dish]
    getAllDishes: [Dish]
    searchDishes(term: String!): [SearchResult]
  }
`);

module.exports = schema;
