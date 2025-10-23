const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
app.use(cookieParser());

const DB_PATH = path.join(__dirname, 'visitors.db');
const db = new sqlite3.Database(DB_PATH);

const ACTIVE_WINDOW_MS = 2 * 60 * 1000;

function todayStr(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    sid TEXT PRIMARY KEY,
    last_seen INTEGER
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS visits (
    sid TEXT,
    day TEXT,
    PRIMARY KEY (sid, day)
  )`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_sessions_last_seen ON sessions(last_seen)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_visits_day ON visits(day)`);
});

app.post('/api/visit', (req, res) => {
  try {
    let sid = req.cookies['visitor_sid'] || (req.body && req.body.sid) || null;
    if (!sid) {
      sid = 'sid-' + Math.random().toString(36).slice(2, 12);
      res.cookie('visitor_sid', sid, { path: '/', maxAge: 365 * 24 * 3600 * 1000 });
    }
    const now = Date.now();
    const day = todayStr(new Date());

    db.run(
      `INSERT INTO sessions (sid, last_seen) VALUES (?, ?)
       ON CONFLICT(sid) DO UPDATE SET last_seen=excluded.last_seen`,
      [sid, now],
      (err) => {
        if (err) console.error('session upsert err', err);
        db.run(
          `INSERT OR IGNORE INTO visits (sid, day) VALUES (?, ?)`,
          [sid, day],
          (err2) => {
            if (err2) console.error('visit insert err', err2);
            res.json({ ok: true });
          }
        );
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

app.get('/api/visitors', (req, res) => {
  try {
    const now = Date.now();
    const cutoff = now - ACTIVE_WINDOW_MS;

    db.get(
      `SELECT COUNT(*) as cnt FROM sessions WHERE last_seen >= ?`,
      [cutoff],
      (err, row) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ ok: false });
        }
        const active = row ? row.cnt : 0;

        const day7 = todayStr();
        const day7start = new Date();
        day7start.setUTCDate(day7start.getUTCDate() - 6);
        const day7startStr = todayStr(day7start);

        const day30start = new Date();
        day30start.setUTCDate(day30start.getUTCDate() - 29);
        const day30startStr = todayStr(day30start);

        db.get(
          `SELECT COUNT(DISTINCT sid) as cnt7 FROM visits WHERE day BETWEEN ? AND ?`,
          [day7startStr, day7],
          (err2, row2) => {
            if (err2) {
              console.error(err2);
              return res.status(500).json({ ok: false });
            }
            const last7 = row2 ? row2.cnt7 : 0;

            db.get(
              `SELECT COUNT(DISTINCT sid) as cnt30 FROM visits WHERE day BETWEEN ? AND ?`,
              [day30startStr, day7],
              (err3, row3) => {
                if (err3) {
                  console.error(err3);
                  return res.status(500).json({ ok: false });
                }
                const last30 = row3 ? row3.cnt30 : 0;

                res.json({ active: Number(active), last7: Number(last7), last30: Number(last30) });
              }
            );
          }
        );
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

app.use(express.static(path.join(__dirname, '..', 'public')));

setInterval(() => {
  const threshold = Date.now() - 1000 * 60 * 60 * 24 * 60;
  db.run(`DELETE FROM sessions WHERE last_seen < ?`, [threshold], (err) => {
    if (err) console.error('cleanup sessions err', err);
  });
  const oldDay = new Date();
  oldDay.setUTCDate(oldDay.getUTCDate() - 90);
  const oldDayStr = todayStr(oldDay);
  db.run(`DELETE FROM visits WHERE day < ?`, [oldDayStr], (err) => {
    if (err) console.error('cleanup visits err', err);
  });
}, 1000 * 60 * 60 * 6);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`visitors server running on ${port}`));
