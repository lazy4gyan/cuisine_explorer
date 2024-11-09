import { gql } from "@apollo/client";

export const GET_DISH_BY_NAME = gql`
  query GetDishByName($name: String!) {
    getDishByName(name: $name) {
      name
      ingredients
      diet
      prep_time
      cook_time
      flavor_profile
      course
      state
      region
    }
  }
`;

export const SEARCH_DISHES = gql`
  query SearchDishes($term: String!) {
    searchDishes(term: $term) {
      name
      ingredients
      state
      region
      matchType
    }
  }
`;

export const GET_ALL_DISHES = gql`
  query {
    getAllDishes {
      name
      ingredients
      diet
      prep_time
      cook_time
      flavor_profile
      course
      state
      region
    }
  }
`;

export const GET_DISHES_BY_INGREDIENTS = gql`
  query GetDishesByIngredients($ingredients: [String!]!) {
    getDishesByIngredients(ingredients: $ingredients) {
      name
      ingredients
      prep_time
      cook_time
      diet
      course
    }
  }
`;