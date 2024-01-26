const express = require('express');
const fs = require('fs');
const uniqid = require('uniqid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON data
app.use(express.json());
app.use(express.static('public'));

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/public/notes.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API Routes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uniqid(); // Assign a unique id using uniqid package
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  notes.push(newNote);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  notes = notes.filter((note) => note.id !== noteId);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
  res.json({ message: 'Note deleted' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`open http://localhost:${PORT} in your browser`);
});
