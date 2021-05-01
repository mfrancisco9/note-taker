// Dependencies
const express = require("express");
const uuid = require('uuid');
const fs = require("fs");
const path = require("path");
let db = require("./db/db.json");
const app = express();
const PORT = process.env.PORT || 3000;

// let savedNotes = db;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);


// display notes
app.get("/api/notes", (req, res) => {
  fs.readFile('./db/db.json', 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }
    console.log(data)
    res.json(JSON.parse(data))
  })
});


//posting a note

app.post("/api/notes", (req, res) => {
  fs.readFile('./db/db.json', "utf8", function (err, data) {
    if (err) throw err;
    
    data = JSON.parse(data);
    
    let noteAdd = 
    {
      title: req.body.title,
      text: req.body.text,
      id: uuid.v4()
    }

    var myNote = data.concat(noteAdd);
    
    fs.writeFile('./db/db.json', JSON.stringify(myNote), function (err) {
      if (err) return console.log(err);
      console.log("Note saved");
    });
    
  });

  res.json(data);
});

// Delete the note
app.delete('/api/notes/:id', (req, res) => {
  const deleted = req.params.id;
  db = db.filter(note => note.id !== deleted);
  fs.writeFileSync('./db/db.json', JSON.stringify(db));
  res.json(db);
})



app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
