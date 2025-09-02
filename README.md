## Patient Appointment Scheduler (React)

A lightweight, two-page appointments app for small clinics. 

Page 1: Intake form → searchable table → CSV export. 

Page 2: Calendar with event details, edit, and delete.

Live demo:(https://patient-appt-scheduler-1.onrender.com)

## ✨ Features
-Modern, clean UI (light theme) with a tinted left resources panel (911, Poison Control, CDC/NIH/WHO, etc.)

#### Appointment Management

-Full intake form (patient + visit + provider + insurance + codes + notes)

-Validation for required fields

-Save / Edit / Delete

-Search (name, ID, provider, dates, reason)

-CSV export of all appointments

#### Mock staff roster

-Staff selector auto-fills Provider Name / Address / Phone

-Staff card shows avatar, specialty, contact, weekly hours

#### Calendar view (/calendar.html)

-Month/Week/Day/List views (FullCalendar)

-Click an event → detail modal (Edit / Delete / Close)

#### Persistence via localStorage (shared by both pages)

#### Demo data seeding (with randomized provider) + Clear All button

## 🧩 Tech Stack
-React 18 + Vite

-FullCalendar (global build)

-Plain CSS (no Tailwind required)

## 📦 Dependencies

-react, react-dom

-Dev/build: vite

-Calendar: fullcalendar (loaded from CDN in public/calendar.html)

## 📁 Project Structure

front-end/

public/

calendar.html        # Calendar page (loads /calendar.js, has its own <style>)

calendar.js          # Calendar logic: reads localStorage + modal handlers

favicon.svg
src/

App.jsx              # Appointments form/table + staff panel + CSV export

main.jsx             # React entry; imports ./index.css

index.css            # Global styles & variables (matches calendar type scale)
index.html # Vite entry for the main page

package.json

vite.config.js

README.md

## 🚀 Getting Started
#### Requirements: Node.js 18+ recommended.

#### from front-end/:

npm install
npm run dev
Open http://localhost:5173.
The Calendar lives at http://localhost:5173/calendar.html.

## 🏗️ Build & Deploy
-This is a static build—works great on Netlify / Vercel / GitHub Pages.

-Build command: npm run build

-Publish directory: dist

-Ensure /calendar.html is accessible directly (don’t force SPA rewrites to /index.html for all routes).

-If you deploy under a subpath, update the calendar link to use the base:

-// Example in App.jsx

<a className="btn btn-ghost" href={`${import.meta.env.BASE_URL}calendar.html`}>📅 Calendar</a>

## 💾 Data & Persistence
-Appointments are stored in the browser via localStorage.

-Keys:

pas:rows:v1 – array of appointments

pas:seeded – flag to insert demo data on first load

#### To reset data: use Clear All in the UI, or remove those keys in DevTools → Application → Local Storage.

## Appointment model:

type Appointment = {

id: string;

patientName: string;

patientId: string;

dob: string; // YYYY-MM-DD

homeAddress?: string;

phone: string;

dateOfService: string; // YYYY-MM-DD

timeOfService: string; // HH:mm

providerName: string;

providerAddress?: string;

providerPhone: string;

icd10?: string; // comma-separated

cpt?: string; // comma-separated

insurance: 'Private' | 'Medicare' | 'Medicaid' | 'Self-pay';

reason: string;

notes?: string;

createdAt: string; // ISO

updatedAt: string; // ISO

};

## 🧪 How to Use (Quick Tour)
-Assign Staff (top-left of the form) to prefill provider fields.

-Fill out patient + visit details → click Save Appointment.

-Find items with the Search box.

-Click Export CSV to download all rows.

-Go to Calendar → open an event → Edit / Delete in the modal.

## 🧭 Accessibility & UX
-Semantic labels for all inputs.

-Consistent type scale across both pages.

-Focus outlines and clear hover/border states on inputs and buttons.

## 🙌 Acknowledgements
-FullCalendar for the calendar UX

-Inspiration: streamline real clinic workflows with simple, transparent UI

## Notes for Reviewers
-App intentionally uses localStorage for demo simplicity (no backend).

-If you want to try with fresh data, click Clear All first.
