import { useQuery } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { GET_DISH_BY_NAME } from '../graphql/queries';
import './DishDetails.css';

interface Dish {
  name: string;
  ingredients: string;
  diet: string;
  prep_time: number;
  cook_time: number;
  flavor_profile: string;
  course: string;
  state: string;
  region: string;
}

const DishDetails = () => {
  const { name } = useParams<{ name: string }>();

  const { loading, error, data } = useQuery(GET_DISH_BY_NAME, {
    variables: { name },
  });

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <p className="error">Error: {error.message}</p>;
  if (!data?.getDishByName) return <p className="error">Dish not found</p>;

  const dish: Dish = data.getDishByName;

  return (
    <div className="dish-details">
      <Link to="/" className="back-button">← Back to Dishes</Link>
      
      <h2>{dish.name}</h2>
      
      <div className="dish-info">
        <div className="info-section">
          <h3>Basic Information</h3>
          <p><strong>Diet Type:</strong> {dish.diet}</p>
          <p><strong>Course:</strong> {dish.course}</p>
          <p><strong>Flavor Profile:</strong> {dish.flavor_profile}</p>
        </div>

        <div className="info-section">
          <h3>Preparation</h3>
          <p><strong>Prep Time:</strong> {dish.prep_time} minutes</p>
          <p><strong>Cooking Time:</strong> {dish.cook_time} minutes</p>
          <p><strong>Total Time:</strong> {dish.prep_time + dish.cook_time} minutes</p>
        </div>

        <div className="info-section">
          <h3>Origin</h3>
          <p><strong>State:</strong> {dish.state}</p>
          <p><strong>Region:</strong> {dish.region}</p>
        </div>

        <div className="info-section ingredients">
          <h3>Ingredients</h3>
          <p>{dish.ingredients}</p>
        </div>
      </div>
    </div>
  );
};

export default DishDetails;
