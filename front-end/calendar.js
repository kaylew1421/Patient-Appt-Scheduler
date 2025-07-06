document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const detailsEl = document.getElementById('details');

  // Fetch appointments from backend
  fetch('/appointments')
    .then(res => res.json())
    .then(data => {
      const events = data.map(appt => {
        return {
          id: appt.id,
          title: `${appt.patientName} - ${appt.reason}`,
          start: `${appt.dos}T${appt.dosTime}`,
          extendedProps: appt // store full appointment object here
        };
      });

      // Init FullCalendar
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: events,
        eventClick: function (info) {
          const appt = info.event.extendedProps;

          // Populate details div
          detailsEl.innerHTML = `
            <h3>Appointment Details</h3>
            <p><strong>Patient:</strong> ${appt.patientName}</p>
            <p><strong>DOB:</strong> ${appt.dob}</p>
            <p><strong>Phone:</strong> ${appt.phone}</p>
            <p><strong>Home Address:</strong> ${appt.homeAddress}</p>
            <p><strong>Provider:</strong> ${appt.providerName}</p>
            <p><strong>Provider Phone:</strong> ${appt.providerPhone}</p>
            <p><strong>Provider Address:</strong> ${appt.providerAddress}</p>
            <p><strong>Date & Time:</strong> ${appt.dos} ${appt.dosTime}</p>
            <p><strong>ICD-10:</strong> ${appt.icdCodes}</p>
            <p><strong>CPT:</strong> ${appt.cptCodes}</p>
            <p><strong>Insurance:</strong> ${appt.insuranceType}</p>
            <p><strong>Reason:</strong> ${appt.reason}</p>
            <p><strong>Notes:</strong> ${appt.notes}</p>
          `;
          detailsEl.style.display = 'block';
        }
      });

      calendar.render();
    })
    .catch(err => {
      console.error('Error fetching appointments:', err);
      calendarEl.innerHTML = `<p style="color:red;">Failed to load appointments.</p>`;
    });
});
