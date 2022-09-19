const express = require('express');
const path = require('path');
const fs = require('fs');
const { json } = require('express');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), "utf8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json('Error in reading notes.');
            return;
        }
        let notes = JSON.parse(data);
        res.status(201).json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    var newNote = req.body;
    if (newNote) {
        fs.readFile(path.join(__dirname, '/db/db.json'), "utf8", (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).json('Error in reading notes.');
                return;
            }
            let notes = JSON.parse(data);
            if (notes.length > 0) newNote.id = notes[notes.length-1].id+1; 
            else newNote.id = 1;
            notes.push(newNote);
            fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes, null, 4), (err) => {
                if (err) console.log(err);
            });
            res.status(201).json({
                status: 'success',
                body: newNote,
            });
        });
    } else {
        res.status(500).json('Error in adding notes.');
    }
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log("Server Port: " + PORT)
);
