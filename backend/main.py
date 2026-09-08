# =========================================================================
# EDUPULSE ERP BACKEND - PRODUCTION-READY FASTAPI + SQLALCHEMY + POSTGRESQL
# =========================================================================
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship, joinedload
from sqlalchemy.pool import QueuePool
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import List, Optional
from jose import JWTError, jwt
import uuid
import logging

# =========================================================================
# LOGGING CONFIGURATION
# =========================================================================
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# =========================================================================
# ENVIRONMENT CONFIGURATION (Pydantic Settings)
# =========================================================================
class Settings(BaseSettings):
    """Application settings loaded from .env file"""
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:8080", "http://127.0.0.1:5500"]
    app_name: str = "EduPulse ERP"
    app_version: str = "1.0.0"
    fastapi_debug: bool = False
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

settings = Settings()

# =========================================================================
# SECURITY CONFIGURATION
# =========================================================================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hashed version"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    """Decode and validate a JWT access token"""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# =========================================================================
# DATABASE CONFIGURATION
# =========================================================================
engine = create_engine(
    settings.database_url,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=10,
    pool_recycle=3600,
    pool_pre_ping=True,
    echo=settings.fastapi_debug
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================================================================
# SQLALCHEMY MODELS
# =========================================================================

class Student(Base):
    __tablename__ = "students"
    
    id = Column(String, primary_key=True, default=lambda: f"STU{str(uuid.uuid4()).upper()}")
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String)
    hashed_password = Column(String, nullable=False)
    department = Column(String, nullable=False)
    program = Column(String)
    semester = Column(Integer, default=1)
    enrollment_year = Column(Integer)
    cgpa = Column(Float, default=4.0)
    total_credits = Column(Integer, default=0)
    attendance_pct = Column(Float, default=100.0)
    avatar = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    attendance_records = relationship("AttendanceRecord", back_populates="student", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="student", cascade="all, delete-orphan")
    credit_transfers = relationship("CreditTransfer", back_populates="student", cascade="all, delete-orphan")
    assignments = relationship("AssignmentSubmission", back_populates="student", cascade="all, delete-orphan")


class Faculty(Base):
    __tablename__ = "faculties"
    
    id = Column(String, primary_key=True, default=lambda: f"FAC{str(uuid.uuid4())[:6].upper()}")
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    department = Column(String, nullable=False)
    course = Column(String)
    avatar = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    assignments = relationship("Assignment", back_populates="faculty", cascade="all, delete-orphan")

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(String, primary_key=True, default=lambda: f"ADM-{str(uuid.uuid4()).upper()}")
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
class Assignment(Base):
    __tablename__ = "assignments"
    
    id = Column(String, primary_key=True, default=lambda: f"ASN-{str(uuid.uuid4()).upper()}")
    title = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    faculty_id = Column(String, ForeignKey("faculties.id"), index=True)
    description = Column(String)
    due_date = Column(String, nullable=False)
    max_marks = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    faculty = relationship("Faculty", back_populates="assignments")
    submissions = relationship("AssignmentSubmission", back_populates="assignment", cascade="all, delete-orphan")


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"
    
    id = Column(String, primary_key=True, default=lambda: f"SUB-{str(uuid.uuid4()).upper()}")
    assignment_id = Column(String, ForeignKey("assignments.id"), index=True)
    student_id = Column(String, ForeignKey("students.id"), index=True)
    status = Column(String, default="Pending")
    marks = Column(Integer, default=None)
    feedback = Column(String, default="")
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("Student", back_populates="assignments")


class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    
    id = Column(String, primary_key=True, default=lambda: f"ATT-{str(uuid.uuid4()).upper()}")
    student_id = Column(String, ForeignKey("students.id"), index=True)
    subject = Column(String, nullable=False)
    total_classes = Column(Integer, default=0)
    attended = Column(Integer, default=0)
    pct = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    student = relationship("Student", back_populates="attendance_records")


