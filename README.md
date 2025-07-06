# Appointment Scheduler & Calendar Application

![App Demo] (https://kaylew1421.github.io/Patient-Appt-Scheduler/)

---

## Overview

This web application provides a full-featured **Patient Appointment Scheduler** integrated with a **Visual Calendar** using FullCalendar. It allows users to:

- Add, edit, delete, and search patient appointments.
- View appointments in a calendar interface.
- See detailed appointment info with edit/delete options.
- Export appointments to CSV.
- Utilize a professional, user-friendly UI enhanced with colors, emojis, and resource sidebar.

This app is built with **Node.js**, **Express**, and vanilla **JavaScript**.

---

## Features

- **Patient Appointment Form** with fields including Patient ID, Name, DOB, Phone, Provider Info, ICD-10/CPT Codes, Insurance Type, and Notes.
- **Dynamic Appointment List** with live search, edit, and delete functionality.
- **Interactive Calendar** showing all appointments color-coded by insurance type.
- **Appointment Detail Popup** with editable form and deletion option.
- **Export to CSV** for appointment records.
- **Sidebar with Healthcare Quotes and Emergency Resources** for enhanced UX.
- Responsive and visually appealing design with emojis and color accents.

---

### Installation

## Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)  
- npm (comes bundled with Node.js)

## Setup

1. Clone the repo:  
   ```bash
   git clone https://github.com/yourusername/appointment-calendar.git
   cd appointment-calendar
   
## Usage
- Use the Appointment Scheduler form to create new appointments.

- View, search, edit, or delete appointments in the table below the form.

- Click View Calendar link to see appointments displayed in a monthly calendar.

- Click on a calendar event to see details, edit, or delete.

- Export the appointment list as CSV using the button provided.

- Use the sidebar for healthcare quotes and emergency resources.

## File Structure
bash
Copy
Edit
├── appointments.json      # Data storage for appointments
├── calendar.html          # Calendar page with FullCalendar integration
├── index.html             # Main appointment scheduler page
├── script.js              # JS for index.html (form & appointments)
├── calendar.js            # JS for calendar.html (calendar & popup)
├── server.js              # Express backend server with REST API
├── styles.css             # Shared styling and UI layout
├── generateMockData.js    # Script to generate mock appointments data
├── README.md              # Project documentation (this file)

---

## Technologies Used
- Node.js & Express for backend API and data persistence

- Vanilla JavaScript for frontend logic

- FullCalendar for calendar visualization

- HTML5 & CSS3 for markup and styling

## Future Improvements
- Add user authentication and role-based access control.

- Switch data storage from JSON file to a real database (e.g., MongoDB, PostgreSQL).

- Implement email and SMS notifications for upcoming appointments.

- Add advanced filtering, sorting, and analytics dashboards.

- Enhance UI for full mobile responsiveness and accessibility.

- Integrate with third-party healthcare APIs and EHR systems.

---

### Resources
## Healthcare Quote:

"The good physician treats the disease; the great physician treats the patient who has the disease." – William Osler

## Emergency Numbers:

911 – Emergency Services

Poison Control: 1-800-222-1222

National Suicide Prevention Lifeline: 988

CDC Website: https://www.cdc.gov

---

### License
This project is licensed under the MIT License - see the LICENSE file for details.

### Contact
Developed by Kayla Lewis
Email: kaylew1421@outlook.com
GitHub: https://github.com/kaylew1421
