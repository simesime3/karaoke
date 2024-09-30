import { useState, useEffect } from 'react';


export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState('1'); // デフォルトで Taro を選択
  const [people, setPeople] = useState([]);
  const [performances, setPerformances] = useState([]);

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
  const registerPerformance = async (songId, title, artist) => {
    const requestBody = {
      person_id: selectedPerson,  // 人のIDをフロントエンドから送信
      song_id: songId,            // 曲のIDを送信
      title: title,               // 曲のタイトルを送信
      artist: artist              // アーティスト名を送信  
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

  // personの情報を取得
  useEffect(() => {
    // Peopleの一覧を取得する
    const fetchPeople = async () => {
      const res = await fetch('http://localhost:5000/people');
      const data = await res.json();
      setPeople(data);
    };

    fetchPeople();
  }, []);

  // パフォーマンスを取得する関数
  const fetchPerformances = async (personId) => {
    const res = await fetch(`http://localhost:5000/performances/${personId}`);
    const data = await res.json();
    console.log('Performances:', data);  // ここでデータが取れているか確認
    setPerformances(data);
    setSelectedPerson(personId);  // 選択された人を記憶する
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

      <h1>Karaoke Performance Tracker</h1>

      {/* Peopleのリスト表示 */}
      <h2>People</h2>
      <ul>
        {people.map((person) => (
          <li key={person.id}>
            <button onClick={() => fetchPerformances(person.id)}>
              {person.name} ({person.age}歳)
            </button>
          </li>
        ))}
      </ul>

      {/* Performancesのリスト表示 */}
      {selectedPerson && (
        <>
          <h2>Performances for Person {selectedPerson}</h2>
          <ul>
            {performances.map((performance, index) => (
              <li key={index}>
                {performance.title} by {performance.artist} on {performance.date}
              </li>
            ))}
          </ul>
        </>
      )}

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
                <button onClick={() => registerPerformance(track.id, track.title, track.artist)}>
                  Register Performance
                </button>

              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
