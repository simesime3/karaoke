// import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';

// async function openDb() {
//     return open({
//         filename: './karaoke.db', // SQLiteデータベースのパス
//         driver: sqlite3.Database,
//     });
// }

// export default async function handler(req, res) {
//     const { person_id, song_id } = req.body;
//     const db = await openDb();

//     await db.run(
//         'INSERT INTO performances (person_id, song_id) VALUES (?, ?)',
//         [person_id, song_id]
//     );
    
//     res.status(200).json({ status: 'success' });
// }
