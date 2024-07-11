// app.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT)");
});

app.post('/notify', (req, res) => {
    const { message } = req.body;
    db.run("INSERT INTO notifications (message) VALUES (?)", [message], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id: this.lastID });
    });
});

app.get('/notifications', (req, res) => {
    db.all("SELECT * FROM notifications", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ notifications: rows });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});