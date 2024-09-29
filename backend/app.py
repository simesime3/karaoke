from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import openai
import os
from dotenv import load_dotenv
import sqlite3


# 変更
# .envファイルから環境変数をロード
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}) # CORS設定を更新

@app.route('/', methods=['GET'])
def hello():
    return jsonify({'message': 'Flask start!'})

# SpotifyのAPIキーとシークレット
SPOTIPY_CLIENT_ID = os.getenv("SPOTIPY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET =  os.getenv("SPOTIPY_CLIENT_SECRET")
SPOTIPY_TOKEN_URL = 'https://accounts.spotify.com/api/token'


# アクセストークンを取得する関数
def get_spotify_access_token():
    auth_response = requests.post(SPOTIPY_TOKEN_URL, {
        'grant_type': 'client_credentials',
        'client_id': SPOTIPY_CLIENT_ID,
        'client_secret': SPOTIPY_CLIENT_SECRET,
    })
    
    # トークンが正しく取得できたか確認
    if auth_response.status_code != 200:
        raise Exception(f"Failed to get access token: {auth_response.text}")
    
    auth_response_data = auth_response.json()
    return auth_response_data['access_token']

def get_db_connection():
    conn = sqlite3.connect('karaoke.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/register-performance', methods=['POST'])
def register_performance():
    data = request.get_json()
    print("Received Data:", data)
    
    person_id = data.get('person_id')
    song_id = data.get('song_id')
    
    if not person_id or not song_id:
        return jsonify({'error': 'Missing person_id or song_id'}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # トランザクションを開始
        cur.execute('BEGIN TRANSACTION')
        # print(person_id)
        cur.execute('INSERT INTO performances (person_id, song_id) VALUES (?, ?)', (person_id, song_id))
        
        # コミットして変更を保存
        conn.commit()
    except sqlite3.Error as e:
        print("SQLite error:", e)  # エラーを出力
        conn.rollback()  # エラーが発生した場合はロールバック
        return jsonify({'error': 'Failed to register performance'}), 500
    finally:
        conn.close()

    return jsonify({'message': 'Performance registered successfully'}), 201


# Spotify APIを使って曲を検索する関数
@app.route('/search', methods=['GET'])
def search_tracks():
    query = request.args.get('q')
    if not query:
        return jsonify({'error': 'Missing query parameter'}), 400

    # トークンを取得
    token = get_spotify_access_token()
    
    headers = {
        'Authorization': f'Bearer {token}'  # ここでトークンをヘッダーに含める
    }
    
    search_url = 'https://api.spotify.com/v1/search'
    params = {
        'q': query,
        'type': 'track',
        'limit': 10
    }
    
    # Spotify APIにリクエストを送る
    response = requests.get(search_url, headers=headers, params=params)
    
    # レスポンスが正しく取得できたか確認
    if response.status_code != 200:
        return jsonify({'error': f"Failed to search: {response.text}"}), response.status_code
    
    data = response.json()

    # 必要な情報を抽出
    results = []
    for item in data['tracks']['items']:
        results.append({
            'id': item['id'],  # Spotifyのtrack IDを追加
            'title': item['name'],
            'artist': item['artists'][0]['name'],
            'image_url': item['album']['images'][0]['url'],
            'spotify_url': item['external_urls']['spotify']
        })

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)


