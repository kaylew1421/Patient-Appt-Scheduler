const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// appointments.json stays here:
const DATA_FILE = path.join(__dirname, 'appointments.json');

// Serve frontend files from sibling 'front-end' folder
app.use(express.static(path.join(__dirname, '..', 'front-end')));

app.use(express.json());

// Utility to read appointments
function readAppointments() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
}

// Utility to write appointments
function writeAppointments(appointments) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(appointments, null, 2));
}

// API routes
app.get('/appointments', (req, res) => {
  res.json(readAppointments());
});

app.post('/appointments', (req, res) => {
  const appts = readAppointments();
  const newAppt = {
    id: Date.now().toString(),
    ...req.body,
  };
  appts.push(newAppt);
  writeAppointments(appts);
  res.json(newAppt);
});

app.put('/appointments/:id', (req, res) => {
  const { id } = req.params;
  const appts = readAppointments();
  const idx = appts.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Appointment not found' });
  appts[idx] = { ...appts[idx], ...req.body };
  writeAppointments(appts);
  res.json(appts[idx]);
});

app.delete('/appointments/:id', (req, res) => {
  const { id } = req.params;
  const appts = readAppointments().filter(a => a.id !== id);
  writeAppointments(appts);
  res.json({ success: true });
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
