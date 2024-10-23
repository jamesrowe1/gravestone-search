import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css'; // Include the CSS file

function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Load the CSV data when the component mounts
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

      // Automatically select if only one result matches
      if (results.length === 1) {
        setSelectedPerson(results[0]);
      } else {
        setSelectedPerson(null);
      }
    }
  };

  // Handle selecting a person from the search results
  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
    setSearchResults([]);
  };

  return (
    <div className="App">
      <h1>Gravestone Search</h1>
      <p className="instructions">
        Please enter the first or last name of the person whose gravestone information you wish to find. 
        This search tool allows you to respectfully locate and view gravestones. If multiple results are found, 
        please select the appropriate individual.
      </p>

      <div className="content-container">
        {/* Cemetery Map Image */}
        <div className="map-section">
          <img
            className="cemetery-map"
            src={`${process.env.PUBLIC_URL}/uploads/CemeteryMap.png`}
            alt="Cemetery Map"
          />
        </div>

        <div className="search-and-info">
          <div className="search-section">
            <input
              className="search-input"
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search by first or last name"
            />
          </div>

          {/* Show multiple search results */}
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

          {/* Show gravestone info if a person is selected */}
          {selectedPerson && (
            <div className="person-info">
              <h2>Gravestone Information for {selectedPerson['First Name']} {selectedPerson['Last Name']}</h2>
              <p>Section: {selectedPerson['Section']}</p>
              <p>Row/Area: {selectedPerson['Row/Area']}</p>
              <p>Position: {selectedPerson['Position']}</p>
              <img
                className="gravestone-image"
                src={`${process.env.PUBLIC_URL}/${selectedPerson['Image File']}`}
                alt={`${selectedPerson['First Name']} ${selectedPerson['Last Name']}`}
              />
            </div>
          )}

          {/* Show "No results" if search yields nothing */}
          {searchResults.length === 0 && query && !selectedPerson && (
            <p>No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
