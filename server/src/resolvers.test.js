const request = require('supertest');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const { loadCSV } = require('./utils/csvLoader');
const mockDishes = require('./mockData');

jest.mock('./utils/csvLoader.js');

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: false,
}));

describe('GraphQL API', () => {
  beforeEach(() => {
    loadCSV.mockResolvedValue(mockDishes);
  });

  it('should return all dishes', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: '{ getAllDishes { name } }',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.getAllDishes).not.toBeNull(); 
    expect(response.body.data.getAllDishes).toHaveLength(2);
    expect(response.body.data.getAllDishes[0].name).toBe('Dish 1');
  });

  it('should return a dish by name', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: '{ getDishByName(name: "Dish 1") { name } }',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.getDishByName.name).toBe('Dish 1');
  });

  it('should return null for a non-existent dish', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: '{ getDishByName(name: "Non-existent Dish") { name } }',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.getDishByName).toBeNull();
  });

  it('should filter dishes by diet', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: '{ dishes(filter: { diet: "vegan" }) { name } }',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.dishes).toHaveLength(1);
    expect(response.body.data.dishes[0].name).toBe('Dish 1');
  });

  it('should return dishes based on ingredients', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: '{ getDishesByIngredients(ingredients: ["ingredient1"]) { name } }',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.getDishesByIngredients).toHaveLength(1);
    expect(response.body.data.getDishesByIngredients[0].name).toBe('Dish 1');
  });

  it('should return search results', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: '{ searchDishes(term: "Dish") { name } }',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.searchDishes).toHaveLength(2);
  });

  it('should return an empty array for no matches in search', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: '{ searchDishes(term: "Non-existent") { name } }',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.searchDishes).toHaveLength(0);
  });

  it('should handle filtering with multiple criteria', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: '{ dishes(filter: { diet: "vegetarian", state: "Punjab" }) { name } }',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.dishes).toHaveLength(1);
    expect(response.body.data.dishes[0].name).toBe('Dish 2');
  });
});