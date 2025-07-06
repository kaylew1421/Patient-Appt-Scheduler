const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'appointments.json');

const providers = [
  { name: 'Dr. Smith', address: '123 Clinic St', phone: '5551234567' },
  { name: 'Dr. Lee', address: '456 Health Rd', phone: '5559876543' },
  { name: 'Dr. Patel', address: '789 Wellness Ave', phone: '5555551212' },
  { name: 'Dr. Adams', address: '321 Care Way', phone: '5556667777' },
  { name: 'Dr. Brown', address: '654 Health Ave', phone: '5558889999' }
];

const insuranceTypes = ['Medicare', 'Private', 'Medicaid', 'Self-pay'];
const reasons = ['Checkup', 'Follow-up', 'Lab Work', 'Consultation', 'Procedure'];
const icd10Samples = ['E11.9', 'I10', 'J45.909', 'M54.5', 'K21.9'];
const cptSamples = ['99213', '93000', '36415', '85025', '80053'];

function randomDate(start, end) {
  const date = new Date(+start + Math.random() * (end - start));
  return date.toISOString().split('T')[0];
}

function randomTime() {
  const hour = 8 + Math.floor(Math.random() * 9); // 8 AM - 4 PM
  const min = Math.random() < 0.5 ? '00' : '30';
  return `${String(hour).padStart(2, '0')}:${min}`;
}

function randomPhone() {
  return '555' + Math.floor(1000000 + Math.random() * 9000000);
}

function randomPatientId() {
  return 'P' + Math.floor(10000 + Math.random() * 90000);
}

const firstNames = ['John', 'Jane', 'Sam', 'Lisa', 'Tom', 'Sara', 'Mike', 'Anna', 'Bob', 'Kate'];
const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Wilson', 'Taylor', 'Anderson', 'Thomas'];

const appointments = [];

for (let i = 0; i < 100; i++) {
  const patientName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  const patientId = randomPatientId();
  const dob = randomDate(new Date(1940, 0, 1), new Date(2010, 0, 1));
  const homeAddress = `${Math.floor(Math.random() * 999)} Main St`;
  const phone = randomPhone();

  const dos = randomDate(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 3)));
  const dosTime = randomTime();

  const provider = providers[Math.floor(Math.random() * providers.length)];

  const icdCodes = icd10Samples[Math.floor(Math.random() * icd10Samples.length)];
  const cptCodes = cptSamples[Math.floor(Math.random() * cptSamples.length)];
  const insuranceType = insuranceTypes[Math.floor(Math.random() * insuranceTypes.length)];
  const reason = reasons[Math.floor(Math.random() * reasons.length)];

  const appointment = {
    id: Date.now() + i,
    patientName,
    patientId,
    dob,
    homeAddress,
    phone,
    dos,
    dosTime,
    providerName: provider.name,
    providerAddress: provider.address,
    providerPhone: provider.phone,
    icdCodes,
    cptCodes,
    insuranceType,
    reason,
    notes: ''
  };

  appointments.push(appointment);
}

fs.writeFileSync(DATA_FILE, JSON.stringify(appointments, null, 2));
console.log(`✅ Generated ${appointments.length} mock appointments with patient IDs into ${DATA_FILE}`);
