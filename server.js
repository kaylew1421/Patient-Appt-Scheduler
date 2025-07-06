const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'appointments.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

function readAppointments() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}

function writeAppointments(appointments) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(appointments, null, 2));
}

app.get('/appointments', (req, res) => {
  res.json(readAppointments());
});

app.post('/appointments', (req, res) => {
  const appts = readAppointments();
  appts.push(req.body);
  writeAppointments(appts);
  res.json({ success: true });
});

app.put('/appointments/:id', (req, res) => {
  const id = Number(req.params.id);
  let appts = readAppointments();
  const idx = appts.findIndex(a => a.id === id);
  if (idx === -1) return res.json({ success: false });
  appts[idx] = { ...appts[idx], ...req.body };
  writeAppointments(appts);
  res.json({ success: true });
});

app.delete('/appointments/:id', (req, res) => {
  const id = Number(req.params.id);
  const appts = readAppointments().filter(a => a.id !== id);
  writeAppointments(appts);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
