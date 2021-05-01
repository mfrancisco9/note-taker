// Dependencies
const express = require("express");
const uuid = require('uuid');
const fs = require("fs");
const path = require("path");
let db = require("./db/db.json");
const app = express();
const PORT = process.env.PORT || 3000;

let savedNotes = db;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);



// displaying notes

app.get("/api/notes", (req, res) => res.json(db));


//posting a note

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuid.v4();
  console.log(newNote);
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    savedNotes.push(newNote);
    console.log(savedNotes); 
    fs.writeFile('db/db.json', JSON.stringify(savedNotes), function (err) {
      if (err) return console.log(err);
      console.log("Note saved");
    });
    
  });

  res.json(newNote);
});

// Delete the note
app.delete('/api/notes/:id', (req, res) => {
  const deleted = req.params.id;
  db = db.filter(note => note.id !== deleted);
  fs.writeFileSync('./db/db.json', JSON.stringify(db));
  res.json(db);
})



app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
