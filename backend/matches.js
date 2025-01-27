const fetch = require('node-fetch');
const sqlite3 = require('sqlite3').verbose();
const ExcelJS = require('exceljs');

// Initialize SQLite database
const db = new sqlite3.Database('./matches.db');

// Create table for matches
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS matches (
            id INTEGER PRIMARY KEY,
            name TEXT,
            tournament_id INTEGER,
            tournament_name TEXT,
            season_id INTEGER,
            season_name TEXT,
            status_type TEXT,
            time TEXT,
            home_team_id INTEGER,
            home_team_name TEXT,
            away_team_id INTEGER,
            away_team_name TEXT,
            home_team_score INTEGER,
            away_team_score INTEGER,
            start_time TEXT
        )
    `);
});

// Fetch data from API
async function fetchData() {
    try {
        const response = await fetch('https://football.sportdevs.com/matches-live', {
            headers: {
                'Authorization': 'Bearer OZaIkLl-BkS_CTiOrQKFWw'
            }
        });
        const matches = await response.json();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Matches');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Tournament ID', key: 'tournament_id', width: 15 },
            { header: 'Tournament Name', key: 'tournament_name', width: 30 },
            { header: 'Season ID', key: 'season_id', width: 15 },
            { header: 'Season Name', key: 'season_name', width: 30 },
            { header: 'Status Type', key: 'status_type', width: 15 },
            { header: 'Time', key: 'time', width: 10 },
            { header: 'Home Team ID', key: 'home_team_id', width: 15 },
            { header: 'Home Team Name', key: 'home_team_name', width: 30 },
            { header: 'Away Team ID', key: 'away_team_id', width: 15 },
            { header: 'Away Team Name', key: 'away_team_name', width: 30 },
            { header: 'Home Team Score', key: 'home_team_score', width: 15 },
            { header: 'Away Team Score', key: 'away_team_score', width: 15 },
            { header: 'Start Time', key: 'start_time', width: 30 }
        ];

        const updateMatch = db.prepare(`
            UPDATE matches
            SET name = ?, tournament_id = ?, tournament_name = ?, season_id = ?, season_name = ?, status_type = ?, time = ?, home_team_id = ?, home_team_name = ?, away_team_id = ?, away_team_name = ?, home_team_score = ?, away_team_score = ?, start_time = ?
            WHERE id = ?
        `);

        const insertMatch = db.prepare(`
            INSERT INTO matches (id, name, tournament_id, tournament_name, season_id, season_name, status_type, time, home_team_id, home_team_name, away_team_id, away_team_name, home_team_score, away_team_score, start_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const match of matches) {
            const { id, name, tournament_id, tournament_name, season_id, season_name, status_type, time, home_team_id, home_team_name, away_team_id, away_team_name, home_team_score, away_team_score, start_time } = match;

            db.get('SELECT * FROM matches WHERE id = ?', [id], (err, row) => {
                if (err) {
                    console.error(err.message);
                    return;
                }

                if (row) {
                    updateMatch.run(name, tournament_id, tournament_name, season_id, season_name, status_type, time, home_team_id, home_team_name, away_team_id, away_team_name, home_team_score.current, away_team_score.current, start_time, id);
                } else {
                    insertMatch.run(id, name, tournament_id, tournament_name, season_id, season_name, status_type, time, home_team_id, home_team_name, away_team_id, away_team_name, home_team_score.current, away_team_score.current, start_time);
                }

                if (status_type === 'completed') {
                    const winner = home_team_score.current > away_team_score.current ? home_team_name : away_team_name;
                    console.log(`Match ${name} completed. Winner: ${winner}`);
                }
            });

            worksheet.addRow({
                id,
                name,
                tournament_id,
                tournament_name,
                season_id,
                season_name,
                status_type,
                time,
                home_team_id,
                home_team_name,
                away_team_id,
                away_team_name,
                home_team_score: home_team_score.current,
                away_team_score: away_team_score.current,
                start_time
            });
        }

        await workbook.xlsx.writeFile('matches.xlsx');
        console.log('Data has been written to matches.xlsx');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();
