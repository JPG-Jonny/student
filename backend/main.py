# =========================================================================
# EDUPULSE ERP BACKEND - FASTAPI + SQLALCHEMY
# =========================================================================
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Optional
import uuid

# =========================================================================
# DATABASE CONFIGURATION
# =========================================================================
DATABASE_URL = "sqlite:///./edupulse.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# =========================================================================
# SQLALCHEMY MODELS
# =========================================================================

class Student(Base):
    __tablename__ = "students"
    
    id = Column(String, primary_key=True, default=lambda: f"STU{str(uuid.uuid4())[:8].upper()}")
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String)
    password = Column(String, nullable=False)
    department = Column(String, nullable=False)
    program = Column(String)
    semester = Column(Integer, default=1)
    enrollment_year = Column(Integer)
    cgpa = Column(Float, default=4.0)
    total_credits = Column(Integer, default=0)
    attendance_pct = Column(Float, default=100.0)
    avatar = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    attendance_records = relationship("AttendanceRecord", back_populates="student", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="student", cascade="all, delete-orphan")
    credit_transfers = relationship("CreditTransfer", back_populates="student", cascade="all, delete-orphan")
    assignments = relationship("AssignmentSubmission", back_populates="student", cascade="all, delete-orphan")


class Faculty(Base):
    __tablename__ = "faculties"
    
    id = Column(String, primary_key=True, default=lambda: f"FAC{str(uuid.uuid4())[:6].upper()}")
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    department = Column(String, nullable=False)
    course = Column(String)
    avatar = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    assignments = relationship("Assignment", back_populates="faculty", cascade="all, delete-orphan")


class Assignment(Base):
    __tablename__ = "assignments"
    
    id = Column(String, primary_key=True, default=lambda: f"ASN-{str(uuid.uuid4())[:8].upper()}")
    title = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    faculty_id = Column(String, ForeignKey("faculties.id"))
    description = Column(String)
    due_date = Column(String, nullable=False)
    max_marks = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    faculty = relationship("Faculty", back_populates="assignments")
    submissions = relationship("AssignmentSubmission", back_populates="assignment", cascade="all, delete-orphan")


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"
    
    id = Column(String, primary_key=True, default=lambda: f"SUB-{str(uuid.uuid4())[:8].upper()}")
    assignment_id = Column(String, ForeignKey("assignments.id"))
    student_id = Column(String, ForeignKey("students.id"))
    status = Column(String, default="Pending")  # Pending, Submitted, Graded, Late
    marks = Column(Integer, default=None)
    feedback = Column(String, default="")
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("Student", back_populates="assignments")


class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    
    id = Column(String, primary_key=True, default=lambda: f"ATT-{str(uuid.uuid4())[:8].upper()}")
    student_id = Column(String, ForeignKey("students.id"))
    subject = Column(String, nullable=False)
    total_classes = Column(Integer, default=0)
    attended = Column(Integer, default=0)
    pct = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    student = relationship("Student", back_populates="attendance_records")


class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(String, primary_key=True, default=lambda: f"ACT-{str(uuid.uuid4())[:8].upper()}")
    student_id = Column(String, ForeignKey("students.id"))
    title = Column(String, nullable=False)
    category = Column(String)  # Academic/Competition, Workshops, Internships, Extracurricular
    date = Column(String)
    organization = Column(String)
    description = Column(String)
    certificate_status = Column(String, default="Pending Verification")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    student = relationship("Student", back_populates="activities")


class CreditTransfer(Base):
    __tablename__ = "credit_transfers"
    
    id = Column(String, primary_key=True, default=lambda: f"TRF-{str(uuid.uuid4())[:8].upper()}")
    student_id = Column(String, ForeignKey("students.id"))
    source_inst = Column(String, nullable=False)
    dest_inst = Column(String, default="EduPulse Univ")
    course = Column(String, nullable=False)
    credits = Column(Integer, nullable=False)
    grade = Column(String)
    status = Column(String, default="Pending")  # Pending, Approved, Rejected
    request_date = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    student = relationship("Student", back_populates="credit_transfers")


# Create all tables
Base.metadata.create_all(bind=engine)

# =========================================================================
# PYDANTIC SCHEMAS (Request/Response Models)
# =========================================================================

