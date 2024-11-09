const { loadCSV } = require('./utils/csvLoader');

let dishesCache;

const ensureDishesCacheLoaded = async () => {
  if (!dishesCache) {
    dishesCache = await loadCSV();
  }
};

const filterDishes = (dishes, filter) => {
  let filteredDishes = [...dishes];

  if (filter.flavor === true) {
    filteredDishes = filteredDishes.filter(dish => dish.flavor_profile && dish.flavor_profile.trim() !== '');
  }
  
  if (filter.diet) {
    filteredDishes = filteredDishes.filter(dish => 
      dish.diet?.toLowerCase() === filter.diet.toLowerCase()
    );
  }
  
  if (filter.course) {
    filteredDishes = filteredDishes.filter(dish => 
      dish.course?.toLowerCase() === filter.course.toLowerCase()
    );
  }
  
  if (filter.state) {
    filteredDishes = filteredDishes.filter(dish => 
      dish.state?.toLowerCase() === filter.state.toLowerCase()
    );
  }
  
  if (filter.region) {
    filteredDishes = filteredDishes.filter(dish => 
      dish.region?.toLowerCase() === filter.region.toLowerCase()
    );
  }

  return filteredDishes;
};

const resolvers = {
  dishes: async ({ filter }) => {
    await ensureDishesCacheLoaded(); 
    let filteredDishes = filter ? filterDishes(dishesCache, filter) : [...dishesCache];
    return filteredDishes;
  },

  getAllDishes: async () => {
    await ensureDishesCacheLoaded(); 
    return dishesCache;
  },

  getDishByName: async ({ name }) => {
    await ensureDishesCacheLoaded(); 
    return dishesCache.find(dish => dish.name.toLowerCase() === name.toLowerCase());
  },
  
  getAllIngredients: async () => {
    await ensureDishesCacheLoaded(); 
    
    const allIngredients = new Set();
    dishesCache.forEach(dish => {
      const ingredients = dish.ingredients
        .toLowerCase()
        .split(',')
        .map(i => i.trim());
      ingredients.forEach(i => allIngredients.add(i));
    });
    
    return Array.from(allIngredients).map(name => ({ name }));
  },

  getDishesByIngredients: async ({ ingredients }) => {
    await ensureDishesCacheLoaded(); 

    return dishesCache.map(dish => ({
      ...dish,
      ingredientList: dish.ingredients
        .toLowerCase()
        .split(',')
        .map(i => i.trim())
    })).filter(dish => {
      const dishIngredients = dish.ingredientList;
      return dishIngredients.some(ingredient => 
        ingredients.includes(ingredient.toLowerCase())
      );
    });
  },

  searchDishes: async ({ term }) => {
    await ensureDishesCacheLoaded(); 

    const searchTerm = term.toLowerCase();
    const results = [];

    dishesCache.forEach(dish => {
      let matchType = null;

      // Search by name
      if (dish.name.toLowerCase().includes(searchTerm)) {
        matchType = 'name';
      }
      // Search by ingredients
      else if (dish.ingredients.toLowerCase().includes(searchTerm)) {
        matchType = 'ingredients';
      }
      // Search by state or region
      else if (
        (dish.state && dish.state.toLowerCase().includes(searchTerm)) ||
        (dish.region && dish.region.toLowerCase().includes(searchTerm))
      ) {
        matchType = 'origin';
      }

      if (matchType) {
        results.push({
          ...dish,
          matchType
        });
      }
    });

    return results;
  }
};

module.exports = resolvers;