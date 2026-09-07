-- Healthcare Multi-Agent System - Seed Data
-- This file contains sample data for development and testing

-- Insert sample patients
INSERT INTO patients (patient_id, name, date_of_birth, email, phone) VALUES
('P001', 'John Doe', '1985-03-15', 'john.doe@example.com', '+1-555-0101'),
('P002', 'Jane Smith', '1990-07-22', 'jane.smith@example.com', '+1-555-0102'),
('P003', 'Michael Johnson', '1978-11-30', 'michael.j@example.com', '+1-555-0103'),
('P004', 'Emily Davis', '1995-05-18', 'emily.davis@example.com', '+1-555-0104'),
('P005', 'Robert Wilson', '1982-09-08', 'robert.wilson@example.com', '+1-555-0105');

-- Insert sample doctors
INSERT INTO doctors (doctor_id, name, specialization, email, phone, is_available) VALUES
('D001', 'Dr. Sarah Connor', 'Cardiology', 'sarah.connor@hospital.com', '+1-555-0201', true),
('D002', 'Dr. James Martinez', 'Neurology', 'james.martinez@hospital.com', '+1-555-0202', true),
('D003', 'Dr. Lisa Anderson', 'General Practice', 'lisa.anderson@hospital.com', '+1-555-0203', true),
('D004', 'Dr. David Chen', 'Pediatrics', 'david.chen@hospital.com', '+1-555-0204', true),
('D005', 'Dr. Maria Garcia', 'Dermatology', 'maria.garcia@hospital.com', '+1-555-0205', false);

-- Insert sample appointments
INSERT INTO appointments (appointment_id, patient_id, doctor_id, scheduled_time, status, reason) VALUES
('A001', 1, 3, '2026-09-10 10:00:00', 'scheduled', 'Annual checkup'),
('A002', 2, 1, '2026-09-11 14:30:00', 'scheduled', 'Chest pain consultation'),
('A003', 3, 2, '2026-09-12 09:00:00', 'scheduled', 'Migraine follow-up'),
('A004', 4, 4, '2026-09-13 11:00:00', 'scheduled', 'Child vaccination'),
('A005', 5, 3, '2026-09-08 15:00:00', 'completed', 'Diabetes management');

-- Insert sample medical records
INSERT INTO medical_records (record_id, patient_id, record_type, content, created_by) VALUES
('R001', 1, 'diagnosis', 'Patient presents with mild hypertension. BP: 140/90. Recommended lifestyle modifications.', 'D003'),
('R002', 2, 'lab_result', 'Cholesterol: 220 mg/dL (elevated). LDL: 150 mg/dL. Recommend dietary changes.', 'D001'),
('R003', 3, 'prescription', 'Sumatriptan 50mg, take as needed for migraine. Max 2 doses per day.', 'D002'),
('R004', 4, 'diagnosis', 'Routine pediatric checkup. Growth and development normal for age.', 'D004'),
('R005', 5, 'prescription', 'Metformin 500mg twice daily. Monitor blood glucose levels.', 'D003');

-- Insert sample agent logs
INSERT INTO agent_logs (agent_name, action, input_data, output_data, status) VALUES
('triage_agent', 'assess_symptoms', '{"symptoms": ["fever", "cough"], "severity": "moderate"}', '{"priority": "medium", "recommended_specialty": "general_practice"}', 'success'),
('diagnosis_agent', 'preliminary_diagnosis', '{"symptoms": ["chest_pain", "shortness_of_breath"]}', '{"possible_conditions": ["angina", "anxiety"], "urgency": "high"}', 'success'),
('scheduling_agent', 'book_appointment', '{"patient_id": "P001", "preferred_time": "morning"}', '{"appointment_id": "A001", "scheduled": true}', 'success');
