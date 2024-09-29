// import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';

// async function openDb() {
//     return open({
//         filename: './karaoke.db', // SQLiteデータベースのパス
//         driver: sqlite3.Database,
//     });
// }

// export default async function handler(req, res) {
//     const { song } = req.query;
//     const db = await openDb();
//     const songs = await db.all(
//         'SELECT * FROM songs WHERE title LIKE ? OR artist LIKE ?',
//         [`%${song}%`, `%${song}%`]
//     );
//     res.status(200).json(songs);
// }
