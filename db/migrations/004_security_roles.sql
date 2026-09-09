-- 1. Create Roles (Safely check if they already exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_student_role') THEN
        CREATE ROLE app_student_role;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_faculty_role') THEN
        CREATE ROLE app_faculty_role;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_admin_role') THEN
        CREATE ROLE app_admin_role;
    END IF;
END $$;

-- 2. Grant Permissions for Student Role
GRANT SELECT ON v_student_dashboard TO app_student_role;
GRANT SELECT ON students, assignments, attendance_records, activities, credit_transfers TO app_student_role;
GRANT INSERT, UPDATE ON activities, credit_transfers TO app_student_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_student_role;

-- 3. Grant Permissions for Faculty Role
GRANT SELECT ON v_faculty_overview TO app_faculty_role;
GRANT SELECT ON students TO app_faculty_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON assignments TO app_faculty_role;
GRANT SELECT, INSERT, UPDATE ON attendance_records TO app_faculty_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_faculty_role;

-- 4. Grant Permissions for Admin Role
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_admin_role;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO app_admin_role;