class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(String, primary_key=True, default=lambda: f"ACT-{str(uuid.uuid4()).upper()}")
    student_id = Column(String, ForeignKey("students.id"), index=True)
    title = Column(String, nullable=False)
    category = Column(String)
    date = Column(String)
    organization = Column(String)
    description = Column(String)
    certificate_status = Column(String, default="Pending Verification")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    student = relationship("Student", back_populates="activities")


class CreditTransfer(Base):
    __tablename__ = "credit_transfers"
    
    id = Column(String, primary_key=True, default=lambda: f"TRF-{str(uuid.uuid4()).upper()}")
    student_id = Column(String, ForeignKey("students.id"), index=True)
    source_inst = Column(String, nullable=False)
    dest_inst = Column(String, default="EduPulse Univ")
    course = Column(String, nullable=False)
    credits = Column(Integer, nullable=False)
    grade = Column(String)
    status = Column(String, default="Pending", index=True)
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
class AdminLogin(BaseModel):
    email: str
    password: str

class AdminResponse(BaseModel):
    id: str
    name: str
    email: str
    
class Config:
    from_attributes = True


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


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


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
    marks: int
    feedback: str


# =========================================================================
# FASTAPI APP INITIALIZATION
# =========================================================================

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Production-ready ERP backend with JWT authentication"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================================
# DEPENDENCY: GET CURRENT USER
# =========================================================================

async def get_current_student(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Student:
    """Get current authenticated student from JWT token"""
    payload = decode_access_token(token)
    student_id: str = payload.get("sub")
    user_type: str = payload.get("type")
    
    if student_id is None or user_type != "student":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    student = db.query(Student).filter(Student.id == student_id).first()
    if student is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Student not found",
        )
    return student


async def get_current_faculty(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Faculty:
    """Get current authenticated faculty from JWT token"""
    payload = decode_access_token(token)
    faculty_id: str = payload.get("sub")
    user_type: str = payload.get("type")
    
    if faculty_id is None or user_type != "faculty":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if faculty is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Faculty not found",
        )
    return faculty

    
    async def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Admin:
    payload = decode_access_token(token)
    admin_id: str = payload.get("sub")
    if admin_id is None or payload.get("type") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin account not found")
    return admin


# =========================================================================
# AUTHENTICATION ENDPOINTS
# =========================================================================

@app.post("/api/auth/student-login", response_model=TokenResponse)
def student_login(credentials: StudentLogin, db: Session = Depends(get_db)):
    """Student login endpoint with JWT token generation"""
    student = db.query(Student).filter(Student.email == credentials.email).first()
    
    if not student or not verify_password(credentials.password, student.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": student.id, "type": "student"},
        expires_delta=access_token_expires
    )
    
    logger.info(f"Student login successful: {student.email}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": StudentResponse.model_validate(student).model_dump()
    }


@app.post("/api/auth/faculty-login", response_model=TokenResponse)
def faculty_login(credentials: FacultyLogin, db: Session = Depends(get_db)):
    """Faculty login endpoint with JWT token generation"""
    faculty = db.query(Faculty).filter(Faculty.email == credentials.email).first()
    
    if not faculty or not verify_password(credentials.password, faculty.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": faculty.id, "type": "faculty"},
        expires_delta=access_token_expires
    )
    
    logger.info(f"Faculty login successful: {faculty.email}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": FacultyResponse.model_validate(faculty).model_dump()
    }


