import { useState } from 'react';

// const openaiApiKey = process.env.OPENAI_API_KEY;

// console.log("OpenAI API Key:", openaiApiKey);

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/search?q=${query}`);
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Error fetching results. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Spotify Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a song"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {results.length > 0 && (
        <ul>
          {results.map((track, index) => (
            <li key={index}>
              <img src={track.image_url} alt={track.title} width="100" />
              <p><strong>{track.title}</strong> by {track.artist}</p>
              <a href={track.spotify_url} target="_blank" rel="noopener noreferrer">
                Listen on Spotify
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

