document.addEventListener('DOMContentLoaded', () => {
const form = document.getElementById('appointmentForm');
const searchInput = document.getElementById('searchInput');
const exportBtn = document.getElementById('exportCSVBtn');
const appointmentsTableBody = document.querySelector('#appointmentsTable tbody');

let allAppointments = [];

async function loadAppointments() {
  try {
    const res = await fetch('/appointments');
    allAppointments = await res.json();
    displayAppointments(allAppointments);
  } catch (err) {
    console.error(err);
  }
}

function displayAppointments(appointments) {
  appointmentsTableBody.innerHTML = '';
  appointments.forEach(appt => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${appt.patientName}</td>
      <td>${appt.patientId}</td>
      <td>${appt.dob}</td>
      <td>${appt.phone}</td>
      <td>${appt.dos}</td>
      <td>${appt.dosTime}</td>
      <td>${appt.providerName}</td>
      <td>${appt.insuranceType}</td>
      <td>${appt.reason}</td>
      <td>
        <button onclick="editAppointment(${appt.id})">✏️</button>
        <button onclick="deleteAppointment(${appt.id})">🗑️</button>
      </td>`;
    appointmentsTableBody.appendChild(tr);
  });
}

searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  const filtered = allAppointments.filter(appt =>
    appt.patientName.toLowerCase().includes(term) ||
    appt.providerName.toLowerCase().includes(term) ||
    appt.dos.includes(term)
  );
  displayAppointments(filtered);
});

exportBtn.addEventListener('click', () => {
  const rows = Array.from(appointmentsTableBody.querySelectorAll('tr'));
  let csv = 'Patient Name,Patient ID,DOB,Phone,Date,Time,Provider,Insurance,Reason\n';
  rows.forEach(row => {
    const cols = Array.from(row.querySelectorAll('td'));
    csv += cols.slice(0, 9).map(td => `"${td.textContent}"`).join(',') + '\n';
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'appointments.csv';
  a.click();
  URL.revokeObjectURL(url);
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(form);
  const newAppt = {};
  formData.forEach((val, key) => newAppt[key] = val.trim());
  newAppt.id = Date.now();
  try {
    const res = await fetch('/appointments', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newAppt)
    });
    if (await res.json()) {
      form.reset();
      loadAppointments();
    }
  } catch (err) {
    console.error(err);
  }
});

window.deleteAppointment = async id => {
  if (!confirm('Delete this appointment?')) return;
  await fetch(`/appointments/${id}`, { method: 'DELETE' });
  loadAppointments();
};

window.editAppointment = async id => {
  const appt = allAppointments.find(a => a.id === id);
  if (!appt) return;
  for (const [k, v] of Object.entries(appt)) {
    if (form[k]) form[k].value = v;
  }
  deleteAppointment(id);
};

loadAppointments();
});
