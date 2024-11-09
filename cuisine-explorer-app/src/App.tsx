import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import client from './apolloClient';
import DishList from './components/DishList';
import DishDetails from './components/DishDetails';
import DishSuggester from './components/DishSuggester';
import './App.css';
import Header from './components/Header';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <nav className="main-nav">
            <Header />
            <div className="nav-links">
              <Link to="/" className="nav-link">All Dishes</Link>
              <Link to="/suggest" className="nav-link">Dish Suggester</Link>
            </div>
          </nav>
          
          <Routes>
            <Route path="/" element={<DishList />} />
            <Route path="/dish/:name" element={<DishDetails />} />
            <Route path="/suggest" element={<DishSuggester />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;