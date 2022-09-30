const fs = require('fs');
const PORT = process.env.PORT || 3001;
const path = require('path');
const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');


const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require('./utils/fsUtils.js');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));



app.get('/notes', (req, res) => {

    // should return the `notes.html` file.
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});



// * `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.

app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});


app.get('*', (req, res) => {

    //  `GET *` should return the `index.html` file.
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


// * `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).

app.post('/api/notes', (req, res) => {
    console.log(req.body);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully.`);
    } else {
        res.errored('Error');
    }
});



app.listen(PORT, () =>
    console.log(`Express server listening on port ${PORT}!`)
);

