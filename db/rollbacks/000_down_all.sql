-- 1. Drop Roles
DROP ROLE IF EXISTS app_student_role;
DROP ROLE IF EXISTS app_faculty_role;
DROP ROLE IF EXISTS app_admin_role;

-- 2. Drop Triggers & Functions
DROP TRIGGER IF EXISTS trg_credit_transfer_approval ON credit_transfers;
DROP FUNCTION IF EXISTS fn_update_student_credits_on_transfer();

-- 3. Drop Views
DROP VIEW IF EXISTS v_faculty_overview;
DROP VIEW IF EXISTS v_pending_credit_transfers;
DROP VIEW IF EXISTS v_student_dashboard;

-- 4. Drop Tables (Reverse Dependency Order)
DROP TABLE IF EXISTS credit_transfers CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS faculties CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 5. Drop Custom ENUM Types
DROP TYPE IF EXISTS transfer_status;
DROP TYPE IF EXISTS verification_status;
DROP TYPE IF EXISTS assignment_status;
DROP TYPE IF EXISTS user_role;