@app.post("/api/auth/student-register", response_model=TokenResponse)
def student_register(data: StudentRegister, db: Session = Depends(get_db)):
    """Student registration endpoint with password hashing"""
    # Check if email already exists
    existing = db.query(Student).filter(Student.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    avatar = "".join([n[0].upper() for n in data.name.split()])
    new_student = Student(
        name=data.name,
        email=data.email,
        hashed_password=get_password_hash(data.password),
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
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": new_student.id, "type": "student"},
        expires_delta=access_token_expires
    )
    
    logger.info(f"Student registration successful: {new_student.email}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": StudentResponse.model_validate(new_student).model_dump()
    }


@app.post("/api/auth/faculty-register", response_model=TokenResponse)
def faculty_register(data: FacultyRegister, db: Session = Depends(get_db)):
    """Faculty registration endpoint with password hashing"""
    existing = db.query(Faculty).filter(Faculty.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Generate initials for avatar
    avatar = "".join([n[0].upper() for n in data.name.split()]) if data.name else ""

    # Create and persist new faculty
    new_faculty = Faculty(
        name=data.name,
        email=data.email,
        hashed_password=get_password_hash(data.password),
        department=data.department,
        course=data.course,
        avatar=avatar
    )
    
    db.add(new_faculty)
    db.commit()
    db.refresh(new_faculty)
    
    # Generate access token
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(new_faculty.id), "type": "faculty"},
        expires_delta=access_token_expires
    )
    
    logger.info(f"Faculty registration successful: {new_faculty.email}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": FacultyResponse.model_validate(new_faculty).model_dump()
    }

@app.post("/api/auth/admin-login", response_model=TokenResponse)
def admin_login(credentials: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == credentials.email).first()
    if not admin or not verify_password(credentials.password, admin.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    access_token = create_access_token(
        data={"sub": str(admin.id), "type": "admin"},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes)
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": AdminResponse.model_validate(admin).model_dump()
    }

# =========================================================================
# STUDENT ENDPOINTS (Protected)
# =========================================================================

@app.get("/api/students/profile", response_model=StudentResponse)
def get_student_profile(
    current_student: Student = Depends(get_current_student)
):
    """Get current student's profile"""
    return StudentResponse.model_validate(current_student)


@app.get("/api/students/{student_id}/assignments")
def get_student_assignments(
    student_id: str,
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student)
):
    """Get all assignments for a student (optimized with joinedload)"""
    if current_student.id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this student's assignments"
        )
    
    # Use joinedload to prevent N+1 queries
    assignments = db.query(Assignment).options(
        joinedload(Assignment.faculty),
        joinedload(Assignment.submissions)
    ).all()
    
    result = []
    for asn in assignments:
        submission = next(
            (s for s in asn.submissions if s.student_id == student_id),
            None
        )
        
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
def get_student_attendance(
    student_id: str,
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student)
):
    """Get attendance records for a student"""
    if current_student.id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this student's attendance"
        )
    
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
def get_student_activities(
    student_id: str,
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student)
):
    """Get all activities for a student"""
    if current_student.id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this student's activities"
        )
    
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


@app.post("/api/students/{student_id}/activities", response_model=ActivityResponse)
def create_activity(
    student_id: str,
    data: ActivityCreate,
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student)
):
    """Create new activity for student"""
    if current_student.id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create activity for this student"
        )
    
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
    
    logger.info(f"Activity created for student {student_id}: {new_activity.title}")
    
    return ActivityResponse.model_validate(new_activity)


@app.get("/api/students/{student_id}/credits")
def get_student_credits(
    student_id: str,
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student)
):
    """Get credit transfer requests for a student"""
    if current_student.id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this student's credit transfers"
        )
    
    # Optimize with joinedload
    transfers = db.query(CreditTransfer).options(
        joinedload(CreditTransfer.student)
    ).filter(CreditTransfer.student_id == student_id).all()
    
    return [
        {
            "id": t.id,
            "studentId": t.student_id,
            "studentName": t.student.name,
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


@app.post("/api/students/{student_id}/credits", response_model=CreditTransferResponse)
def create_credit_transfer(
    student_id: str,
    data: CreditTransferCreate,
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student)
):
    """Submit credit transfer request"""
    if current_student.id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to submit credit transfer for this student"
        )
    
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
    
    logger.info(f"Credit transfer created for student {student_id}: {data.course}")
    
    return CreditTransferResponse(
        id=new_transfer.id,
        student_id=new_transfer.student_id,
        student_name=current_student.name,
        source_inst=new_transfer.source_inst,
        dest_inst=new_transfer.dest_inst,
        course=new_transfer.course,
        credits=new_transfer.credits,
        grade=new_transfer.grade,
        status=new_transfer.status,
        request_date=new_transfer.request_date.strftime("%Y-%m-%d")
    )


