import { useQuery } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { GET_DISH_BY_NAME } from '../../graphql/queries';
import Loader from '../loader/Loader';
import './DishDetails.css';
import { BACK_BUTTON_TEXT } from '../../utils/helper';
import { dishInfoConfig } from '../../utils/dishInfoConfig';

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

  if (loading) return <Loader />;
  if (error) return <p className="error">Error: {error.message}</p>;
  if (!data?.getDishByName) return <p className="error">Dish not found</p>;

  const dish: Dish = data.getDishByName;

  return (
    <div className="dish-details">
      <Link to="/" className="back-button">{BACK_BUTTON_TEXT}</Link>
      
      <h2>{dish.name}</h2>

      <div className="dish-info">
        {dishInfoConfig.map((section) => (
          <div className="info-section" key={section.title}>
            <h3>{section.title}</h3>
            {section.fields.map((field) => (
              <p key={field.label}><strong>{field.label}:</strong> {dish[field.key as keyof Dish]}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DishDetails;
