// Calendar <-> localStorage bridge
const LS_KEY = 'pas:rows:v1';

// event colors 
const colorMap = {
  Private:  '#2e7d32',  // success-700
  Medicare: '#4338ca',  // indigo-700
  Medicaid: '#b45309',  // amber-700
  'Self-pay': '#be123c' // rose-700
};

function getRows(){
  try { const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}
function setRows(rows){
  try { localStorage.setItem(LS_KEY, JSON.stringify(rows)); } catch {}
}

// Convert rows -> FullCalendar events
function rowsToEvents(rows){
  return rows.map(r=>{
    const hasTime = r.timeOfService && r.timeOfService.length >= 4;
    const start = hasTime ? `${r.dateOfService}T${r.timeOfService}` : r.dateOfService;
    const titleParts = [r.patientName || 'Appointment'];
    if (r.reason) titleParts.push(`– ${r.reason}`);
    else if (r.providerName) titleParts.push(`– ${r.providerName}`);

    const color = colorMap[r.insurance];

    return {
      id: r.id,
      title: titleParts.join(' '),
      start,
      allDay: !hasTime,
      backgroundColor: color,
      borderColor: color,
      extendedProps: r
    };
  });
}

// Modal helpers
const $ = (id) => document.getElementById(id);

function fillModal(r){
  $('m-patientName').value = r.patientName || '';
  $('m-patientId').value   = r.patientId || '';
  $('m-dob').value         = r.dob || '';
  $('m-phone').value       = r.phone || '';
  $('m-dos').value         = r.dateOfService || '';
  $('m-tos').value         = r.timeOfService || '';
  $('m-providerName').value= r.providerName || '';
  $('m-insurance').value   = r.insurance || 'Private';
  $('m-icd10').value       = r.icd10 || '';
  $('m-cpt').value         = r.cpt || '';
  $('m-reason').value      = r.reason || '';
  $('m-notes').value       = r.notes || '';
  $('m-title').textContent = r.patientName ? `Appointment: ${r.patientName}` : 'Appointment Details';
  $('backdrop').dataset.currentId = r.id || '';
}

function setDisabled(disabled){
  ['m-patientName','m-patientId','m-dob','m-phone','m-dos','m-tos',
   'm-providerName','m-insurance','m-icd10','m-cpt','m-reason','m-notes']
  .forEach(id => { const el = $(id); if (el) el.disabled = disabled; });
}

function openModal(r){
  fillModal(r);
  setDisabled(true);
  $('m-edit').style.display = 'inline-block';
  $('m-save').style.display = 'none';
  $('m-cancel').style.display = 'none';
  $('backdrop').style.display = 'flex';
}

function closeModal(){
  $('backdrop').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', ()=>{
  let rows = getRows();

  // FullCalendar
  const el = document.getElementById('calendar');
  const cal = new FullCalendar.Calendar(el, {
    initialView: 'dayGridMonth',
    headerToolbar: { left:'prev,next today', center:'title', right:'dayGridMonth,timeGridWeek,timeGridDay,listWeek' },
    nowIndicator: true,
    navLinks: true,
    events: rowsToEvents(rows),
    eventClick(info){
      openModal(info.event.extendedProps || {});
    }
  });
  cal.render();

  // Modal wiring
  const btnEdit = $('m-edit'), btnSave=$('m-save'), btnCancel=$('m-cancel'),
        btnDelete=$('m-delete'), btnClose=$('m-close');

  btnEdit.onclick = ()=>{
    setDisabled(false);
    btnEdit.style.display='none'; btnSave.style.display='inline-block'; btnCancel.style.display='inline-block';
  };

  btnCancel.onclick = ()=>{
    const id = $('backdrop').dataset.currentId;
    const rec = getRows().find(x=>x.id===id);
    if (rec) fillModal(rec);
    setDisabled(true);
    btnEdit.style.display='inline-block'; btnSave.style.display='none'; btnCancel.style.display='none';
  };

  btnSave.onclick = ()=>{
    const id = $('backdrop').dataset.currentId;
    rows = getRows();
    const idx = rows.findIndex(x=>x.id===id);
    if (idx > -1){
      rows[idx] = {
        ...rows[idx],
        patientName: $('m-patientName').value,
        patientId: $('m-patientId').value,
        dob: $('m-dob').value,
        phone: $('m-phone').value,
        dateOfService: $('m-dos').value,
        timeOfService: $('m-tos').value,
        providerName: $('m-providerName').value,
        insurance: $('m-insurance').value,
        icd10: $('m-icd10').value,
        cpt: $('m-cpt').value,
        reason: $('m-reason').value,
        notes: $('m-notes').value,
        updatedAt: new Date().toISOString(),
      };
      setRows(rows);
      cal.removeAllEvents();
      cal.addEventSource(rowsToEvents(rows));
      setDisabled(true);
      btnEdit.style.display='inline-block'; btnSave.style.display='none'; btnCancel.style.display='none';
    }
  };

  btnDelete.onclick = ()=>{
    if (!confirm('Delete this appointment?')) return;
    const id = $('backdrop').dataset.currentId;
    rows = getRows().filter(x=>x.id!==id);
    setRows(rows);
    cal.removeAllEvents();
    cal.addEventSource(rowsToEvents(rows));
    closeModal();
  };

  btnClose.onclick = closeModal;
});
