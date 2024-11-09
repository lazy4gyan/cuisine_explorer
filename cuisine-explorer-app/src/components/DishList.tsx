import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './DishList.css';
import { GET_ALL_DISHES } from '../graphql/queries';

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

interface SortConfig {
  key: keyof Dish;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  diet: string;
  course: string;
  state: string;
  region: string;
}

const DishList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [filters, setFilters] = useState<FilterConfig>({
    diet: '',
    course: '',
    state: '',
    region: '',
  });

  const { loading, error, data } = useQuery(GET_ALL_DISHES);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredDishes = data.getAllDishes.filter((dish: Dish) => {
    return (
      (!filters.diet || dish.diet.toLowerCase() === filters.diet.toLowerCase()) &&
      (!filters.course || dish.course.toLowerCase() === filters.course.toLowerCase()) &&
      (!filters.state || dish.state.toLowerCase() === filters.state.toLowerCase()) &&
      (!filters.region || dish.region.toLowerCase() === filters.region.toLowerCase())
    );
  });

  const sortedDishes = [...filteredDishes].sort((a: Dish, b: Dish) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDishes = sortedDishes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedDishes.length / itemsPerPage);

  const handleSort = (key: keyof Dish) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleFilterChange = (key: keyof FilterConfig, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="dish-list">
      <div className="filters">
        <select value={filters.diet} onChange={(e) => handleFilterChange('diet', e.target.value)}>
          <option value="">All Diets</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="non vegetarian">Non-Vegetarian</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('prep_time')}>
              Prep Time {sortConfig.key === 'prep_time' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('cook_time')}>
              Cook Time {sortConfig.key === 'cook_time' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th>Diet</th>
            <th>Course</th>
            <th>State</th>
            <th>Region</th>
          </tr>
        </thead>
        <tbody>
          {currentDishes.map((dish: Dish) => (
            <tr key={dish.name}>
              <td>
                <Link to={`/dish/${encodeURIComponent(dish.name)}`}>{dish.name}</Link>
              </td>
              <td>{dish.prep_time} mins</td>
              <td>{dish.cook_time} mins</td>
              <td>{dish.diet.slice(0, 1).toUpperCase() + dish.diet.slice(1)}</td>
              <td>{dish.course.slice(0, 1).toUpperCase() + dish.course.slice(1)}</td>
              <td>{dish.state === '-1' ? 'Unknown' : dish.state}</td>
              <td>{dish.region === '-1' ? 'Unknown' : dish.region}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DishList;