class StudentLogin(BaseModel):
    email: str
    password: str


class StudentRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: str = ""
    department: str
    program: str = "B.S. General"
    semester: int = 1


class StudentResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    department: str
    program: str
    semester: int
    enrollment_year: int
    cgpa: float
    total_credits: int
    attendance_pct: float
    avatar: str
    
    class Config:
        from_attributes = True


class FacultyLogin(BaseModel):
    email: str
    password: str


class FacultyRegister(BaseModel):
    name: str
    email: str
    password: str
    department: str
    course: str = ""


class FacultyResponse(BaseModel):
    id: str
    name: str
    email: str
    department: str
    course: str
    avatar: str
    
    class Config:
        from_attributes = True


class AssignmentCreate(BaseModel):
    title: str
    subject: str
    description: str
    due_date: str
    max_marks: int = 100


class AssignmentResponse(BaseModel):
    id: str
    title: str
    subject: str
    faculty: str
    description: str
    due_date: str
    status: str
    marks: Optional[str] = None
    feedback: str
    max_marks: int
    
    class Config:
        from_attributes = True


class AssignmentSubmissionCreate(BaseModel):
    assignment_id: str
    feedback: str = ""


class AttendanceRecordResponse(BaseModel):
    subject: str
    total_classes: int
    attended: int
    pct: float
    
    class Config:
        from_attributes = True


class ActivityCreate(BaseModel):
    title: str
    category: str
    date: str
    organization: str
    description: str


class ActivityResponse(BaseModel):
    id: str
    title: str
    category: str
    date: str
    organization: str
    description: str
    certificate_status: str
    
    class Config:
        from_attributes = True


class CreditTransferCreate(BaseModel):
    source_inst: str
    course: str
    credits: int
    grade: str


class CreditTransferResponse(BaseModel):
    id: str
    student_id: str
    student_name: str
    source_inst: str
    dest_inst: str
    course: str
    credits: int
    grade: str
    status: str
    request_date: str
    
    class Config:
        from_attributes = True


class GradeSubmitRequest(BaseModel):
    assignment_id: str
    marks: int
    feedback: str


# =========================================================================
# FASTAPI APP INITIALIZATION
# =========================================================================

app = FastAPI(title="EduPulse ERP Backend", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================================================================
# AUTHENTICATION ENDPOINTS
# =========================================================================

@app.post("/api/auth/student-login")
def student_login(credentials: StudentLogin, db: Session = Depends(get_db)):
    """Student login endpoint"""
    student = db.query(Student).filter(Student.email == credentials.email).first()
    if not student or student.password != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "role": "student",
        "user": StudentResponse.model_validate(student)
    }


@app.post("/api/auth/faculty-login")
def faculty_login(credentials: FacultyLogin, db: Session = Depends(get_db)):
    """Faculty login endpoint"""
    faculty = db.query(Faculty).filter(Faculty.email == credentials.email).first()
    if not faculty or faculty.password != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "role": "faculty",
        "user": FacultyResponse.model_validate(faculty)
    }


@app.post("/api/auth/admin-login")
def admin_login(credentials: StudentLogin):
    """Admin login endpoint (simplified for demo)"""
    if credentials.email == "admin@edupulse.edu" and credentials.password == "admin123":
        return {
            "role": "admin",
            "user": {
                "name": "System Administrator",
                "email": "admin@edupulse.edu",
                "avatar": "SA"
            }
        }
    raise HTTPException(status_code=401, detail="Invalid admin credentials")


