import sqlite3

# データベースに接続
conn = sqlite3.connect('karaoke.db')

# カーソルを作成
cursor = conn.cursor()

# peopleテーブルにデータを挿入
cursor.execute("INSERT INTO people (name, age, email) VALUES (?, ?, ?)", ('Taro', 25, 'taro@example.com'))

# songsテーブルにデータを挿入
cursor.execute("INSERT INTO songs (title, artist) VALUES (?, ?)", ('Song Title 1', 'Artist 1'))

# コミットして変更を保存
conn.commit()

# 接続を閉じる
conn.close()

print("データが挿入されました")

