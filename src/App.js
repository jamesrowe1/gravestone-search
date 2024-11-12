import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/graves.csv`)
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

  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setSearchResults([]);
      setSelectedPerson(null);
    } else {
      const terms = value.toLowerCase().split(' ');

      const results = data.filter(person => {
        const firstName = person['First Name']?.toLowerCase() || '';
        const lastName = person['Last Name']?.toLowerCase() || '';

        if (terms.length === 1) {
          return firstName.includes(terms[0]) || lastName.includes(terms[0]);
        } else if (terms.length === 2) {
          return (
            (firstName.includes(terms[0]) && lastName.includes(terms[1])) ||
            (firstName.includes(terms[1]) && lastName.includes(terms[0]))
          );
        }
        return false;
      });

      setSearchResults(results);

      if (results.length === 1) {
        setSelectedPerson(results[0]);
      } else {
        setSelectedPerson(null);
      }
    }
  };

  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
    setSearchResults([]);
  };

  return (
    <div className="App">
      <h1>Gravestone Search</h1>
      <p className="instructions">
        Please enter the first or last name, or both, of the person whose gravestone information you wish to find.
      </p>

      <div className="search-and-info">
        <div className="map-section">
          <img
            className="cemetery-map"
            src={`${process.env.PUBLIC_URL}/uploads/CemeteryMap.png`}
            alt="Cemetery Map"
          />
        </div>
        <div className="search-section">
          <input
            className="search-input"
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search by first or last name, or both"
          />
        </div>

        {searchResults.length > 1 && (
          <div className="results-list">
            <h2>Multiple results found. Please select:</h2>
            <ul>
              {searchResults.map((person, index) => (
                <li key={index}>
                  <button className="person-select-btn" onClick={() => handleSelectPerson(person)}>
                    {person['First Name']} {person['Last Name']}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedPerson && (
          <div className="person-info">
            <h2>Gravestone Information for {selectedPerson['First Name']} {selectedPerson['Last Name']}</h2>
            <p>Section: {selectedPerson['Section']}</p>
            <p>Row/Area: {selectedPerson['Row/Area']}</p>
            <p>Position: {selectedPerson['Position']}</p>
            <p>Birth Date: {selectedPerson['Birth Date'] || 'N/A'}</p>
            <p>Death Date: {selectedPerson['Death Date'] || 'N/A'}</p>
            <img
              className="gravestone-image"
              src={`${process.env.PUBLIC_URL}/${selectedPerson['Image File']}`}
              alt={`${selectedPerson['First Name']} ${selectedPerson['Last Name']}`}
            />
          </div>
        )}

        {searchResults.length === 0 && query && !selectedPerson && (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