@app.post("/api/auth/student-register")
def student_register(data: StudentRegister, db: Session = Depends(get_db)):
    """Student registration endpoint"""
    # Check if email already exists
    existing = db.query(Student).filter(Student.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    avatar = "".join([n[0].upper() for n in data.name.split()])
    new_student = Student(
        name=data.name,
        email=data.email,
        password=data.password,
        phone=data.phone,
        department=data.department,
        program=data.program,
        semester=data.semester,
        enrollment_year=2026,
        avatar=avatar
    )
    
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    return {
        "role": "student",
        "user": StudentResponse.model_validate(new_student)
    }


@app.post("/api/auth/faculty-register")
def faculty_register(data: FacultyRegister, db: Session = Depends(get_db)):
    """Faculty registration endpoint"""
    existing = db.query(Faculty).filter(Faculty.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    avatar = "".join([n[0].upper() for n in data.name.split()])
    new_faculty = Faculty(
        name=data.name,
        email=data.email,
        password=data.password,
        department=data.department,
        course=data.course,
        avatar=avatar
    )
    
    db.add(new_faculty)
    db.commit()
    db.refresh(new_faculty)
    
    return {
        "role": "faculty",
        "user": FacultyResponse.model_validate(new_faculty)
    }


# =========================================================================
# STUDENT ENDPOINTS
# =========================================================================

@app.get("/api/students/{student_id}")
def get_student(student_id: str, db: Session = Depends(get_db)):
    """Get student profile"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return StudentResponse.model_validate(student)


@app.get("/api/students/{student_id}/assignments")
def get_student_assignments(student_id: str, db: Session = Depends(get_db)):
    """Get all assignments for a student"""
    assignments = db.query(Assignment).all()
    
    result = []
    for asn in assignments:
        submission = db.query(AssignmentSubmission).filter(
            AssignmentSubmission.assignment_id == asn.id,
            AssignmentSubmission.student_id == student_id
        ).first()
        
        faculty_name = asn.faculty.name if asn.faculty else "Unknown"
        status = submission.status if submission else "Pending"
        marks = str(submission.marks) if submission and submission.marks else "N/A"
        feedback = submission.feedback if submission else ""
        
        result.append({
            "id": asn.id,
            "title": asn.title,
            "subject": asn.subject,
            "faculty": faculty_name,
            "description": asn.description,
            "dueDate": asn.due_date,
            "status": status,
            "marks": marks + "/" + str(asn.max_marks) if marks != "N/A" else "N/A",
            "feedback": feedback,
            "maxMarks": asn.max_marks
        })
    
    return result


@app.get("/api/students/{student_id}/attendance")
def get_student_attendance(student_id: str, db: Session = Depends(get_db)):
    """Get attendance records for a student"""
    records = db.query(AttendanceRecord).filter(
        AttendanceRecord.student_id == student_id
    ).all()
    
    return [
        {
            "subject": r.subject,
            "totalClasses": r.total_classes,
            "attended": r.attended,
            "pct": r.pct
        }
        for r in records
    ]


@app.get("/api/students/{student_id}/activities")
def get_student_activities(student_id: str, db: Session = Depends(get_db)):
    """Get all activities for a student"""
    activities = db.query(Activity).filter(Activity.student_id == student_id).all()
    
    return [
        {
            "id": a.id,
            "title": a.title,
            "category": a.category,
            "date": a.date,
            "organization": a.organization,
            "description": a.description,
            "certificateStatus": a.certificate_status
        }
        for a in activities
    ]


@app.post("/api/students/{student_id}/activities")
def create_activity(student_id: str, data: ActivityCreate, db: Session = Depends(get_db)):
    """Create new activity for student"""
    new_activity = Activity(
        student_id=student_id,
        title=data.title,
        category=data.category,
        date=data.date,
        organization=data.organization,
        description=data.description,
        certificate_status="Pending Verification"
    )
    
    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)
    
    return {
        "id": new_activity.id,
        "title": new_activity.title,
        "category": new_activity.category,
        "date": new_activity.date,
        "organization": new_activity.organization,
        "description": new_activity.description,
        "certificateStatus": new_activity.certificate_status
    }


@app.get("/api/students/{student_id}/credits")
def get_student_credits(student_id: str, db: Session = Depends(get_db)):
    """Get credit transfer requests for a student"""
    transfers = db.query(CreditTransfer).filter(
        CreditTransfer.student_id == student_id
    ).all()
    
    return [
        {
            "id": t.id,
            "studentId": t.student_id,
            "studentName": db.query(Student).filter(Student.id == t.student_id).first().name,
            "sourceInst": t.source_inst,
            "destInst": t.dest_inst,
            "course": t.course,
            "credits": t.credits,
            "grade": t.grade,
            "status": t.status,
            "requestDate": t.request_date.strftime("%Y-%m-%d") if t.request_date else ""
        }
        for t in transfers
    ]


@app.post("/api/students/{student_id}/credits")
def create_credit_transfer(student_id: str, data: CreditTransferCreate, db: Session = Depends(get_db)):
    """Submit credit transfer request"""
    new_transfer = CreditTransfer(
        student_id=student_id,
        source_inst=data.source_inst,
        course=data.course,
        credits=data.credits,
        grade=data.grade,
        status="Pending"
    )
    
    db.add(new_transfer)
    db.commit()
    db.refresh(new_transfer)
    
    student = db.query(Student).filter(Student.id == student_id).first()
    
    return {
        "id": new_transfer.id,
        "studentId": new_transfer.student_id,
        "studentName": student.name,
        "sourceInst": new_transfer.source_inst,
        "destInst": new_transfer.dest_inst,
        "course": new_transfer.course,
        "credits": new_transfer.credits,
        "grade": new_transfer.grade,
        "status": new_transfer.status,
        "requestDate": new_transfer.request_date.strftime("%Y-%m-%d")
    }


@app.post("/api/students/{student_id}/assignments/{assignment_id}/submit")
def submit_assignment(student_id: str, assignment_id: str, data: AssignmentSubmissionCreate, db: Session = Depends(get_db)):
    """Submit or update assignment submission"""
    submission = db.query(AssignmentSubmission).filter(
        AssignmentSubmission.assignment_id == assignment_id,
        AssignmentSubmission.student_id == student_id
    ).first()
    
    if not submission:
        submission = AssignmentSubmission(
            assignment_id=assignment_id,
            student_id=student_id,
            status="Submitted",
            feedback=data.feedback
        )
        db.add(submission)
    else:
        submission.status = "Submitted"
        submission.feedback = data.feedback
        submission.submitted_at = datetime.utcnow()
    
    db.commit()
    db.refresh(submission)
    
    asn = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    
    return {
        "id": submission.id,
        "status": submission.status,
        "message": "Assignment submitted successfully"
    }


# =========================================================================
# FACULTY ENDPOINTS
# =========================================================================

@app.get("/api/faculties/{faculty_id}")
def get_faculty(faculty_id: str, db: Session = Depends(get_db)):
    """Get faculty profile"""
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return FacultyResponse.model_validate(faculty)


@app.post("/api/faculties/{faculty_id}/assignments")
def create_assignment(faculty_id: str, data: AssignmentCreate, db: Session = Depends(get_db)):
    """Create new assignment"""
    new_assignment = Assignment(
        title=data.title,
        subject=data.subject,
        faculty_id=faculty_id,
        description=data.description,
        due_date=data.due_date,
        max_marks=data.max_marks
    )
    
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)
    
    return {
        "id": new_assignment.id,
        "title": new_assignment.title,
        "subject": new_assignment.subject,
        "faculty": db.query(Faculty).filter(Faculty.id == faculty_id).first().name,
        "description": new_assignment.description,
        "dueDate": new_assignment.due_date,
        "status": "Pending",
        "marks": "N/A",
        "feedback": "",
        "maxMarks": new_assignment.max_marks
    }


@app.get("/api/faculties/{faculty_id}/assignments")
def get_faculty_assignments(faculty_id: str, db: Session = Depends(get_db)):
    """Get all assignments created by faculty"""
    assignments = db.query(Assignment).filter(Assignment.faculty_id == faculty_id).all()
    
    result = []
    for asn in assignments:
        result.append({
            "id": asn.id,
            "title": asn.title,
            "subject": asn.subject,
            "faculty": asn.faculty.name if asn.faculty else "Unknown",
            "description": asn.description,
            "dueDate": asn.due_date,
            "status": "Active",
            "marks": "N/A",
            "feedback": "",
            "maxMarks": asn.max_marks
        })
    
    return result


@app.get("/api/faculties/{faculty_id}/assignment-submissions/{assignment_id}")
def get_assignment_submissions(faculty_id: str, assignment_id: str, db: Session = Depends(get_db)):
    """Get all submissions for an assignment"""
    submissions = db.query(AssignmentSubmission).filter(
        AssignmentSubmission.assignment_id == assignment_id
    ).all()
    
    result = []
    for sub in submissions:
        student = db.query(Student).filter(Student.id == sub.student_id).first()
        result.append({
            "id": sub.id,
            "studentId": sub.student_id,
            "studentName": student.name if student else "Unknown",
            "status": sub.status,
            "marks": sub.marks,
            "feedback": sub.feedback,
            "submittedAt": sub.submitted_at.strftime("%Y-%m-%d %H:%M:%S") if sub.submitted_at else ""
        })
    
    return result


@app.post("/api/faculties/{faculty_id}/assignments/{assignment_id}/grade")
def grade_assignment(faculty_id: str, assignment_id: str, data: GradeSubmitRequest, db: Session = Depends(get_db)):
    """Grade an assignment submission"""
    submission = db.query(AssignmentSubmission).filter(
        AssignmentSubmission.assignment_id == data.assignment_id,
        AssignmentSubmission.student_id == data.assignment_id
    ).first()
    
    # This endpoint needs adjustment - it should accept student_id
    # For now, we'll create a more flexible version
    raise HTTPException(status_code=400, detail="Use /api/assignments/submissions/{submission_id}/grade instead")


@app.put("/api/assignments/submissions/{submission_id}/grade")
def grade_submission(submission_id: str, data: GradeSubmitRequest, db: Session = Depends(get_db)):
    """Grade a specific assignment submission"""
    submission = db.query(AssignmentSubmission).filter(AssignmentSubmission.id == submission_id).first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    submission.marks = data.marks
    submission.feedback = data.feedback
    submission.status = "Graded"
    
    db.commit()
    db.refresh(submission)
    
    return {
        "id": submission.id,
        "status": submission.status,
        "marks": submission.marks,
        "feedback": submission.feedback
    }


# =========================================================================
# ADMIN ENDPOINTS
# =========================================================================

@app.get("/api/admin/students")
def get_all_students(db: Session = Depends(get_db)):
    """Get all students (admin only)"""
    students = db.query(Student).all()
    return [StudentResponse.model_validate(s) for s in students]


@app.get("/api/admin/faculties")
def get_all_faculties(db: Session = Depends(get_db)):
    """Get all faculties (admin only)"""
    faculties = db.query(Faculty).all()
    return [FacultyResponse.model_validate(f) for f in faculties]


@app.get("/api/admin/credit-transfers")
def get_all_credit_transfers(db: Session = Depends(get_db)):
    """Get all pending credit transfers (admin only)"""
    transfers = db.query(CreditTransfer).all()
    
    result = []
    for t in transfers:
        student = db.query(Student).filter(Student.id == t.student_id).first()
        result.append({
            "id": t.id,
            "studentId": t.student_id,
            "studentName": student.name if student else "Unknown",
            "sourceInst": t.source_inst,
            "destInst": t.dest_inst,
            "course": t.course,
            "credits": t.credits,
            "grade": t.grade,
            "status": t.status,
            "requestDate": t.request_date.strftime("%Y-%m-%d") if t.request_date else ""
        })
    
    return result


@app.put("/api/admin/credit-transfers/{transfer_id}/approve")
def approve_credit_transfer(transfer_id: str, db: Session = Depends(get_db)):
    """Approve credit transfer request"""
    transfer = db.query(CreditTransfer).filter(CreditTransfer.id == transfer_id).first()
    
    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer not found")
    
    transfer.status = "Approved"
    
    # Update student's total credits
    student = db.query(Student).filter(Student.id == transfer.student_id).first()
    if student:
        student.total_credits += transfer.credits
    
    db.commit()
    
    return {
        "id": transfer.id,
        "status": transfer.status,
        "message": "Credit transfer approved"
    }


@app.put("/api/admin/credit-transfers/{transfer_id}/reject")
def reject_credit_transfer(transfer_id: str, db: Session = Depends(get_db)):
    """Reject credit transfer request"""
    transfer = db.query(CreditTransfer).filter(CreditTransfer.id == transfer_id).first()
    
    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer not found")
    
    transfer.status = "Rejected"
    db.commit()
    
    return {
        "id": transfer.id,
        "status": transfer.status,
        "message": "Credit transfer rejected"
    }


# =========================================================================
# HEALTH CHECK
# =========================================================================

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "operational", "message": "EduPulse ERP Backend is running"}
