document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('appointmentForm');
  const searchInput = document.getElementById('searchInput');
  const exportBtn = document.getElementById('exportCSVBtn');
  const appointmentsTableBody = document.querySelector('#appointmentsTable tbody');

  let allAppointments = [];
  let editingId = null;

  async function loadAppointments() {
    try {
      const res = await fetch('/appointments');
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const data = await res.json();
      allAppointments = data;
      displayAppointments(allAppointments);
    } catch (err) {
      console.error('Error loading appointments:', err);
    }
  }

  function displayAppointments(appointments) {
    appointmentsTableBody.innerHTML = '';
    if (appointments.length === 0) {
      appointmentsTableBody.innerHTML = '<tr><td colspan="10" style="text-align:center; font-style:italic; color:#555;">No appointments found.</td></tr>';
      return;
    }
    appointments.forEach(appt => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${appt.patientName}</td>
        <td>${appt.patientId || ''}</td>
        <td>${appt.dob}</td>
        <td>${appt.phone}</td>
        <td>${appt.dos}</td>
        <td>${appt.dosTime}</td>
        <td>${appt.providerName}</td>
        <td>${appt.insuranceType}</td>
        <td>${appt.reason}</td>
        <td>
          <button class="btn-edit" data-id="${appt.id}" aria-label="Edit appointment for ${appt.patientName}">✏️ <span>Edit</span></button>
          <button class="btn-delete" data-id="${appt.id}" aria-label="Delete appointment for ${appt.patientName}">🗑️ <span>Delete</span></button>
        </td>
      `;
      appointmentsTableBody.appendChild(tr);
    });
  }

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    const filtered = allAppointments.filter(appt => {
      return (
        appt.patientName.toLowerCase().includes(term) ||
        (appt.patientId && appt.patientId.toLowerCase().includes(term)) ||
        appt.providerName.toLowerCase().includes(term) ||
        appt.insuranceType.toLowerCase().includes(term) ||
        appt.reason.toLowerCase().includes(term)
      );
    });
    displayAppointments(filtered);
  });

  exportBtn.addEventListener('click', () => {
    if (allAppointments.length === 0) {
      alert('No appointments to export.');
      return;
    }
    const header = ['Patient Name', 'Patient ID', 'DOB', 'Phone', 'Date of Service', 'Time', 'Provider', 'Insurance', 'Reason', 'Notes'];
    const rows = allAppointments.map(a => [
      `"${a.patientName}"`,
      `"${a.patientId || ''}"`,
      `"${a.dob}"`,
      `"${a.phone}"`,
      `"${a.dos}"`,
      `"${a.dosTime}"`,
      `"${a.providerName}"`,
      `"${a.insuranceType}"`,
      `"${a.reason}"`,
      `"${a.notes || ''}"`
    ]);
    let csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appointments.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  appointmentsTableBody.addEventListener('click', async (e) => {
    if (e.target.closest('.btn-edit')) {
      const id = e.target.closest('.btn-edit').dataset.id;
      const appt = allAppointments.find(a => a.id === id);
      if (!appt) return;
      // Fill form with existing data
      form.patientName.value = appt.patientName || '';
      form.patientId.value = appt.patientId || '';
      form.dob.value = appt.dob || '';
      form.homeAddress.value = appt.homeAddress || '';
      form.phone.value = appt.phone || '';
      form.dos.value = appt.dos || '';
      form.dosTime.value = appt.dosTime || '';
      form.providerName.value = appt.providerName || '';
      form.providerAddress.value = appt.providerAddress || '';
      form.providerPhone.value = appt.providerPhone || '';
      form.icdCodes.value = appt.icdCodes || '';
      form.cptCodes.value = appt.cptCodes || '';
      form.insuranceType.value = appt.insuranceType || '';
      form.reason.value = appt.reason || '';
      form.notes.value = appt.notes || '';
      editingId = id;
      form.scrollIntoView({behavior: 'smooth'});
    } else if (e.target.closest('.btn-delete')) {
      const id = e.target.closest('.btn-delete').dataset.id;
      if (confirm('Are you sure you want to delete this appointment?')) {
        try {
          const res = await fetch(`/appointments/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Delete failed');
          allAppointments = allAppointments.filter(a => a.id !== id);
          displayAppointments(allAppointments);
        } catch (err) {
          alert('Error deleting appointment');
          console.error(err);
        }
      }
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const apptData = Object.fromEntries(formData.entries());
    if (editingId) {
      // Update
      try {
        const res = await fetch(`/appointments/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apptData)
        });
        if (!res.ok) throw new Error('Update failed');
        const updated = await res.json();
        const idx = allAppointments.findIndex(a => a.id === editingId);
        if (idx > -1) allAppointments[idx] = updated;
        displayAppointments(allAppointments);
        editingId = null;
        form.reset();
      } catch (err) {
        alert('Error updating appointment');
        console.error(err);
      }
    } else {
      // Create
      try {
        const res = await fetch('/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apptData)
        });
        if (!res.ok) throw new Error('Create failed');
        const created = await res.json();
        allAppointments.push(created);
        displayAppointments(allAppointments);
        form.reset();
      } catch (err) {
        alert('Error adding appointment');
        console.error(err);
      }
    }
  });

  loadAppointments();
});
