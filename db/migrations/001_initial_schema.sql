-- 1. Custom Data Types (ENUMs)
CREATE TYPE user_role AS ENUM ('Student', 'Faculty', 'Admin');
CREATE TYPE assignment_status AS ENUM ('Pending', 'Submitted', 'Graded');
CREATE TYPE verification_status AS ENUM ('Pending', 'Verified', 'Rejected');
CREATE TYPE transfer_status AS ENUM ('Pending', 'Approved', 'Rejected');

-- 2. Base Authentication Table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Students Table
CREATE TABLE students (
    id VARCHAR(50) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100) NOT NULL,
    program VARCHAR(100) NOT NULL,
    semester INT CHECK (semester BETWEEN 1 AND 12),
    enrollment_year INT,
    cgpa NUMERIC(3, 2) CHECK (cgpa >= 0.00 AND cgpa <= 4.00),
    total_credits INT DEFAULT 0 CHECK (total_credits >= 0),
    attendance_pct NUMERIC(5, 2) DEFAULT 100.00 CHECK (attendance_pct >= 0.00 AND attendance_pct <= 100.00),
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Faculties Table
CREATE TABLE faculties (
    faculty_id VARCHAR(50) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    department VARCHAR(100) NOT NULL,
    assigned_course VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Assignments Table
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    faculty_id VARCHAR(50) REFERENCES faculties(faculty_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    due_date DATE NOT NULL,
    status assignment_status DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Attendance Records Table (Auto-calculates Attendance Percentage)
CREATE TABLE attendance_records (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    total_classes INT NOT NULL CHECK (total_classes >= 0),
    attended_classes INT NOT NULL CHECK (attended_classes <= total_classes),
    pct NUMERIC(5, 2) GENERATED ALWAYS AS (
        CASE WHEN total_classes > 0 
             THEN ROUND((attended_classes::numeric / total_classes::numeric) * 100, 1) 
             ELSE 0.00 
        END
    ) STORED
);

-- 7. Co-curricular Activities Table
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    certificate_status verification_status DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Credit Transfers Table
CREATE TABLE credit_transfers (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    source_institution VARCHAR(150) NOT NULL,
    destination_institution VARCHAR(150) NOT NULL,
    course VARCHAR(150) NOT NULL,
    credits INT NOT NULL CHECK (credits > 0),
    grade VARCHAR(5),
    request_date DATE DEFAULT CURRENT_DATE,
    status transfer_status DEFAULT 'Pending'
);