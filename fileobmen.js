const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const DB = "/joskaBD/Users.sqlite"
const sqlite3 = require("sqlite3");
const cors = require("cors");
const main = require('./joskaBD/index.html');
app.use(express.json());
app.use(cors());
app.get('/', (request, response) => {
    response.send(main);
})
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'loader/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });
app.post('/loader', upload.single('file'), function (req, res, next) {
    const file = req.file;
    if (!file) {
        return res.json({ message: 'выберите файл' });
    }
    return res.json({ message: 'Заряжен' });
});
let db = new sqlite3.Database(DB, (err) => {
    if (err) {
        console.error(err.message);
        throw err
    }
    else {
        db.run(`create table users  (
           id integer primary key autoincrement,
            Name text,
            Password text
        )`,
            (err) => {
                if (err) {
                    console.error("Ошибочка, что-то пошло не так???");
                }
                else {
                    const insert = 'INSERT INTO Users (NAME, PASSWORD) VALUES (?,?)'
                    db.run(insert, ["Ferox", "abaldui"]);
                    console.log("Таблица создана");
                }
            })
    }
})
app.listen(5000, function () {
    console.log('запуск на 5000 порту');
});

