import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Load the CSV data when the component mounts
  useEffect(() => {
    fetch('/data/graves.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: (result) => {
            setData(result.data);
          },
        });
      });
  }, []);

  // Handle input changes for the search field
  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setSearchResults([]);
      setSelectedPerson(null);
    } else {
      const results = data.filter(person =>
        (person['First Name'] && person['First Name'].toLowerCase().includes(value.toLowerCase())) ||
        (person['Last Name'] && person['Last Name'].toLowerCase().includes(value.toLowerCase()))
      );

      setSearchResults(results);

      // Automatically select person if only one match is found
      if (results.length === 1) {
        setSelectedPerson(results[0]);
      } else {
        setSelectedPerson(null);
      }
    }
  };

  // Handle selecting a person from the search results (for multiple results)
  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
    setSearchResults([]);
    setQuery('');
  };

  return (
    <div className="App">
      <header>
        <h1>Gravestone Search</h1>
        {/* CemeteryMap Image */}
        <img
          className="cemetery-map"
          src={`${process.env.PUBLIC_URL}/uploads/CemeteryMap.png`}
          alt="Cemetery Map"
        />
      </header>

      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search by first or last name"
        className="search-box"
      />

      {/* Display Search Results */}
      {searchResults.length > 1 && (
        <div>
          <h2>Multiple results found. Please select:</h2>
          <ul className="search-results">
            {searchResults.map((person, index) => (
              <li key={index}>
                <button className="result-button" onClick={() => handleSelectPerson(person)}>
                  {person['First Name']} {person['Last Name']}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display Selected Person's Information */}
      {selectedPerson && (
        <div className="person-details">
          <h2>Gravestone Information for {selectedPerson['First Name']} {selectedPerson['Last Name']}</h2>
          <p><strong>Section:</strong> {selectedPerson['Section']}</p>
          <p><strong>Row/Area:</strong> {selectedPerson['Row/Area']}</p>
          <p><strong>Position:</strong> {selectedPerson['Position']}</p>
          <img
            className="person-image"
            src={`${process.env.PUBLIC_URL}/${selectedPerson['Image File']}`}
            alt={`${selectedPerson['First Name']} ${selectedPerson['Last Name']}`}
          />
        </div>
      )}

      {/* Handle No Results Found */}
      {searchResults.length === 0 && query && !selectedPerson && (
        <p>No results found.</p>
      )}
    </div>
  );
}

export default App;
