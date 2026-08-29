// src/data/database.js

export const database = {
  // Application Config
  appConfig: {
    systemName: "Amphilearn ERP",
    portalType: "STUDENT PORTAL",
    academicFramework: "NEP 2020 Credit Engine",
    institution: "Calcutta University",
    department: "Faculty of Engineering & Technology",
    version: "v2.6.0-NEP"
  },

  // NEP 2020 Credit Framework Rules
  nepFramework: {
    degreeTitle: "4-Year B.Tech. Honors with Research",
    totalTargetCredits: 160,
    exitOptions: [
      { level: "UG Certificate", minCredits: 40, duration: "1 Year" },
      { level: "UG Diploma", minCredits: 80, duration: "2 Years" },
      { level: "3-Year B.Sc./B.Tech. Degree", minCredits: 120, duration: "3 Years" },
      { level: "4-Year B.Tech. Honors with Research", minCredits: 160, duration: "4 Years" }
    ]
  },

  // 15 NEP-Aligned Student Records (5 per Department)
  students: [
    // --- DEPARTMENT 1: Instrumentation Engineering ---
    {
      id: "CU-IE-2026-001",
      name: "Alex Morgan",
      email: "alex.m@caluniv.ac.in",
      phone: "+91 98765 43210",
      department: "Instrumentation Engineering",
      program: "B.Tech in Instrumentation Engineering",
      enrollmentYear: 2023,
      semester: 6,
      attendance: 88.5,
      cgpa: 3.82,
      cgpaTenPoint: 8.64,
      classRank: "Top 5%",
      pendingAssignments: 1,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      nepCredits: { earned: 88, required: 120, majorCore: 48, minorSubject: 16, multidisciplinary: 9, aec: 6, sec: 6, vac: 3 },
      currentExitEligibility: "Eligible for 3-Year Degree Exit at 120 Credits"
    },
    {
      id: "CU-IE-2026-002",
      name: "Arnab Das",
      email: "arnab.d@caluniv.ac.in",
      phone: "+91 98765 43211",
      department: "Instrumentation Engineering",
      program: "B.Tech in Instrumentation Engineering",
      enrollmentYear: 2023,
      semester: 6,
      attendance: 92.1,
      cgpa: 3.91,
      cgpaTenPoint: 9.12,
      classRank: "Top 2%",
      pendingAssignments: 0,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
      nepCredits: { earned: 92, required: 120, majorCore: 50, minorSubject: 18, multidisciplinary: 9, aec: 6, sec: 6, vac: 3 },
      currentExitEligibility: "Eligible for 3-Year Degree Exit at 120 Credits"
    },
    {
      id: "CU-IE-2026-003",
      name: "Priya Sharma",
      email: "priya.s@caluniv.ac.in",
      phone: "+91 98765 43212",
      department: "Instrumentation Engineering",
      program: "B.Tech in Instrumentation Engineering",
      enrollmentYear: 2024,
      semester: 4,
      attendance: 79.4,
      cgpa: 3.45,
      cgpaTenPoint: 7.80,
      classRank: "Top 20%",
      pendingAssignments: 3,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
      nepCredits: { earned: 60, required: 80, majorCore: 32, minorSubject: 12, multidisciplinary: 6, aec: 4, sec: 4, vac: 2 },
      currentExitEligibility: "Eligible for UG Diploma Exit at 80 Credits"
    },
    {
      id: "CU-IE-2026-004",
      name: "Rohan Basu",
      email: "rohan.b@caluniv.ac.in",
      phone: "+91 98765 43213",
      department: "Instrumentation Engineering",
      program: "B.Tech in Instrumentation Engineering",
      enrollmentYear: 2024,
      semester: 4,
      attendance: 84.0,
      cgpa: 3.60,
      cgpaTenPoint: 8.10,
      classRank: "Top 15%",
      pendingAssignments: 2,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
      nepCredits: { earned: 58, required: 80, majorCore: 30, minorSubject: 12, multidisciplinary: 6, aec: 4, sec: 4, vac: 2 },
      currentExitEligibility: "Eligible for UG Diploma Exit at 80 Credits"
    },
    {
      id: "CU-IE-2026-005",
      name: "Sneha Mukhopadhyay",
      email: "sneha.m@caluniv.ac.in",
      phone: "+91 98765 43214",
      department: "Instrumentation Engineering",
      program: "B.Tech in Instrumentation Engineering",
      enrollmentYear: 2025,
      semester: 2,
      attendance: 95.0,
      cgpa: 3.98,
      cgpaTenPoint: 9.60,
      classRank: "Top 1%",
      pendingAssignments: 0,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=250",
      nepCredits: { earned: 28, required: 40, majorCore: 14, minorSubject: 6, multidisciplinary: 3, aec: 2, sec: 2, vac: 1 },
      currentExitEligibility: "Eligible for UG Certificate Exit at 40 Credits"
    },

    // --- DEPARTMENT 2: Chemical Engineering ---
    {
      id: "CU-CE-2026-001",
      name: "Aarav Mehta",
      email: "aarav.m@caluniv.ac.in",
      phone: "+91 98765 43215",
      department: "Chemical Engineering",
      program: "B.Tech in Chemical Engineering",
      enrollmentYear: 2023,
      semester: 6,
      attendance: 91.0,
      cgpa: 3.88,
      cgpaTenPoint: 9.05,
      classRank: "Top 3%",
      pendingAssignments: 0,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250",
      nepCredits: { earned: 90, required: 120, majorCore: 50, minorSubject: 16, multidisciplinary: 9, aec: 6, sec: 6, vac: 3 },
      currentExitEligibility: "Eligible for 3-Year Degree Exit at 120 Credits"
    },
    {
      id: "CU-CE-2026-002",
      name: "Diya Roy",
      email: "diya.r@caluniv.ac.in",
      phone: "+91 98765 43216",
      department: "Chemical Engineering",
      program: "B.Tech in Chemical Engineering",
      enrollmentYear: 2023,
      semester: 6,
      attendance: 86.4,
      cgpa: 3.65,
      cgpaTenPoint: 8.30,
      classRank: "Top 12%",
      pendingAssignments: 1,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
      nepCredits: { earned: 86, required: 120, majorCore: 46, minorSubject: 16, multidisciplinary: 9, aec: 6, sec: 6, vac: 3 },
      currentExitEligibility: "Eligible for 3-Year Degree Exit at 120 Credits"
    },
    {
      id: "CU-CE-2026-003",
      name: "Kabir Verma",
      email: "kabir.v@caluniv.ac.in",
      phone: "+91 98765 43217",
      department: "Chemical Engineering",
      program: "B.Tech in Chemical Engineering",
      enrollmentYear: 2024,
      semester: 4,
      attendance: 82.0,
      cgpa: 3.50,
      cgpaTenPoint: 7.95,
      classRank: "Top 18%",
      pendingAssignments: 2,
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250",
      nepCredits: { earned: 62, required: 80, majorCore: 34, minorSubject: 12, multidisciplinary: 6, aec: 4, sec: 4, vac: 2 },
      currentExitEligibility: "Eligible for UG Diploma Exit at 80 Credits"
    },
    {
      id: "CU-CE-2026-004",
      name: "Meera Nair",
      email: "meera.n@caluniv.ac.in",
      phone: "+91 98765 43218",
      department: "Chemical Engineering",
      program: "B.Tech in Chemical Engineering",
      enrollmentYear: 2024,
      semester: 4,
      attendance: 78.5,
      cgpa: 3.25,
      cgpaTenPoint: 7.30,
      classRank: "Top 35%",
      pendingAssignments: 3,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
      nepCredits: { earned: 56, required: 80, majorCore: 30, minorSubject: 10, multidisciplinary: 6, aec: 4, sec: 4, vac: 2 },
      currentExitEligibility: "Eligible for UG Diploma Exit at 80 Credits"
    },
    {
      id: "CU-CE-2026-005",
      name: "Rishi Ghosh",
      email: "rishi.g@caluniv.ac.in",
      phone: "+91 98765 43219",
      department: "Chemical Engineering",
      program: "B.Tech in Chemical Engineering",
      enrollmentYear: 2025,
      semester: 2,
      attendance: 89.2,
      cgpa: 3.72,
      cgpaTenPoint: 8.40,
      classRank: "Top 8%",
      pendingAssignments: 1,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250",
      nepCredits: { earned: 30, required: 40, majorCore: 16, minorSubject: 6, multidisciplinary: 3, aec: 2, sec: 2, vac: 1 },
      currentExitEligibility: "Eligible for UG Certificate Exit at 40 Credits"
    },

    // --- DEPARTMENT 3: Computer Science & Engineering ---
    {
      id: "CU-CS-2026-001",
      name: "Siddharth Sen",
      email: "siddharth.s@caluniv.ac.in",
      phone: "+91 98765 43220",
      department: "Computer Science & Engineering",
      program: "B.Tech in Computer Science & Engineering",
      enrollmentYear: 2023,
      semester: 6,
      attendance: 87.5,
      cgpa: 3.70,
      cgpaTenPoint: 8.35,
      classRank: "Top 10%",
      pendingAssignments: 1,
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250",
      nepCredits: { earned: 88, required: 120, majorCore: 48, minorSubject: 16, multidisciplinary: 9, aec: 6, sec: 6, vac: 3 },
      currentExitEligibility: "Eligible for 3-Year Degree Exit at 120 Credits"
    },
    {
      id: "CU-CS-2026-002",
      name: "Ishaan Bose",
      email: "ishaan.b@caluniv.ac.in",
      phone: "+91 98765 43221",
      department: "Computer Science & Engineering",
      program: "B.Tech in Computer Science & Engineering",
      enrollmentYear: 2023,
      semester: 6,
      attendance: 94.0,
      cgpa: 3.95,
      cgpaTenPoint: 9.50,
      classRank: "Top 1%",
      pendingAssignments: 0,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250",
      nepCredits: { earned: 94, required: 120, majorCore: 52, minorSubject: 18, multidisciplinary: 9, aec: 6, sec: 6, vac: 3 },
      currentExitEligibility: "On Track for 4-Year Honors with Research"
    },
    {
      id: "CU-CS-2026-003",
      name: "Tanvi Ganguly",
      email: "tanvi.g@caluniv.ac.in",
      phone: "+91 98765 43222",
      department: "Computer Science & Engineering",
      program: "B.Tech in Computer Science & Engineering",
      enrollmentYear: 2024,
      semester: 4,
      attendance: 80.1,
      cgpa: 3.40,
      cgpaTenPoint: 7.70,
      classRank: "Top 25%",
      pendingAssignments: 2,
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250",
      nepCredits: { earned: 58, required: 80, majorCore: 30, minorSubject: 12, multidisciplinary: 6, aec: 4, sec: 4, vac: 2 },
      currentExitEligibility: "Eligible for UG Diploma Exit at 80 Credits"
    },
    {
      id: "CU-CS-2026-004",
      name: "Vikramaditya Paul",
      email: "vikram.p@caluniv.ac.in",
      phone: "+91 98765 43223",
      department: "Computer Science & Engineering",
      program: "B.Tech in Computer Science & Engineering",
      enrollmentYear: 2024,
      semester: 4,
      attendance: 75.8,
      cgpa: 3.18,
      cgpaTenPoint: 7.05,
      classRank: "Top 40%",
      pendingAssignments: 4,
      avatar: "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&q=80&w=250",
      nepCredits: { earned: 54, required: 80, majorCore: 28, minorSubject: 10, multidisciplinary: 6, aec: 4, sec: 4, vac: 2 },
      currentExitEligibility: "Eligible for UG Diploma Exit at 80 Credits"
    },
    {
      id: "CU-CS-2026-005",
      name: "Anushka Chakraborty",
      email: "anushka.c@caluniv.ac.in",
      phone: "+91 98765 43224",
      department: "Computer Science & Engineering",
      program: "B.Tech in Computer Science & Engineering",
      enrollmentYear: 2025,
      semester: 2,
      attendance: 92.5,
      cgpa: 3.85,
      cgpaTenPoint: 8.90,
      classRank: "Top 4%",
      pendingAssignments: 0,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      nepCredits: { earned: 28, required: 40, majorCore: 14, minorSubject: 6, multidisciplinary: 3, aec: 2, sec: 2, vac: 1 },
      currentExitEligibility: "Eligible for UG Certificate Exit at 40 Credits"
    }
  ],

  // Faculty Records (2 per Department)
  faculty: [
    // --- Instrumentation Engineering Faculty ---
    {
      id: "FAC-IE-001",
      name: "Dr. S. Banerjee",
      email: "s.banerjee@caluniv.ac.in",
      designation: "Professor & HOD",
      department: "Instrumentation Engineering",
      course: "IE-601: Analog Electronics (Major)",
      coursesAssigned: ["IE-601: Analog Electronics (Major)", "IE-702: Process Control"],
      assignedStudentsCount: 5,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250"
    },
    {
      id: "FAC-IE-002",
      name: "Dr. A. Ghosh",
      email: "a.ghosh@caluniv.ac.in",
      designation: "Associate Professor",
      department: "Instrumentation Engineering",
      course: "IE-602: Transducers & Sensors (Major)",
      coursesAssigned: ["IE-602: Transducers & Sensors (Major)", "IE-603L: Prototyping Lab (SEC)"],
      assignedStudentsCount: 5,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250"
    },

    // --- Chemical Engineering Faculty ---
    {
      id: "FAC-CE-001",
      name: "Dr. R. N. Mukherjee",
      email: "rn.mukherjee@caluniv.ac.in",
      designation: "Professor & HOD",
      department: "Chemical Engineering",
      course: "CE-601: Chemical Reaction Engineering",
      coursesAssigned: ["CE-601: Chemical Reaction Engineering", "CE-701: Mass Transfer"],
      assignedStudentsCount: 5,
      avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=250"
    },
    {
      id: "FAC-CE-002",
      name: "Dr. P. K. Seal",
      email: "pk.seal@caluniv.ac.in",
      designation: "Assistant Professor",
      department: "Chemical Engineering",
      course: "CE-602: Fluid Mechanics",
      coursesAssigned: ["CE-602: Fluid Mechanics", "CE-504L: Chemical Process Lab (SEC)"],
      assignedStudentsCount: 5,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250"
    },

    // --- Computer Science & Engineering Faculty ---
    {
      id: "FAC-CS-001",
      name: "Dr. S. K. Das",
      email: "sk.das@caluniv.ac.in",
      designation: "Professor & HOD",
      department: "Computer Science & Engineering",
      course: "CS-601: Advanced Algorithms",
      coursesAssigned: ["CS-601: Advanced Algorithms", "CS-703: Artificial Intelligence"],
      assignedStudentsCount: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250"
    },
    {
      id: "FAC-CS-002",
      name: "Dr. M. Roy",
      email: "m.roy@caluniv.ac.in",
      designation: "Associate Professor",
      department: "Computer Science & Engineering",
      course: "CS-602: Database Management Systems",
      coursesAssigned: ["CS-602: Database Management Systems", "CS-502L: Web Dev & Cloud Lab (SEC)"],
      assignedStudentsCount: 5,
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=250"
    }
  ],

  // Assignments Engine Collection
  assignments: [
    {
      id: "ASN-2026-001",
      title: "PID Controller System Design & Tuning",
      subject: "IE-601: Analog Electronics (Major)",
      faculty: "Dr. S. Banerjee",
      dueDate: "2026-09-15",
      description: "Design and simulate a closed-loop PID controller circuit for a thermal plant model using MATLAB or LTSpice.",
      status: "Pending",
      studentId: "CU-IE-2026-001",
      marks: null,
      maxMarks: 100,
      feedback: null
    },
    {
      id: "ASN-2026-002",
      title: "Smart Sensor Integration Lab Report",
      subject: "IE-602: Transducers & Sensors (Major)",
      faculty: "Dr. A. Ghosh",
      dueDate: "2026-08-20",
      description: "Interfacing piezoelectric sensors with microcontrollers and performing noise filtration analysis.",
      status: "Graded",
      studentId: "CU-IE-2026-001",
      marks: 92,
      maxMarks: 100,
      feedback: "Excellent signal calibration and clear frequency domain plots."
    },
    {
      id: "ASN-2026-003",
      title: "Non-Isothermal Reactor Design Analysis",
      subject: "CE-601: Chemical Reaction Engineering",
      faculty: "Dr. R. N. Mukherjee",
      dueDate: "2026-09-10",
      description: "Perform energy balance calculations for a continuous stirred-tank reactor (CSTR) undergoing exothermic decay.",
      status: "Submitted",
      studentId: "CU-CE-2026-002",
      marks: null,
      maxMarks: 50,
      feedback: "Pending review by faculty."
    },
    {
      id: "ASN-2026-004",
      title: "B+ Tree Indexing Implementation",
      subject: "CS-602: Database Management Systems",
      faculty: "Dr. M. Roy",
      dueDate: "2026-09-02",
      description: "Implement a disk-backed B+ Tree data structure in C++ or Python with support for range queries.",
      status: "Pending",
      studentId: "CU-CS-2026-001",
      marks: null,
      maxMarks: 100,
      feedback: null
    }
  ],

  // Subject-wise Attendance Breakdown Collection
  attendanceRecords: [
    {
      studentId: "CU-IE-2026-001",
      subject: "IE-601: Analog Electronics (Major)",
      totalClasses: 40,
      attended: 36,
      pct: 90.0
    },
    {
      studentId: "CU-IE-2026-001",
      subject: "IE-602: Transducers & Sensors (Major)",
      totalClasses: 35,
      attended: 30,
      pct: 85.7
    },
    {
      studentId: "CU-IE-2026-001",
      subject: "IE-603L: Prototyping Lab (SEC)",
      totalClasses: 20,
      attended: 18,
      pct: 90.0
    },
    {
      studentId: "CU-CS-2026-004",
      subject: "CS-601: Advanced Algorithms",
      totalClasses: 42,
      attended: 31,
      pct: 73.8
    }
  ],

  // Co-Curricular & Research Activity Collection
  activities: [
    {
      id: "ACT-2026-001",
      studentId: "CU-IE-2026-001",
      title: "1st Place - Smart Hardware Hackathon",
      category: "Co-Curricular / Technical",
      date: "2026-03-12",
      organization: "IIT Kharagpur TechFest",
      description: "Developed an IoT-enabled non-invasive glucose monitoring prototype using optical spectroscopy.",
      certificateStatus: "Verified"
    },
    {
      id: "ACT-2026-002",
      studentId: "CU-IE-2026-001",
      title: "IEEE Student Chapter Paper Presentation",
      category: "Research & Publication",
      date: "2026-01-25",
      organization: "IEEE Calcutta Section",
      description: "Presented research paper on MEMS accelerometer sensor drift compensation in industrial environments.",
      certificateStatus: "Verified"
    },
    {
      id: "ACT-2026-003",
      studentId: "CU-CS-2026-002",
      title: "Open Source ML Library Contributor",
      category: "Skill Enhancement (SEC)",
      date: "2026-05-18",
      organization: "PyTorch Ecosystem",
      description: "Optimized GPU memory allocation routines for sparse matrix transformations.",
      certificateStatus: "Pending Verification"
    }
  ],

  // HEI Credit Transfer Engine Collection (ABC / NEP Portal)
  creditTransfers: [
    {
      id: "TR-2026-001",
      studentId: "CU-IE-2026-001",
      studentName: "Alex Morgan",
      sourceInst: "NPTEL / IIT Madras",
      sourceInstitution: "NPTEL / IIT Madras",
      destInst: "Calcutta University",
      destinationInstitution: "Calcutta University",
      course: "Industrial Automation & Robotics",
      courseName: "Industrial Automation & Robotics",
      credits: 4,
      creditsRequested: 4,
      creditType: "Major Core",
      grade: "A+",
      gradeEarned: "A+",
      status: "Approved",
      requestDate: "2026-02-15"
    },
    {
      id: "TR-2026-002",
      studentId: "CU-CS-2026-003",
      studentName: "Tanvi Ganguly",
      sourceInst: "Jadavpur University",
      sourceInstitution: "Jadavpur University",
      destInst: "Calcutta University",
      destinationInstitution: "Calcutta University",
      course: "Cloud Computing Architectures",
      courseName: "Cloud Computing Architectures",
      credits: 3,
      creditsRequested: 3,
      creditType: "Skill Enhancement (SEC)",
      grade: "A",
      gradeEarned: "A",
      status: "Pending",
      requestDate: "2026-08-10"
    },
    {
      id: "TR-2026-003",
      studentId: "CU-CE-2026-002",
      studentName: "Diya Roy",
      sourceInst: "IIT Kharagpur (SWAYAM)",
      sourceInstitution: "IIT Kharagpur (SWAYAM)",
      destInst: "Calcutta University",
      destinationInstitution: "Calcutta University",
      course: "Environmental Risk Assessment",
      courseName: "Environmental Risk Assessment",
      credits: 3,
      creditsRequested: 3,
      creditType: "Multidisciplinary",
      grade: "B+",
      gradeEarned: "B+",
      status: "Rejected",
      requestDate: "2026-07-01"
    }
  ]
};