@app.post("/api/students/{student_id}/assignments/{assignment_id}/submit")
def submit_assignment(
    student_id: str,
    assignment_id: str,
    data: AssignmentSubmissionCreate,
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student)
):
    """Submit or update assignment submission"""
    if current_student.id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to submit assignments for this student"
        )
    
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
    
    logger.info(f"Assignment submitted by student {student_id}: {assignment_id}")
    
    return {
        "id": submission.id,
        "status": submission.status,
        "message": "Assignment submitted successfully"
    }


# =========================================================================
# FACULTY ENDPOINTS (Protected)
# =========================================================================

@app.get("/api/faculties/profile", response_model=FacultyResponse)
def get_faculty_profile(
    current_faculty: Faculty = Depends(get_current_faculty)
):
    """Get current faculty's profile"""
    return FacultyResponse.model_validate(current_faculty)


@app.post("/api/faculties/assignments", response_model=AssignmentResponse)
def create_assignment(
    data: AssignmentCreate,
    db: Session = Depends(get_db),
    current_faculty: Faculty = Depends(get_current_faculty)
):
    """Create new assignment"""
    new_assignment = Assignment(
        title=data.title,
        subject=data.subject,
        faculty_id=current_faculty.id,
        description=data.description,
        due_date=data.due_date,
        max_marks=data.max_marks
    )
    
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)
    
    logger.info(f"Assignment created by faculty {current_faculty.id}: {data.title}")
    
    return AssignmentResponse(
        id=new_assignment.id,
        title=new_assignment.title,
        subject=new_assignment.subject,
        faculty=current_faculty.name,
        description=new_assignment.description,
        due_date=new_assignment.due_date,
        status="Active",
        marks=None,
        feedback="",
        max_marks=new_assignment.max_marks
    )


@app.get("/api/faculties/assignments")
def get_faculty_assignments(
    db: Session = Depends(get_db),
    current_faculty: Faculty = Depends(get_current_faculty)
):
    """Get all assignments created by faculty"""
    assignments = db.query(Assignment).filter(
        Assignment.faculty_id == current_faculty.id
    ).all()
    
    return [
        {
            "id": asn.id,
            "title": asn.title,
            "subject": asn.subject,
            "faculty": current_faculty.name,
            "description": asn.description,
            "dueDate": asn.due_date,
            "status": "Active",
            "marks": "N/A",
            "feedback": "",
            "maxMarks": asn.max_marks
        }
        for asn in assignments
    ]


@app.get("/api/faculties/assignments/{assignment_id}/submissions")
def get_assignment_submissions(
    assignment_id: str,
    db: Session = Depends(get_db),
    current_faculty: Faculty = Depends(get_current_faculty)
):
    """Get all submissions for an assignment"""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    if assignment.faculty_id != current_faculty.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view submissions for this assignment"
        )
    
    # Optimize with joinedload
    submissions = db.query(AssignmentSubmission).options(
        joinedload(AssignmentSubmission.student)
    ).filter(AssignmentSubmission.assignment_id == assignment_id).all()
    
    return [
        {
            "id": sub.id,
            "studentId": sub.student_id,
            "studentName": sub.student.name,
            "status": sub.status,
            "marks": sub.marks,
            "feedback": sub.feedback,
            "submittedAt": sub.submitted_at.strftime("%Y-%m-%d %H:%M:%S") if sub.submitted_at else ""
        }
        for sub in submissions
    ]


@app.put("/api/faculties/submissions/{submission_id}/grade")
def grade_submission(
    submission_id: str,
    data: GradeSubmitRequest,
    db: Session = Depends(get_db),
    current_faculty: Faculty = Depends(get_current_faculty)
):
    """Grade a specific assignment submission"""
    submission = db.query(AssignmentSubmission).options(
        joinedload(AssignmentSubmission.assignment)
    ).filter(AssignmentSubmission.id == submission_id).first()
    
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    if submission.assignment.faculty_id != current_faculty.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to grade this submission"
        )
    
    submission.marks = data.marks
    submission.feedback = data.feedback
    submission.status = "Graded"
    
    db.commit()
    db.refresh(submission)
    
    logger.info(f"Submission graded by faculty {current_faculty.id}: {submission_id}")
    
    return {
        "id": submission.id,
        "status": submission.status,
        "marks": submission.marks,
        "feedback": submission.feedback
    }


