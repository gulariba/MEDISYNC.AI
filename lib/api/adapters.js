/**
 * Adapters: transform backend (snake_case) responses into the
 * camelCase shape the existing frontend pages expect.
 * This keeps every page's UI code untouched.
 */

export function adaptAppointment(a, { doctorName, specialty, patientName } = {}) {
  return {
    id: a.id,
    patientId: a.patient_id,
    doctorId: a.doctor_id,
    patientName: patientName || `Patient #${a.patient_id}`,
    doctorName: doctorName || `Doctor #${a.doctor_id}`,
    specialty: specialty || '',
    date: a.appointment_date,
    time: a.appointment_time,
    location: a.location || '',
    status: a.status === 'scheduled' ? 'upcoming' : a.status,
    type: a.type || 'Consultation',
    reason: a.reason,
    createdAt: a.created_at,
  };
}

export function adaptReport(r, { doctorName } = {}) {
  return {
    id: r.id,
    patientId: r.patient_id,
    doctorId: r.doctor_id,
    name: r.title,
    type: r.report_type,
    date: r.report_date,
    doctorName: doctorName || `Doctor #${r.doctor_id}`,
    status: r.status,
    hospital: r.hospital || 'MediSync Central Hospital',
    findings: r.findings || '',
    aiSummary: r.ai_summary || '',
    content: r.content,
    createdAt: r.created_at,
  };
}

export function adaptPrescription(p, { doctorName } = {}) {
  return {
    id: p.id,
    patientId: p.patient_id,
    doctorId: p.doctor_id,
    medicine: p.medicine,
    dosage: p.dosage,
    frequency: p.frequency || '',
    duration: p.duration || '',
    doctorName: doctorName || `Doctor #${p.doctor_id}`,
    date: p.date || '',
    status: p.status,
    instructions: p.instructions || '',
    createdAt: p.created_at,
  };
}

export function adaptNotification(n) {
  return {
    id: n.id,
    userId: n.user_id,
    type: n.type,
    title: n.title,
    message: n.message || '',
    time: n.created_at,
    read: n.is_read,
    createdAt: n.created_at,
  };
}

export function adaptDoctor(d) {
  return {
    id: d.id,
    userId: d.user_id,
    name: d.name,
    specialty: d.specialty || '',
    email: '',
    phone: '',
    available: d.available,
    rating: d.rating,
    patients: d.patient_count,
    avatar: null,
    room: d.room || '',
    experience: d.experience || '',
    licenseNumber: d.license_number,
    createdAt: d.created_at,
  };
}

export function adaptPatient(p) {
  return {
    id: p.id,
    userId: p.user_id,
    name: p.name,
    email: '',
    phone: p.phone || '',
    dob: p.date_of_birth || '',
    gender: p.gender || '',
    avatar: null,
    bloodGroup: p.blood_group || '',
    address: p.address || '',
    createdAt: p.created_at,
  };
}

export function adaptQueueEntry(q, { doctorName, patientName } = {}) {
  return {
    id: q.id,
    appointmentId: q.appointment_id,
    patientId: q.patient_id,
    doctorId: q.doctor_id,
    position: q.queue_number,
    status: q.status,
    estimatedWait: q.estimated_wait,
    doctorName: doctorName || `Doctor #${q.doctor_id}`,
    patientName: patientName || `Patient #${q.patient_id}`,
    createdAt: q.created_at,
  };
}

/**
 * Build a queue-display object similar to the old mock queueData shape.
 */
export function buildQueueDisplay(entries, doctorName) {
  if (!entries || entries.length === 0) {
    return {
      currentServing: 0,
      yourPosition: 0,
      estimatedWait: 0,
      doctor: doctorName || '',
      room: '',
      appointmentTime: '',
      queue: [],
    };
  }

  const serving = entries.find((e) => e.status === 'serving');
  const currentServing = serving ? serving.queue_number : 0;
  const youEntry = entries.find((e) => e.status === 'you' || e.status === 'waiting');
  const yourPosition = youEntry ? youEntry.queue_number : entries.length;
  const estimatedWait = youEntry ? youEntry.estimated_wait : 0;

  const queue = entries.map((e) => ({
    position: e.queue_number,
    name: e.status === 'you' ? `${e.patientName || 'You'} (You)` : (e.patientName || `Patient #${e.patient_id}`),
    status: e.status === 'serving' ? 'serving' : e.status === 'you' ? 'you' : 'waiting',
  }));

  return { currentServing, yourPosition, estimatedWait, doctor: doctorName || '', room: '', appointmentTime: '', queue };
}

/** Generate a placeholder activity timeline from notifications. */
export function buildActivityFromNotifications(notifications) {
  return notifications.slice(0, 5).map((n) => ({
    id: `at-${n.id}`,
    type: n.type,
    title: n.title,
    description: n.message,
    time: formatTimeAgo(n.created_at || n.time),
    icon: 'Activity',
  }));
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
}
