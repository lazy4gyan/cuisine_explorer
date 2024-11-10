import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { SEARCH_DISHES } from "../../graphql/queries";
import "./Header.css";
import { LOGO_TEXT, NOT_FOUND_MESSAGE } from "../../utils/helper";

interface SearchResult {
  name: string;
  ingredients: string;
  state: string;
  region: string;
  matchType: string;
}

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data, loading } = useQuery(SEARCH_DISHES, {
    variables: { term: searchTerm },
    skip: searchTerm.length < 2,
  });

  const groupedResults = useMemo(() => {
    if (!data?.searchDishes) return null;

    return data.searchDishes.reduce((acc: { [key: string]: SearchResult[] }, result: SearchResult) => {
      if (!acc[result.matchType]) {
        acc[result.matchType] = [];
      }
      acc[result.matchType].push(result);
      return acc;
    }, {});
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsSearchFocused(true);
  };

  const handleResultClick = (dishName: string) => {
    navigate(`/dish/${encodeURIComponent(dishName)}`);
    setSearchTerm("");
    setIsSearchFocused(false);
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>{LOGO_TEXT}</h1>
        </Link>

        <div className="search-container" ref={searchRef}>
          <div className="search-input-wrapper">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search dishes, ingredients, or regions..."
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {isSearchFocused && searchTerm.length >= 2 && (
            <div className="search-results">
              {loading ? (
                <div className="search-message">Searching...</div>
              ) : groupedResults ? (
                <div>
                  {groupedResults.name && (
                    <div className="result-group">
                      <h3>Dishes</h3>
                      <ul>
                        {groupedResults.name.map((result: SearchResult) => (
                          <li
                            key={result.name}
                            onClick={() => handleResultClick(result.name)}
                          >
                            <div className="result-name">{result.name}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {groupedResults.ingredients && (
                    <div className="result-group">
                      <h3>By Ingredients</h3>
                      <ul>
                        {groupedResults.ingredients.map(
                          (result: SearchResult) => (
                            <li
                              key={result.name}
                              onClick={() => handleResultClick(result.name)}
                            >
                              <div className="result-name">{result.name}</div>
                              <div className="result-meta">
                                Contains: {result.ingredients}
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {groupedResults.origin && (
                    <div className="result-group">
                      <h3>By Region</h3>
                      <ul>
                        {groupedResults.origin.map((result: SearchResult) => (
                          <li
                            key={result.name}
                            onClick={() => handleResultClick(result.name)}
                          >
                            <div className="result-name">{result.name}</div>
                            <div className="result-meta">
                              {result.state && <span>{result.state}</span>}
                              {result.region && <span>{result.region}</span>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="search-message">{NOT_FOUND_MESSAGE}</div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