@app.get("/api/faculties/students")
def get_faculty_students(
    db: Session = Depends(get_db),
    current_faculty: Faculty = Depends(get_current_faculty)
):
    """Get all students (for faculty view)"""
    students = db.query(Student).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "department": s.department,
            "cgpa": s.cgpa,
            "attendancePct": s.attendance_pct,
            "avatar": s.avatar
        }
        for s in students
    ]


# =========================================================================
# ADMIN ENDPOINTS (Protected)
# =========================================================================

@app.get("/api/admin/students")
def get_all_students(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """Get all students (admin only)"""
    payload = decode_access_token(token)
    if payload.get("type") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    students = db.query(Student).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "department": s.department,
            "cgpa": s.cgpa,
            "attendancePct": s.attendance_pct,
            "avatar": s.avatar
        }
        for s in students
    ]


@app.get("/api/admin/faculties")
def get_all_faculties(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """Get all faculties (admin only)"""
    payload = decode_access_token(token)
    if payload.get("type") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    faculties = db.query(Faculty).all()
    return [FacultyResponse.model_validate(f) for f in faculties]


@app.get("/api/admin/credit-transfers")
def get_all_credit_transfers(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """Get all pending credit transfers (admin only)"""
    payload = decode_access_token(token)
    if payload.get("type") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    transfers = db.query(CreditTransfer).options(
        joinedload(CreditTransfer.student)
    ).all()
    
    return [
        {
            "id": t.id,
            "studentId": t.student_id,
            "studentName": t.student.name,
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


@app.put("/api/admin/credit-transfers/{transfer_id}/approve")
def approve_credit_transfer(
    transfer_id: str,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """Approve credit transfer request"""
    payload = decode_access_token(token)
    if payload.get("type") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    transfer = db.query(CreditTransfer).filter(CreditTransfer.id == transfer_id).first()
    
    if not transfer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transfer not found"
        )
    
    transfer.status = "Approved"
    
    # Update student's total credits
    student = db.query(Student).filter(Student.id == transfer.student_id).first()
    if student:
        student.total_credits += transfer.credits
    
    db.commit()
    
    logger.info(f"Credit transfer approved: {transfer_id}")
    
    return {
        "id": transfer.id,
        "status": transfer.status,
        "message": "Credit transfer approved"
    }


@app.put("/api/admin/credit-transfers/{transfer_id}/reject")
def reject_credit_transfer(
    transfer_id: str,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """Reject credit transfer request"""
    payload = decode_access_token(token)
    if payload.get("type") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    transfer = db.query(CreditTransfer).filter(CreditTransfer.id == transfer_id).first()
    
    if not transfer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transfer not found"
        )
    
    transfer.status = "Rejected"
    db.commit()
    
    logger.info(f"Credit transfer rejected: {transfer_id}")
    
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
    return {
        "status": "operational",
        "message": "EduPulse ERP Backend is running",
        "version": settings.app_version
    }


# =========================================================================
# STARTUP & SHUTDOWN EVENTS
# =========================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    db_info = settings.database_url.split("@")[1] if "@" in settings.database_url else "unknown"
    logger.info(f"Database: {db_info}")
    logger.info(f"CORS Origins: {settings.cors_origins}")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info(f"Shutting down {settings.app_name}")
    engine.dispose()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )

@app.on_event("startup")
async def startup_event():
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    db = SessionLocal()
    try:
        admin_email = "admin@edupulse.com"
        if not db.query(Admin).filter(Admin.email == admin_email).first():
            db.add(Admin(
                name="System Administrator",
                email=admin_email,
                hashed_password=get_password_hash("Admin@123456")
            ))
            db.commit()
            logger.info("Default admin user created: admin@edupulse.com / Admin@123456")
    finally:
        db.close()


