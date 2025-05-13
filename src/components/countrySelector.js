// CountrySelector.js
import React from 'react';

const CountrySelector = ({ selectedCountry, onChange }) => {
  const countries = [
    { code: 'us', name: 'United States' },
    { code: 'in', name: 'India' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'au', name: 'Australia' },
    { code: 'ca', name: 'Canada' },
  ];

  return (
    <select
      className="form-select d-inline w-auto ms-2"
      value={selectedCountry}
      onChange={(e) => onChange(e.target.value)}
    >
      {countries.map((c) => (
        <option key={c.code} value={c.code}>
          {c.name}
        </option>
      ))}
    </select>
  );
};

export default CountrySelector;
