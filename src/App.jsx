import React, { useEffect, useMemo, useState } from "react";

/** ---------- Utilities ---------- */
const uid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID?.()) ||
  Math.random().toString(36).slice(2);

const EMPTY = {
  id: null,
  patientName: "",
  patientId: "",
  dob: "",
  homeAddress: "",
  phone: "",
  dateOfService: "",
  timeOfService: "",
  providerName: "",
  providerAddress: "",
  providerPhone: "",
  icd10: "",
  cpt: "",
  insurance: "",
  reason: "",
  notes: "",
  createdAt: "",
  updatedAt: "",
};

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

function parseDT(date, time) {
  const dt = new Date(`${date}T${time || "00:00"}`);
  return isNaN(dt) ? new Date(8640000000000000) : dt;
}
function isSoon(date, time) {
  const d = parseDT(date, time).getTime();
  const now = Date.now();
  return d >= now && d - now <= 1000 * 60 * 60 * 48;
}

/** ---------- Schedules ---------- */
const SCHED_9_5 = [
  { day: "Monday", start: "09:00 AM", end: "05:00 PM" },
  { day: "Tuesday", start: "09:00 AM", end: "05:00 PM" },
  { day: "Wednesday", start: "09:00 AM", end: "05:00 PM" },
  { day: "Thursday", start: "09:00 AM", end: "05:00 PM" },
  { day: "Friday", start: "09:00 AM", end: "05:00 PM" },
];
const SCHED_10_6 = [
  { day: "Monday", start: "10:00 AM", end: "06:00 PM" },
  { day: "Tuesday", start: "10:00 AM", end: "06:00 PM" },
  { day: "Wednesday", start: "10:00 AM", end: "06:00 PM" },
  { day: "Thursday", start: "10:00 AM", end: "06:00 PM" },
  { day: "Friday", start: "10:00 AM", end: "06:00 PM" },
];

/** ---------- Mock Staff Roster ---------- */
const STAFF = [
  {
    id: "carter",
    name: "Dr. Emily Carter",
    specialty: "Internal Medicine",
    email: "e.carter@clinic.example",
    phone: "555-201-1212",
    address: "1500 Clinic Way, Austin, TX",
    schedule: SCHED_9_5,
  },
  {
    id: "wu",
    name: "Dr. Daniel Wu",
    specialty: "Cardiology",
    email: "d.wu@clinic.example",
    phone: "555-303-4545",
    address: "1500 Clinic Way, Austin, TX",
    schedule: SCHED_10_6,
  },
  {
    id: "patel",
    name: "Dr. Priya Patel",
    specialty: "Family Medicine",
    email: "p.patel@clinic.example",
    phone: "555-707-2244",
    address: "1500 Clinic Way, Austin, TX",
    schedule: SCHED_9_5,
  },
  {
    id: "smith",
    name: "Jordan Smith, NP",
    specialty: "Primary Care",
    email: "j.smith@clinic.example",
    phone: "555-889-3300",
    address: "1500 Clinic Way, Austin, TX",
    schedule: SCHED_10_6,
  },
];

const staffById = (id) => STAFF.find((s) => s.id === id);
const staffByName = (name) => STAFF.find((s) => s.name === name);

