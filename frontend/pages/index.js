import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState('1'); // デフォルトで Taro を選択

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/search?q=${query}`);

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      console.log('Search Results:', data); // ここでレスポンスの内容を確認
      setResults(data);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Error fetching results. Please try again later.');
    }
  };

  // 曲の登録を行う関数
  const registerPerformance = async (songId) => {
    const requestBody = {
      person_id: selectedPerson,  // 人のIDをフロントエンドから送信
      song_id: songId,  // 曲のIDを送信
    };
  
    console.log('Request Body:', requestBody);  // デバッグ用にリクエストボディをログ出力
  
    try {
      const res = await fetch('http://localhost:5000/register-performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),  // JSON形式でデータを送信
      });
  
      if (!res.ok) {
        throw new Error('Failed to register performance');
      }
  
      alert('Performance registered successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error registering performance. Please try again later.');
    }
  };
  

  return (
    <div>
      <h1>Karaoke Song Search</h1>
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

      {/* 検索結果表示 */}
      {results.length > 0 && (
        <div>
          <h2>Search Results</h2>
          <ul>
            {results.map((track, index) => (
              <li key={index}>
                <img src={track.image_url} alt={track.title} width="100" />
                <p><strong>{track.title}</strong> by {track.artist}</p>
                <a href={track.spotify_url} target="_blank" rel="noopener noreferrer">
                  Listen on Spotify
                </a>

                {/* 人選択用のセレクトボックス */}
                <div>
                  <label htmlFor={`person-select-${index}`}>Select a person:</label>
                  <select
                    id={`person-select-${index}`}
                    value={selectedPerson}
                    onChange={(e) => setSelectedPerson(e.target.value)}
                  >
                    <option value="1">Taro</option>
                    <option value="2">Hanako</option>
                    {/* 他の人もここに追加 */}
                  </select>
                </div>

                {/* 登録ボタン */}
                <button onClick={() => registerPerformance(track.id)}>Register Performance</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
