import sqlite3

# データベースの作成（ファイルが存在しない場合、自動的に作成される）
conn = sqlite3.connect('karaoke.db')

# カーソルを取得
cur = conn.cursor()

# 人の情報を保存するテーブルを作成
cur.execute('''
    CREATE TABLE IF NOT EXISTS people (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER,
        email TEXT
    )
''')

# 歌の情報を保存するテーブルを作成
cur.execute('''
    CREATE TABLE IF NOT EXISTS songs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        artist TEXT
    )
''')

# 人と歌の紐付け（パフォーマンス）を保存するテーブルを作成
cur.execute('''
    CREATE TABLE IF NOT EXISTS performances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        person_id INTEGER,
        song_id INTEGER,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(person_id) REFERENCES people(id),
        FOREIGN KEY(song_id) REFERENCES songs(id)
    )
''')

# 変更を保存して接続を閉じる
conn.commit()
conn.close()

print("Database and tables created successfully.")
