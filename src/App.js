import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

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
      setSelectedPerson(null);
    }
  };

  // Handle selecting a person from the search results
  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
    setSearchResults([]);
    setQuery('');
  };

  return (
    <div className="App">
      <h1>Gravestone Search</h1>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search by first or last name"
      />

      {searchResults.length > 1 && (
        <div>
          <h2>Multiple results found. Please select:</h2>
          <ul>
            {searchResults.map((person, index) => (
              <li key={index}>
                <button onClick={() => handleSelectPerson(person)}>
                  {person['First Name']} {person['Last Name']}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedPerson && (
        <div>
          <h2>Gravestone Information for {selectedPerson['First Name']} {selectedPerson['Last Name']}</h2>
          <p>Section: {selectedPerson['Section']}</p>
          <p>Row/Area: {selectedPerson['Row/Area']}</p>
          <p>Position: {selectedPerson['Position']}</p>
          <img
            src={`${process.env.PUBLIC_URL}/${selectedPerson['Image File']}`}
            alt={`${selectedPerson['First Name']} ${selectedPerson['Last Name']}`}
            style={{ width: '600px', height: '400px' }}
          />
        </div>
      )}

      {searchResults.length === 1 && (
        <div>
          <button onClick={() => handleSelectPerson(searchResults[0])}>
            Show information for {searchResults[0]['First Name']} {searchResults[0]['Last Name']}
          </button>
        </div>
      )}

      {searchResults.length === 0 && query && !selectedPerson && (
        <p>No results found.</p>
      )}
    </div>
  );
}

export default App;