/** ---------- Small labeled input wrapper ---------- */
function L({ label, children, error }) {
  return (
    <div>
      <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>
        {label}
      </label>
      {React.cloneElement(children, {
        style: {
          width: "100%",
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #cfcfcf",
          ...(children.props.style || {}),
        },
      })}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}

function Avatar({ name }) {
  const initials = (name || "Staff")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return <div className="avatar">{initials}</div>;
}

function InsuranceBadge({ value }) {
  const v = (value || "").toLowerCase();
  const cls =
    v === "private"
      ? "badge private"
      : v === "medicare"
      ? "badge medicare"
      : v === "medicaid"
      ? "badge medicaid"
      : "badge selfpay";
  const dotColor =
    v === "private"
      ? "#2e7d32"
      : v === "medicare"
      ? "#4338ca"
      : v === "medicaid"
      ? "#b45309"
      : "#be123c";
  return (
    <span className={cls}>
      <span className="dot" style={{ background: dotColor }} />
      {value || "—"}
    </span>
  );
}

/** ---------- Demo dataset (now uses random staff) ---------- */
function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function makeDemo(now = new Date()) {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const today = String(now.getDate()).padStart(2, "0");

  const mk = (overrides) => {
    const s = rand(STAFF);
    return {
      id: uid(),
      patientName: "John Doe",
      patientId: "P-1001",
      dob: "1985-04-15",
      homeAddress: "123 Main St, Austin, TX",
      phone: "555-123-4567",
      dateOfService: `${yyyy}-${mm}-${today}`,
      timeOfService: "09:00",
      providerName: s.name,
      providerAddress: s.address,
      providerPhone: s.phone,
      icd10: "Z00.00",
      cpt: "99385",
      insurance: "Private",
      reason: "Annual checkup",
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  };

  return [
    mk({ patientName: "John Doe", patientId: "P-1001", timeOfService: "09:00", reason: "Annual checkup" }),
    mk({ patientName: "Maria Lopez", patientId: "P-1002", timeOfService: "14:30", insurance: "Medicaid", reason: "Follow-up visit", icd10: "R51", cpt: "99213" }),
    mk({ patientName: "Robert King", patientId: "P-1003", timeOfService: "10:15", insurance: "Medicare", reason: "Hypertension review", icd10: "I10", cpt: "99214" }),
  ];
}

/** ---------- App ---------- */
export default function App() {
  const [rows, setRows] = useLocalStorage("pas:rows:v1", []);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [q, setQ] = useState("");

  // selected staff (default to first in roster)
  const [staffId, setStaffId] = useState(STAFF[0].id);

  // seed demo rows once
  useEffect(() => {
    const seeded = localStorage.getItem("pas:seeded");
    if (!seeded) {
      const demo = makeDemo();
      setRows(demo);
      localStorage.setItem("pas:seeded", "1");
    }
  }, [setRows]);

  // When staff selection changes, prefill provider fields in the form
  useEffect(() => {
    const s = staffById(staffId);
    if (!s) return;
    setForm((f) => ({
      ...f,
      providerName: s.name,
      providerAddress: s.address,
      providerPhone: s.phone,
    }));
  }, [staffId]);

  // If user loads an existing row for editing, try to sync staff selector
  useEffect(() => {
    if (editingId && form.providerName) {
      const matched = staffByName(form.providerName);
      if (matched) setStaffId(matched.id);
    }
  }, [editingId, form.providerName]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = rows.filter((r) => {
      if (!query) return true;
      return (
        r.patientName.toLowerCase().includes(query) ||
        r.patientId.toLowerCase().includes(query) ||
        (r.dob || "").includes(query) ||
        (r.dateOfService || "").includes(query) ||
        r.reason.toLowerCase().includes(query) ||
        r.providerName.toLowerCase().includes(query)
      );
    });
    return list.sort(
      (a, b) =>
        parseDT(a.dateOfService, a.timeOfService) -
        parseDT(b.dateOfService, b.timeOfService)
    );
  }, [rows, q]);

  function validate(f) {
    const e = {};
    if (!f.patientName) e.patientName = "Patient Name is required";
    if (!f.patientId) e.patientId = "Patient ID is required";
    if (!f.dob) e.dob = "DOB is required";
    if (!f.phone) e.phone = "Phone Number is required";
    if (!f.dateOfService) e.dateOfService = "Date of Service is required";
    if (!f.timeOfService) e.timeOfService = "Time of Service is required";
    if (!f.providerName) e.providerName = "Provider Name is required";
    if (!f.providerPhone) e.providerPhone = "Provider Phone Number is required";
    if (!f.insurance) e.insurance = "Insurance Type is required";
    if (!f.reason) e.reason = "Reason for Appointment is required";
    return e;
  }

  function reset() {
    setForm(EMPTY);
    setEditingId(null);
  }

  function onSubmit(e) {
    e.preventDefault();
    const f = { ...form };
    const errs = validate(f);
    if (Object.keys(errs).length) {
      alert(Object.values(errs).join("\n"));
      return;
    }
    if (editingId) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingId ? { ...r, ...f, updatedAt: new Date().toISOString() } : r
        )
      );
    } else {
      setRows((prev) => [
        ...prev,
        { id: uid(), ...f, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ]);
    }
    reset();
    // Keep staff selection; user can keep adding with same staff
  }

  function onEdit(r) {
    setEditingId(r.id);
    setForm({ ...r });
    const matched = staffByName(r.providerName);
    if (matched) setStaffId(matched.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onDelete(id) {
    if (!confirm("Delete this appointment?")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) reset();
  }

  function exportCSV() {
    const headers = [
      "Patient Name","Patient ID","DOB","Home Address","Phone",
      "Date of Service","Time","Provider","Provider Address","Provider Phone",
      "ICD-10","CPT","Insurance","Reason","Notes","Created At","Updated At",
    ];
    const lines = rows.map((r) =>
      [
        r.patientName,r.patientId,r.dob,r.homeAddress,r.phone,
        r.dateOfService,r.timeOfService,r.providerName,r.providerAddress,r.providerPhone,
        r.icd10,r.cpt,r.insurance,r.reason,(r.notes || "").replaceAll("\n", " "),r.createdAt,r.updatedAt,
      ].map((v) => `"${(v ?? "").toString().replaceAll('"', '""')}"`).join(",")
    );
    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "appointments.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  function addDemo() {
    const demo = makeDemo();
    setRows((prev) => [...prev, ...demo]);
  }
  function clearAll() {
    if (!confirm("Clear all saved appointments?")) return;
    setRows([]); localStorage.removeItem("pas:seeded"); reset();
  }

  const todayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
  const selectedStaff = staffById(staffId);

  return (
    <div className="container">
      {/* Top bar (matches calendar heading) */}
      <div className="headerbar">
        <div className="app-title">Appointment Management</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="btn btn-ghost" href="/calendar.html">📅 Calendar</a>
          <button className="btn btn-ghost" onClick={addDemo}>➕ Add Demo Data</button>
          <button className="btn btn-ghost" onClick={clearAll}>🧹 Clear All</button>
        </div>
      </div>

      <div className="grid-main">
        {/* Left resources column */}
        <div className="left-col">
          <div className="left-inner">
            <h2>Healthcare Resources</h2>
            <blockquote>
              “The good physician treats the disease; the great physician treats
              the patient who has the disease.” — William Osler
            </blockquote>

            <h3>Emergency Numbers</h3>
            <ul style={{ lineHeight: 1.6 }}>
              <li>Fire: 911</li>
              <li>Poison Control: 1-800-222-1222</li>
              <li>Emergency Medical Services: 911</li>
              <li>National Suicide Prevention: 988</li>
            </ul>

            <h3>Helpful Websites</h3>
            <ul style={{ lineHeight: 1.6 }}>
              <li><a href="https://www.cdc.gov" target="_blank" rel="noreferrer">CDC</a></li>
              <li><a href="https://www.nih.gov" target="_blank" rel="noreferrer">NIH</a></li>
              <li><a href="https://www.who.int" target="_blank" rel="noreferrer">WHO</a></li>
              <li><a href="https://medlineplus.gov" target="_blank" rel="noreferrer">MedlinePlus</a></li>
              <li><a href="https://www.healthcare.gov" target="_blank" rel="noreferrer">Healthcare.gov</a></li>
            </ul>
          </div>
        </div>

        {/* Main content */}
        <main>
          {/* Booking section */}
          <section className="panel shadow-sm booking" style={{ padding: 16 }}>
            <div className="section-title">Appointment Booking</div>

            <div className="booking-grid">
              {/* Customer / Appointment details */}
              <div>
                <div className="subhead">Customer Details</div>

                <form onSubmit={onSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                    {/* Assign Staff (NEW) */}
                    <L label="Assign Staff">
                      <select
                        value={staffId}
                        onChange={(e) => setStaffId(e.target.value)}
                      >
                        {STAFF.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} — {s.specialty}
                          </option>
                        ))}
                      </select>
                    </L>
                    <div /> <div /> <div />

                    <L label="Patient Name*">
                      <input
                        value={form.patientName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, patientName: e.target.value }))
                        }
                      />
                    </L>
                    <L label="Patient ID*">
                      <input
                        value={form.patientId}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, patientId: e.target.value }))
                        }
                      />
                    </L>
                    <L label="Date of Birth*">
                      <input
                        type="date"
                        value={form.dob}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, dob: e.target.value }))
                        }
                      />
                    </L>
                    <L label="Home Address">
                      <input
                        value={form.homeAddress}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, homeAddress: e.target.value }))
                        }
                      />
                    </L>

                    <L label="Phone Number*">
                      <input
                        value={form.phone}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                      />
                    </L>
                    <L label="Date of Service*">
                      <input
                        type="date"
                        value={form.dateOfService}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, dateOfService: e.target.value }))
                        }
                      />
                    </L>
                    <L label="Time of Service*">
                      <input
                        type="time"
                        value={form.timeOfService}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, timeOfService: e.target.value }))
                        }
                      />
                    </L>

                    {/* Provider fields (auto-filled by Assign Staff, editable) */}
                    <L label="Provider Name*">
                      <input
                        value={form.providerName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, providerName: e.target.value }))
                        }
                      />
                    </L>
                    <L label="Provider Address">
                      <input
                        value={form.providerAddress}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, providerAddress: e.target.value }))
                        }
                      />
                    </L>
                    <L label="Provider Phone Number*">
                      <input
                        value={form.providerPhone}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, providerPhone: e.target.value }))
                        }
                      />
                    </L>

                    <L label="Insurance Type*">
                      <select
                        value={form.insurance}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, insurance: e.target.value }))
                        }
                      >
                        <option value=""> -- Select Insurance -- </option>
                        <option>Private</option><option>Medicare</option><option>Medicaid</option><option>Self-pay</option>
                      </select>
                    </L>

                    <L label="ICD-10 Codes (comma separated)">
                      <input
                        value={form.icd10}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, icd10: e.target.value }))
                        }
                      />
                    </L>
                    <L label="CPT Codes (comma separated)">
                      <input
                        value={form.cpt}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, cpt: e.target.value }))
                        }
                      />
                    </L>
                    <L label="Reason for Appointment*">
                      <input
                        value={form.reason}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, reason: e.target.value }))
                        }
                      />
                    </L>
                    <div />

                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", marginBottom: 4 }}>Notes</label>
                      <textarea
                        rows={3}
                        value={form.notes}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, notes: e.target.value }))
                        }
                        style={{
                          width: "100%",
                          padding: 8,
                          borderRadius: 8,
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button type="submit" className="btn btn-primary">
                      {editingId ? "Save Appointment" : "Save Appointment"}
                    </button>
                    <button type="button" onClick={reset} className="btn btn-ghost">Cancel</button>
                  </div>
                </form>
              </div>

              {/* Staff Details card (driven by selected staff) */}
              <aside className="staff-card">
                <div className="staff-top">
                  <Avatar name={selectedStaff?.name} />
                  <div>
                    <div className="staff-name">{selectedStaff?.name}</div>
                    <div className="staff-specialty">{selectedStaff?.specialty}</div>
                    <div className="staff-meta">
                      <span>✉️ {selectedStaff?.email}</span>
                      <span>📞 {selectedStaff?.phone}</span>
                    </div>
                    <div className="staff-meta">
                      <span>🏥 {selectedStaff?.address}</span>
                    </div>
                  </div>
                </div>

                <div className="schedule">
                  {(selectedStaff?.schedule || SCHED_9_5).map((s) => (
                    <div key={s.day} className={`row ${todayName === s.day ? "today" : ""}`}>
                      <div className="day">{s.day}</div>
                      <div className="time">{s.start}</div>
                      <div className="to">to</div>
                      <div className="time">{s.end}</div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </section>

          {/* Patient Appointments + Export */}
          <div style={{ marginTop: 16 }}>
            <div className="list-header">
              <h2 style={{ margin: 0 }}>Patient Appointments</h2>
              <button className="btn btn-primary" onClick={exportCSV}>⬇ Export CSV</button>
            </div>

            {/* Search below header */}
            <div style={{ marginBottom: 8 }}>
              <input
                placeholder="Search by name, ID, provider, or date…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #cfcfcf" }}
              />
            </div>

            <div className="panel shadow-sm" style={{ overflow: "hidden" }}>
              <table>
                <thead>
                  <tr>
                    {[
                      "Patient Name","Patient ID","DOB","Phone","Date of Service","Time","Provider","Insurance","Reason","Actions",
                    ].map((h) => (<th key={h}>{h}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={10} style={{ padding: 16, textAlign: "center", opacity: 0.7 }}>No appointments found.</td></tr>
                  )}
                  {filtered.map((r) => (
                    <tr key={r.id} className={isSoon(r.dateOfService, r.timeOfService) ? "soon" : ""}>
                      <td>{r.patientName}</td><td>{r.patientId}</td><td>{r.dob}</td><td>{r.phone}</td>
                      <td>{r.dateOfService}</td><td>{r.timeOfService}</td><td>{r.providerName}</td>
                      <td><InsuranceBadge value={r.insurance} /></td><td>{r.reason}</td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 8 }}>
                          <button className="button-inline" onClick={() => onEdit(r)}>✏️ Edit</button>
                          <button className="button-inline" onClick={() => onDelete(r.id)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
