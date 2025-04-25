import React, { useState, useEffect } from 'react';
import queryString from 'query-string';

function SearchBar({ doctors, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    const parsedQuery = queryString.parse(window.location.search);
    if (parsedQuery.search) {
      setSearchTerm(parsedQuery.search);
    }
  }, []);

  useEffect(() => {
    if (searchTerm && doctors) {
      const filteredDoctors = doctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filteredDoctors.slice(0, 3).map(doc => doc.name));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, doctors]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    onSearch(suggestion);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
    setSuggestions([]);
  };

  return (
    <div data-testid="autocomplete-container" className="autocomplete-container">
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          data-testid="autocomplete-input"
          placeholder="Search doctor by name..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        {suggestions.length > 0 && (
          <ul data-testid="suggestions-list" className="suggestion-list">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion}
                data-testid="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default SearchBar;