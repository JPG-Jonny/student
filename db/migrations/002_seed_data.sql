-- 1. Insert Base Users (Authentication records)
INSERT INTO users (id, full_name, email, password_hash, role) VALUES
('STU202601', 'Rahul Sharma', 'rahul.sharma@edupulse.edu', '$2b$10$hashedpass123', 'Student'),
('STU202602', 'Ananya Patel', 'ananya.patel@edupulse.edu', '$2b$10$hashedpass456', 'Student'),
('FAC202601', 'Dr. Aris Thorne', 'aris.thorne@edupulse.edu', '$2b$10$hashedpass789', 'Faculty'),
('ADM202601', 'System Administrator', 'admin@edupulse.edu', '$2b$10$hashedpass000', 'Admin');

-- 2. Insert Student Profiles
INSERT INTO students (id, name, email, phone, department, program, semester, enrollment_year, cgpa, total_credits, attendance_pct) VALUES
('STU202601', 'Rahul Sharma', 'rahul.sharma@edupulse.edu', '+91 9876543210', 'Computer Science', 'B.Tech', 6, 2023, 3.82, 90, 88.50),
('STU202602', 'Ananya Patel', 'ananya.patel@edupulse.edu', '+91 9876543211', 'Electronics', 'B.Tech', 4, 2024, 3.65, 60, 92.00);

-- 3. Insert Faculty Profiles
INSERT INTO faculties (faculty_id, department, assigned_course) VALUES
('FAC202601', 'Computer Science', 'Data Structures & Algorithms');

-- 4. Insert Sample Assignments
INSERT INTO assignments (faculty_id, title, due_date, status) VALUES
('FAC202601', 'Binary Search Trees Implementation', '2026-09-25', 'Pending'),
('FAC202601', 'Graph Algorithms Analysis', '2026-09-18', 'Submitted');

-- 5. Insert Attendance Records
INSERT INTO attendance_records (student_id, subject, total_classes, attended_classes) VALUES
('STU202601', 'Data Structures', 40, 36),
('STU202601', 'Database Systems', 35, 32),
('STU202602', 'Digital Electronics', 30, 28);

-- 6. Insert Co-curricular Activities
INSERT INTO activities (student_id, title, category, certificate_status) VALUES
('STU202601', 'National Level Hackathon Winner', 'Coding', 'Verified'),
('STU202602', 'Robotics Workshop Certificate', 'Workshop', 'Pending');

-- 7. Insert Credit Transfer Requests
INSERT INTO credit_transfers (id, student_id, source_institution, destination_institution, course, credits, grade, request_date, status) VALUES
('TRF-8801', 'STU202601', 'IIT Bombay', 'EduPulse University', 'Advanced Java', 4, 'A', '2026-08-10', 'Approved'),
('TRF-8802', 'STU202602', 'BITS Pilani', 'EduPulse University', 'Signals and Systems', 3, 'A-', '2026-09-01', 'Pending');