import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import "./DishSuggester.css";
import { GET_DISHES_BY_INGREDIENTS } from "../../graphql/queries";
import { INGREDIENTS_SEARCH_FAILED_MESSAGE, INGREDIENTS_SEARCH_TITLE, SUGGESTED_DISHES_BTN_TEXT, SUGGESTED_DISHES_TITLE } from "../../utils/helper";

interface Dish {
  name: string;
  ingredients: string[];
  prep_time: number;
  cook_time: number;
  diet: string;
  course: string;
}

const DishSuggester = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: suggestedDishesData, loading: dishesLoading } = useQuery(
    GET_DISHES_BY_INGREDIENTS,
    {
      variables: { ingredients: selectedIngredients },
      skip: selectedIngredients.length === 0,
    }
  );

  const handleIngredientRemove = (ingredient: string) => {
    setSelectedIngredients((prev) => prev.filter((ing) => ing !== ingredient));
  };

  const handleIngredientAdd = () => {
    if (searchTerm && !selectedIngredients.includes(searchTerm)) {
      setSelectedIngredients((prev) => [...prev, searchTerm]);
      setSearchTerm("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Enter" &&
      searchTerm &&
      !selectedIngredients.includes(searchTerm)
    ) {
      handleIngredientAdd();
    }
  };

  return (
    <div className="dish-suggester">
      <h2>{INGREDIENTS_SEARCH_TITLE}</h2>

      <div className="ingredient-selection">
        <div className="selected-ingredients">
          {selectedIngredients.map((ingredient) => (
            <span key={ingredient} className="ingredient-tag">
              {ingredient}
              <button
                onClick={() => handleIngredientRemove(ingredient)}
                className="remove-ingredient"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="ingredient-search">
          <div className="search-input-group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search ingredients..."
              className="ingredient-search-input"
            />
            <button
              onClick={handleIngredientAdd}
              className="add-ingredient-btn"
              disabled={!searchTerm || selectedIngredients.includes(searchTerm)}
            >
              {SUGGESTED_DISHES_BTN_TEXT}
            </button>
          </div>
        </div>
      </div>

      {selectedIngredients.length > 0 && (
        <div className="suggested-dishes">
          <h3>{SUGGESTED_DISHES_TITLE}</h3>
          {dishesLoading ? (
            <p>Finding dishes...</p>
          ) : suggestedDishesData?.getDishesByIngredients.length > 0 ? (
            <div className="dishes-grid">
              {suggestedDishesData?.getDishesByIngredients.map((dish: Dish) => (
                <div key={dish.name} className="dish-card">
                  <Link to={`/dish/${encodeURIComponent(dish.name)}`}>
                    <h4>{dish.name}</h4>
                    <p className="dish-info">
                      <span>{dish.diet}</span> •<span>{dish.course}</span>
                    </p>
                    <p className="time-info">
                      Prep: {dish.prep_time}min • Cook: {dish.cook_time}min
                    </p>
                    <p className="required-ingredients">
                      Required Ingredients: {dish.ingredients}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>{INGREDIENTS_SEARCH_FAILED_MESSAGE}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DishSuggester;
