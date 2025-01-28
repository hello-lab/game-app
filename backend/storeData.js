const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const ExcelJS = require('exceljs');

// Initialize SQLite database
const db = new sqlite3.Database('./daata.db');

// Create table for storing data
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS data (
            id TEXT ,
            marketId TEXT,
            marketName TEXT,
            exEventId TEXT,
            eventName TEXT,
            sportId TEXT,
            sportName TEXT,
            eventTime TEXT,
            tournamentId TEXT,
            tournamentName TEXT,
            isFancy INTEGER,
            marketType TEXT,
            isBookmakers INTEGER,
            popular INTEGER,
            quickLink INTEGER,
            isStreaming INTEGER,
            isVirtual INTEGER,
            isSportsbook INTEGER,
            isCasinoGame INTEGER
        )
    `);
});

// Read data from res.json
fs.readFile('res.json', 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading res.json:', err);
        return;
    }

    const jsonData = JSON.parse(data).data;

    const sports = [
        jsonData[1], // soccer
        jsonData[2], // tennis
        jsonData[4], // cricket
        jsonData[7], // horse racing
        jsonData[4339], // greyhound
        jsonData[2378961] // politics
    ];

    // Store data in SQLite database
    const insertData = db.prepare(`
        INSERT INTO data (id, marketId, marketName, exEventId, eventName, sportId, sportName, eventTime, tournamentId, tournamentName, isFancy, marketType, isBookmakers, popular, quickLink, isStreaming, isVirtual, isSportsbook, isCasinoGame)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    worksheet.columns = [
        { header: 'ID', key: '_id', width: 30 },
        { header: 'Market ID', key: 'marketId', width: 30 },
        { header: 'Market Name', key: 'marketName', width: 30 },
        { header: 'Ex Event ID', key: 'exEventId', width: 30 },
        { header: 'Event Name', key: 'eventName', width: 30 },
        { header: 'Sport ID', key: 'sportId', width: 10 },
        { header: 'Sport Name', key: 'sportName', width: 30 },
        { header: 'Event Time', key: 'eventTime', width: 30 },
        { header: 'Tournament ID', key: 'tournamentId', width: 30 },
        { header: 'Tournament Name', key: 'tournamentName', width: 30 },
        { header: 'Is Fancy', key: 'isFancy', width: 10 },
        { header: 'Market Type', key: 'marketType', width: 30 },
        { header: 'Is Bookmakers', key: 'isBookmakers', width: 10 },
        { header: 'Popular', key: 'popular', width: 10 },
        { header: 'Quick Link', key: 'quickLink', width: 10 },
        { header: 'Is Streaming', key: 'isStreaming', width: 10 },
        { header: 'Is Virtual', key: 'isVirtual', width: 10 },
        { header: 'Is Sportsbook', key: 'isSportsbook', width: 10 },
        { header: 'Is Casino Game', key: 'isCasinoGame', width: 10 }
    ];

    for (const sport of sports) {
        for (const item of sport) {
            const response = await fetch('https://247sportz.in/api/exchange/markets/getMarketsEventList', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: item.exEventId,
                    sportId: item.sportId,
                    key: "2"
                })
            });

            const marketData = (await response.json()).data;
            console.log(marketData.matchOddsData,'r')
            console.log(marketData.sportsbook,'r')
            insertData.run(
                item._id,
                item.marketId,
                item.marketName,
                item.exEventId,
                item.eventName,
                item.sportId,
                item.sportName,
                item.eventTime,
                item.tournamentId,
                item.tournamentName,
                item.oddsData.isFancy ? 1 : 0,
                item.oddsData.marketType,
                item.oddsData.isBookmakers ? 1 : 0,
                item.oddsData.popular ? 1 : 0,
                item.runnersData.quickLink ? 1 : 0,
                item.runnersData.isStreaming ? 1 : 0,
                item.runnersData.isVirtual ? 1 : 0,
                item.runnersData.isSportsbook ? 1 : 0,
                item.runnersData.isCasinoGame ? 1 : 0,


            );

            worksheet.addRow({
                _id: item._id,
                marketId: item.marketId,
                marketName: item.marketName,
                exEventId: item.exEventId,
                eventName: item.eventName,
                sportId: item.sportId,
                sportName: item.sportName,
                eventTime: item.eventTime,
                tournamentId: item.tournamentId,
                tournamentName: item.tournamentName,
                isFancy: item.oddsData.isFancy ? 1 : 0,
                marketType: item.oddsData.marketType,
                isBookmakers: item.oddsData.isBookmakers ? 1 : 0,
                popular: item.oddsData.popular ? 1 : 0,
                quickLink: item.runnersData.quickLink ? 1 : 0,
                isStreaming: item.runnersData.isStreaming ? 1 : 0,
                isVirtual: item.runnersData.isVirtual ? 1 : 0,
                isSportsbook: item.runnersData.isSportsbook ? 1 : 0,
                isCasinoGame: item.runnersData.isCasinoGame ? 1 : 0
            });

            // Delay between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    insertData.finalize();

    workbook.xlsx.writeFile('data.xlsx')
        .then(() => {
            console.log('Data has been written to data.xlsx');
        })
        .catch(error => {
            console.error('Error writing to data.xlsx:', error);
        });
});
