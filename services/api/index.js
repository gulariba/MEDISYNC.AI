/**
 * Service layer — real backend API calls with adapter transformations.
 * Replaces the old mock-based services/api/index.js.
 * Every function returns data in the shape the existing frontend pages expect.
 */
import { apiFetch } from '@/lib/api/client';
import {
  adaptAppointment, adaptReport, adaptPrescription,
  adaptNotification, adaptDoctor, adaptPatient,
  adaptQueueEntry, buildQueueDisplay, buildActivityFromNotifications,
} from '@/lib/api/adapters';

/* ── Helpers ── */
async function fetchDoctorMap() {
  try {
    const res = await apiFetch('/appointments/doctors');
    const map = {};
    (res.data || []).forEach((d) => {
      map[d.id] = { name: d.name, specialty: d.specialty || '', room: d.room || '' };
    });
    return map;
  } catch { return {}; }
}

async function fetchPatientMap() {
  try {
    const res = await apiFetch('/admin/patients');
    const map = {};
    (res.data || []).forEach((p) => { map[p.id] = { name: p.name }; });
    return map;
  } catch { return {}; }
}

/* ═══════════════════════════════════════
   AUTH SERVICE
   ═══════════════════════════════════════ */
export const authService = {
  async login(email, password) {
    return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  async signup({ email, password, name, role }) {
    return apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, role: role || 'patient', name }) });
  },
  async forgotPassword() {
    return { success: true, message: 'Password reset feature coming soon.' };
  },
};

/* ═══════════════════════════════════════
   PATIENT SERVICE
   ═══════════════════════════════════════ */
export const patientService = {
  async getProfile() {
    const res = await apiFetch('/patients/me');
    return adaptPatient(res.data);
  },
  async updateProfile(data) {
    const res = await apiFetch('/patients/me', { method: 'PUT', body: JSON.stringify(data) });
    return adaptPatient(res.data);
  },
  async getAppointments() {
    const [res, dm] = await Promise.all([apiFetch('/patients/me/appointments'), fetchDoctorMap()]);
    return (res.data || []).map((a) => {
      const doc = dm[a.doctor_id] || {};
      return adaptAppointment(a, { doctorName: doc.name, specialty: doc.specialty });
    });
  },
  async getReports() {
    const [res, dm] = await Promise.all([apiFetch('/patients/me/reports'), fetchDoctorMap()]);
    return (res.data || []).map((r) => adaptReport(r, { doctorName: dm[r.doctor_id]?.name }));
  },
  async getPrescriptions() {
    const [res, dm] = await Promise.all([apiFetch('/patients/me/prescriptions'), fetchDoctorMap()]);
    return (res.data || []).map((p) => adaptPrescription(p, { doctorName: dm[p.doctor_id]?.name }));
  },
  async getNotifications() {
    const res = await apiFetch('/patients/me/notifications');
    const items = (res.data || []).map(adaptNotification);
    return { items, unreadCount: res.unread_count || 0 };
  },
  async getQueue() {
    const [res, dm] = await Promise.all([apiFetch('/patients/me/queue'), fetchDoctorMap()]);
    return (res.data || []).map((q) => adaptQueueEntry(q, { doctorName: dm[q.doctor_id]?.name }));
  },
  async getActivity() {
    try {
      const res = await apiFetch('/patients/me/notifications');
      const adapted = (res.data || []).map(adaptNotification);
      return buildActivityFromNotifications(adapted);
    } catch { return []; }
  },
};

/* ═══════════════════════════════════════
   APPOINTMENT SERVICE
   ═══════════════════════════════════════ */
