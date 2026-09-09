-- 1. Student Dashboard View
CREATE OR REPLACE VIEW v_student_dashboard AS
SELECT 
    s.id AS student_id,
    s.name,
    s.email,
    s.department,
    s.program,
    s.semester,
    s.cgpa,
    s.total_credits,
    COALESCE(ROUND(AVG(ar.pct), 2), s.attendance_pct) AS live_attendance_avg,
    COUNT(DISTINCT CASE WHEN ct.status = 'Pending' THEN ct.id END) AS pending_credit_transfers,
    COUNT(DISTINCT CASE WHEN act.certificate_status = 'Verified' THEN act.id END) AS verified_activities_count
FROM students s
LEFT JOIN attendance_records ar ON ar.student_id = s.id
LEFT JOIN credit_transfers ct ON ct.student_id = s.id
LEFT JOIN activities act ON act.student_id = s.id
GROUP BY 
    s.id, 
    s.name, 
    s.email, 
    s.department, 
    s.program, 
    s.semester, 
    s.cgpa, 
    s.total_credits, 
    s.attendance_pct;

-- 2. Pending Credit Transfers Review View
CREATE OR REPLACE VIEW v_pending_credit_transfers AS
SELECT 
    ct.id AS transfer_id,
    ct.student_id,
    s.name AS student_name,
    s.email AS student_email,
    s.department,
    s.cgpa,
    ct.source_institution,
    ct.destination_institution,
    ct.course AS source_course,
    ct.credits,
    ct.grade,
    ct.request_date,
    ct.status
FROM credit_transfers ct
JOIN students s ON ct.student_id = s.id
WHERE ct.status = 'Pending';

-- 3. Faculty Workload Overview View
CREATE OR REPLACE VIEW v_faculty_overview AS
SELECT 
    f.faculty_id,
    u.full_name AS faculty_name,
    u.email,
    f.department,
    f.assigned_course,
    COUNT(DISTINCT a.id) AS total_assignments_created,
    COUNT(DISTINCT CASE WHEN a.status = 'Submitted' THEN a.id END) AS assignments_needing_grading,
    (
        SELECT COUNT(*) 
        FROM students s 
        WHERE s.department = f.department
    ) AS total_department_students
FROM faculties f
JOIN users u ON f.faculty_id = u.id
LEFT JOIN assignments a ON f.faculty_id = a.faculty_id
GROUP BY f.faculty_id, u.full_name, u.email, f.department, f.assigned_course;

-- 4. Credit Transfer Trigger Function
CREATE OR REPLACE FUNCTION fn_update_student_credits_on_transfer()
RETURNS TRIGGER AS $$
BEGIN
    -- Increase credits when transfer is approved
    IF NEW.status = 'Approved' AND (OLD.status IS NULL OR OLD.status <> 'Approved') THEN
        UPDATE students
        SET total_credits = total_credits + NEW.credits
        WHERE id = NEW.student_id;
    END IF;

    -- Decrease credits if approval is reverted
    IF OLD.status = 'Approved' AND NEW.status <> 'Approved' THEN
        UPDATE students
        SET total_credits = GREATEST(0, total_credits - NEW.credits)
        WHERE id = NEW.student_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger Activation
DROP TRIGGER IF EXISTS trg_credit_transfer_approval ON credit_transfers;

CREATE TRIGGER trg_credit_transfer_approval
AFTER UPDATE OF status ON credit_transfers
FOR EACH ROW
EXECUTE FUNCTION fn_update_student_credits_on_transfer();