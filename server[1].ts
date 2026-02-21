import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("arogya.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS medicines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    dosage TEXT,
    frequency TEXT,
    time TEXT,
    total_tablets INTEGER,
    remaining_tablets INTEGER,
    start_date TEXT,
    reminder_sound TEXT DEFAULT 'gentle-chime'
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doctor_name TEXT,
    hospital_name TEXT,
    appointment_date TEXT,
    appointment_time TEXT,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'unpaid'
  );

  CREATE TABLE IF NOT EXISTS prescriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doctor_name TEXT,
    date TEXT,
    image_url TEXT,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    specialty TEXT,
    hospital TEXT,
    timings TEXT,
    fee INTEGER
  );
`);

// Seed some data if empty
const doctorCount = db.prepare("SELECT COUNT(*) as count FROM doctors").get() as { count: number };
if (doctorCount.count === 0) {
  const insertDoctor = db.prepare("INSERT INTO doctors (name, specialty, hospital, timings, fee) VALUES (?, ?, ?, ?, ?)");
  insertDoctor.run("Dr. Sarah Smith", "Cardiologist", "City Heart Hospital", "10:00 AM - 02:00 PM", 500);
  insertDoctor.run("Dr. James Wilson", "Dermatologist", "Skin Care Clinic", "04:00 PM - 08:00 PM", 400);
  insertDoctor.run("Dr. Priya Sharma", "General Physician", "Apollo Health City", "09:00 AM - 05:00 PM", 300);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/medicines", (req, res) => {
    const medicines = db.prepare("SELECT * FROM medicines").all();
    res.json(medicines);
  });

  app.post("/api/medicines", (req, res) => {
    const { name, dosage, frequency, time, total_tablets, reminder_sound } = req.body;
    const info = db.prepare("INSERT INTO medicines (name, dosage, frequency, time, total_tablets, remaining_tablets, start_date, reminder_sound) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .run(name, dosage, frequency, time, total_tablets, total_tablets, new Date().toISOString(), reminder_sound || 'gentle-chime');
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/medicines/:id", (req, res) => {
    db.prepare("DELETE FROM medicines WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/medicines/:id/take", (req, res) => {
    db.prepare("UPDATE medicines SET remaining_tablets = MAX(0, remaining_tablets - 1) WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/doctors", (req, res) => {
    const doctors = db.prepare("SELECT * FROM doctors").all();
    res.json(doctors);
  });

  app.get("/api/appointments", (req, res) => {
    const appointments = db.prepare("SELECT * FROM appointments").all();
    res.json(appointments);
  });

  app.post("/api/appointments", (req, res) => {
    const { doctor_name, hospital_name, appointment_date, appointment_time, fee } = req.body;
    const info = db.prepare("INSERT INTO appointments (doctor_name, hospital_name, appointment_date, appointment_time, payment_status) VALUES (?, ?, ?, ?, 'paid')")
      .run(doctor_name, hospital_name, appointment_date, appointment_time);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/prescriptions", (req, res) => {
    const prescriptions = db.prepare("SELECT * FROM prescriptions").all();
    res.json(prescriptions);
  });

  app.post("/api/prescriptions", (req, res) => {
    const { doctor_name, date, image_url, notes } = req.body;
    const info = db.prepare("INSERT INTO prescriptions (doctor_name, date, image_url, notes) VALUES (?, ?, ?, ?)")
      .run(doctor_name, date, image_url, notes);
    res.json({ id: info.lastInsertRowid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