export const appointmentService = {
  async getAll() {
    const [res, dm] = await Promise.all([apiFetch('/patients/me/appointments'), fetchDoctorMap()]);
    return (res.data || []).map((a) => {
      const doc = dm[a.doctor_id] || {};
      return adaptAppointment(a, { doctorName: doc.name, specialty: doc.specialty });
    });
  },
  async getByDoctor() {
    const [res, pm] = await Promise.all([apiFetch('/doctors/me/appointments'), fetchPatientMap()]);
    return (res.data || []).map((a) => {
      const pat = pm[a.patient_id] || {};
      return adaptAppointment(a, { patientName: pat.name });
    });
  },
  async book({ patientId, doctorId, date, time, type, reason, location }) {
    const res = await apiFetch('/appointments', {
      method: 'POST',
      body: JSON.stringify({
        patient_id: patientId, doctor_id: doctorId,
        appointment_date: date, appointment_time: time,
        type: type || 'Consultation', reason: reason || null, location: location || null,
      }),
    });
    const dm = await fetchDoctorMap();
    const doc = dm[res.data.doctor_id] || {};
    return { success: true, appointment: adaptAppointment(res.data, { doctorName: doc.name, specialty: doc.specialty }) };
  },
  async cancel(id) {
    await apiFetch(`/appointments/${id}`, { method: 'DELETE' });
    return { success: true };
  },
  async update(id, data) {
    const res = await apiFetch(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    return { success: true, data: res.data };
  },
  async getDoctors(specialty) {
    const q = specialty ? `?specialty=${encodeURIComponent(specialty)}` : '';
    const res = await apiFetch(`/appointments/doctors${q}`);
    return (res.data || []).map(adaptDoctor);
  },
  async getAvailability(doctorId, date) {
    const q = date ? `?date=${encodeURIComponent(date)}` : '';
    return apiFetch(`/appointments/availability/${doctorId}${q}`);
  },
};

/* ═══════════════════════════════════════
   REPORT SERVICE
   ═══════════════════════════════════════ */
export const reportService = {
  async getAll() {
    const [res, dm] = await Promise.all([apiFetch('/patients/me/reports'), fetchDoctorMap()]);
    return (res.data || []).map((r) => adaptReport(r, { doctorName: dm[r.doctor_id]?.name }));
  },
  async getById(id) {
    const [res, dm] = await Promise.all([apiFetch(`/reports/${id}`), fetchDoctorMap()]);
    return adaptReport(res.data, { doctorName: dm[res.data.doctor_id]?.name });
  },
  async search(query) {
    const [res, dm] = await Promise.all([apiFetch(`/reports/search?q=${encodeURIComponent(query)}`), fetchDoctorMap()]);
    return (res.data || []).map((r) => adaptReport(r, { doctorName: dm[r.doctor_id]?.name }));
  },
  async getSummary(id) {
    const res = await apiFetch(`/reports/${id}/summary`);
    return res.data;
  },
  async generateSummary(id) {
    const res = await apiFetch(`/reports/${id}/summarize`, { method: 'POST' });
    return res.data;
  },
};

/* ═══════════════════════════════════════
   PRESCRIPTION SERVICE
   ═══════════════════════════════════════ */
export const prescriptionService = {
  async getAll() {
    const [res, dm] = await Promise.all([apiFetch('/patients/me/prescriptions'), fetchDoctorMap()]);
    return (res.data || []).map((p) => adaptPrescription(p, { doctorName: dm[p.doctor_id]?.name }));
  },
  async create(data) {
    const res = await apiFetch('/prescriptions', { method: 'POST', body: JSON.stringify(data) });
    return adaptPrescription(res.data);
  },
};

/* ═══════════════════════════════════════
   NOTIFICATION SERVICE
   ═══════════════════════════════════════ */
export const notificationService = {
  async getAll() {
    const res = await apiFetch('/notifications');
    return { items: (res.data || []).map(adaptNotification), unreadCount: res.unread_count || 0 };
  },
  async markAsRead(id) {
    await apiFetch(`/notifications/${id}/read`, { method: 'PUT' });
    return { success: true };
  },
  async markAllAsRead() {
    await apiFetch('/notifications/read-all', { method: 'PUT' });
    return { success: true };
  },
  async delete() {
    /* no backend endpoint – local-only */
    return { success: true };
  },
};

/* ═══════════════════════════════════════
   QUEUE SERVICE
   ═══════════════════════════════════════ */
export const queueService = {
  async getStatus() {
    const [res, dm] = await Promise.all([apiFetch('/patients/me/queue'), fetchDoctorMap()]);
    const entries = (res.data || []).map((q) => adaptQueueEntry(q, { doctorName: dm[q.doctor_id]?.name }));
    const firstName = entries[0]?.doctorName || '';
    return buildQueueDisplay(entries, firstName);
  },
  async getDoctorQueue() {
    const res = await apiFetch('/doctors/me/queue');
    return (res.data || []).map(adaptQueueEntry);
  },
  async join(data) {
    const res = await apiFetch('/queue/join', { method: 'POST', body: JSON.stringify(data) });
    return res.data;
  },
};

/* ═══════════════════════════════════════
   CHAT SERVICE
   ═══════════════════════════════════════ */
export const chatService = {
  async sendMessage(message) {
    const res = await apiFetch('/chat', { method: 'POST', body: JSON.stringify({ message }) });
    const d = res.data || {};
    return {
      role: 'assistant',
      content: d.response || 'I can help you with reports, appointments, prescriptions, and health questions.',
      timestamp: new Date().toISOString(),
      intent: d.intent,
    };
  },
  async getConversations() {
    return [
      { id: 'conv1', title: 'Latest Report Inquiry', date: new Date().toISOString().split('T')[0], messages: [] },
    ];
  },
};

/* ═══════════════════════════════════════
   DOCTOR SERVICE
   ═══════════════════════════════════════ */
export const doctorService = {
  async getMe() {
    const res = await apiFetch('/doctors/me');
    return adaptDoctor(res.data);
  },
  async getPatients() {
    const res = await apiFetch('/doctors/me/patients');
    return (res.data || []).map(adaptPatient);
  },
  async getAppointments() {
    const [res, pm] = await Promise.all([apiFetch('/doctors/me/appointments'), fetchPatientMap()]);
    return (res.data || []).map((a) => {
      const pat = pm[a.patient_id] || {};
      return adaptAppointment(a, { patientName: pat.name });
    });
  },
  async getReports() {
    const res = await apiFetch('/doctors/me/reports');
    return (res.data || []).map(adaptReport);
  },
  async getQueue() {
    const res = await apiFetch('/doctors/me/queue');
    return (res.data || []).map(adaptQueueEntry);
  },
  async getPrescriptions() {
    const res = await apiFetch('/prescriptions/me');
    return (res.data || []).map(adaptPrescription);
  },
  async getPatientDetail(patientId) {
    const res = await apiFetch(`/doctors/patients/${patientId}`);
    return {
      patient: adaptPatient(res.data.patient),
      reports: (res.data.reports || []).map(adaptReport),
    };
  },
  async getAll() {
    const res = await apiFetch('/appointments/doctors');
    return (res.data || []).map(adaptDoctor);
  },
  async getBySpecialty(specialty) {
    const res = await apiFetch(`/appointments/doctors?specialty=${encodeURIComponent(specialty)}`);
    return (res.data || []).map(adaptDoctor);
  },
  async getById(id) {
    try {
      const all = await doctorService.getAll();
      return all.find((d) => String(d.id) === String(id)) || null;
    } catch { return null; }
  },
};

/* ═══════════════════════════════════════
   PATIENT ROSTER (for doctor/admin views)
   ═══════════════════════════════════════ */
export const patientRosterService = {
  async getAll() {
    try {
      const res = await apiFetch('/admin/patients');
      return (res.data || []).map(adaptPatient);
    } catch {
      const res = await apiFetch('/doctors/me/patients');
      return (res.data || []).map(adaptPatient);
    }
  },
  async getById(id) {
    const all = await patientRosterService.getAll();
    return all.find((p) => String(p.id) === String(id)) || null;
  },
};

/* ═══════════════════════════════════════
   ADMIN SERVICE
   ═══════════════════════════════════════ */
export const adminService = {
  async getDashboard() {
    const res = await apiFetch('/admin/dashboard');
    return res.data;
  },
  async getPatients() {
    const res = await apiFetch('/admin/patients');
    return (res.data || []).map(adaptPatient);
  },
  async getDoctors() {
    const res = await apiFetch('/admin/doctors');
    return (res.data || []).map(adaptDoctor);
  },
  async getAppointments() {
    const [res, dm, pm] = await Promise.all([
      apiFetch('/admin/appointments'), fetchDoctorMap(), fetchPatientMap(),
    ]);
    return (res.data || []).map((a) => adaptAppointment(a, {
      doctorName: dm[a.doctor_id]?.name,
      specialty: dm[a.doctor_id]?.specialty,
      patientName: pm[a.patient_id]?.name,
    }));
  },
  async getReports() {
    const [res, dm] = await Promise.all([apiFetch('/admin/reports'), fetchDoctorMap()]);
    return (res.data || []).map((r) => adaptReport(r, { doctorName: dm[r.doctor_id]?.name }));
  },
};
