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
      department: "Instrumentation Engineering",
      semester: 6,
      attendance: 88.5,
      cgpa: 3.82,
      cgpaTenPoint: 8.64,
      classRank: "Top 5%",
      pendingAssignments: 1,
      nepCredits: { earned: 88, required: 120, majorCore: 48, minorSubject: 16, multidisciplinary: 9, aec: 6, sec: 6, vac: 3 },
      currentExitEligibility: "Eligible for 3-Year Degree Exit at 120 Credits"
    },
    {
      id: "CU-IE-2026-002",
      name: "Arnab Das",
      email: "arnab.d@caluniv.ac.in",
      department: "Instrumentation Engineering",
      semester: 6,
      attendance: 92.1,
      cgpa: 3.91,
      cgpaTenPoint: 9.12,
      classRank: "Top 2%",
      pendingAssignments: 0,
      nepCredits: { earned: 92, required: 120, majorCore: 50, minorSubject: 18, multidisciplinary: 9, aec: 6, sec: 6, vac: 3 },
      currentExitEligibility: "Eligible for 3-Year Degree Exit at 120 Credits"
    },
    {
      id: "CU-IE-2026-003",
      name: "Priya Sharma",
      email: "priya.s@caluniv.ac.in",
      department: "Instrumentation Engineering",
      semester: 4,
      attendance: 79.4,
      cgpa: 3.45,
      cgpaTenPoint: 7.80,
      classRank: "Top 20%",
      pendingAssignments: 3,
      nepCredits: { earned: 60, required: 80, majorCore: 32, minorSubject: 12, multidisciplinary: 6, aec: 4, sec: 4, vac: 2 },
      currentExitEligibility: "Eligible for UG Diploma Exit at 80 Credits"
    },
    {
      id: "CU-IE-2026-004",
      name: "Rohan Basu",
      email: "rohan.b@caluniv.ac.in",
      department: "Instrumentation Engineering",
      semester: 4,
      attendance: 84.0,
      cgpa: 3.60,
      cgpaTenPoint: 8.10,
      classRank: "Top 15%",
      pendingAssignments: 2,
      nepCredits: { earned: 58, required: 80, majorCore: 30, minorSubject: 12, multidisciplinary: 6, aec: 4, sec: 4, vac: 2 },
      currentExitEligibility: "Eligible for UG Diploma Exit at 80 Credits"
    },
    {
      id: "CU-IE-2026-005",
      name: "Sneha Mukhopadhyay",
      email: "sneha.m@caluniv.ac.in",
      department: "Instrumentation Engineering",
      semester: 2,
      attendance: 95.0,
      cgpa: 3.98,
      cgpaTenPoint: 9.60,
      classRank: "Top 1%",
      pendingAssignments: 0,
      nepCredits: { earned: 28, required: 40, majorCore: 14, minorSubject: 6, multidisciplinary: 3, aec: 2, sec: 2, vac: 1 },
      currentExitEligibility: "Eligible for UG Certificate Exit at 40 Credits"
    },

    // --- DEPARTMENT 2: Chemical Engineering ---
    {
      id: "CU-CE-2026-001",
      name: "Aarav Mehta",
      email: "aarav.m@caluniv.ac.in",
      department: "Chemical Engineering",
      semester: 6,
      attendance: 91.0,
      cgpa: 3.88,
      cgpaTenPoint: 9.05,
      classRank: "Top 3%",
      pendingAssignments: 0,
      nepCredits: { earned: 90, required: 120, majorCore: 50, minorSubject: 16, multidisciplinary: 9, aec: 6, sec: 6, vac: 3 },
      currentExitEligibility: "Eligible for 3-Year Degree Exit at 120 Credits"
    },
    {
      id: "CU-CE-2026-002",
      name: "Diya Roy",
      email: "diya.r@caluniv.ac.in",
      department: "Chemical Engineering",
      semester: 6,
      attendance: 86.4,
      cgpa: 3.65,
      cgpaTenPoint: 8.30,
      classRank: "Top 12%",
      pendingAssignments: 1,
      nepCredits: { earned: 86, required: 120, majorCore: 46, minorSubject: 16, multidisciplinary: 9, aec: 6, sec: 6, vac: 3 },
      currentExitEligibility: "Eligible for 3-Year Degree Exit at 120 Credits"
    },
    {
      id: "CU-CE-2026-003",
      name: "Kabir Verma",
      email: "kabir.v@caluniv.ac.in",
      department: "Chemical Engineering",
      semester: 4,
      attendance: 82.0,
      cgpa: 3.50,
      cgpaTenPoint: 7.95,
      classRank: "Top 18%",
      pendingAssignments: 2,
      nepCredits: { earned: 62, required: 80, majorCore: 34, minorSubject: 12, multidisciplinary: 6, aec: 4, sec: 4, vac: 2 },
      currentExitEligibility: "Eligible for UG Diploma Exit at 80 Credits"
    },
    {
      id: "CU-CE-2026-004",
      name: "Meera Nair",
      email: "meera.n@caluniv.ac.in",
      department: "Chemical Engineering",
      semester: 4,
      attendance: 78.5,
      cgpa: 3.25,
      cgpaTenPoint: 7.30,
      classRank: "Top 35%",
      pendingAssignments: 3,
      nepCredits: { earned: 56, required: 80, majorCore: 30, minorSubject: 10, multidisciplinary: 6, aec: 4, sec: 4, vac: 2 },
      currentExitEligibility: "Eligible for UG Diploma Exit at 80 Credits"
    },
    {
      id: "CU-CE-2026-005",
      name: "Rishi Ghosh",
      email: "rishi.g@caluniv.ac.in",
      department: "Chemical Engineering",
      semester: 2,
      attendance: 89.2,
      cgpa: 3.72,
      cgpaTenPoint: 8.40,
      classRank: "Top 8%",
      pendingAssignments: 1,
      nepCredits: { earned: 30, required: 40, majorCore: 16, minorSubject: 6, multidisciplinary: 3, aec: 2, sec: 2, vac: 1 },
      currentExitEligibility: "Eligible for UG Certificate Exit at 40 Credits"
    },

    // --- DEPARTMENT 3: Computer Science & Engineering ---
    {
      id: "CU-CS-2026-001",
      name: "Siddharth Sen",
      email: "siddharth.s@caluniv.ac.in",
      department: "Computer Science & Engineering",
      semester: 6,
      attendance: 87.5,
      cgpa: 3.70,
      cgpaTenPoint: 8.35,
      classRank: "Top 10%",
      pendingAssignments: 1,
      nepCredits: { earned: 88, required: 120, majorCore: 48, minorSubject: 16, multidisciplinary: 9, aec: 6, sec: 6, vac: 3 },
      currentExitEligibility: "Eligible for 3-Year Degree Exit at 120 Credits"
    },
    {
      id: "CU-CS-2026-002",
      name: "Ishaan Bose",
      email: "ishaan.b@caluniv.ac.in",
      department: "Computer Science & Engineering",
      semester: 6,
      attendance: 94.0,
      cgpa: 3.95,
      cgpaTenPoint: 9.50,
      classRank: "Top 1%",
      pendingAssignments: 0,
      nepCredits: { earned: 94, required: 120, majorCore: 52, minorSubject: 18, multidisciplinary: 9, aec: 6, sec: 6, vac: 3 },
      currentExitEligibility: "On Track for 4-Year Honors with Research"
    },
    {
      id: "CU-CS-2026-003",
      name: "Tanvi Ganguly",
      email: "tanvi.g@caluniv.ac.in",
      department: "Computer Science & Engineering",
      semester: 4,
      attendance: 80.1,
      cgpa: 3.40,
      cgpaTenPoint: 7.70,
      classRank: "Top 25%",
      pendingAssignments: 2,
      nepCredits: { earned: 58, required: 80, majorCore: 30, minorSubject: 12, multidisciplinary: 6, aec: 4, sec: 4, vac: 2 },
      currentExitEligibility: "Eligible for UG Diploma Exit at 80 Credits"
    },
    {
      id: "CU-CS-2026-004",
      name: "Vikramaditya Paul",
      email: "vikram.p@caluniv.ac.in",
      department: "Computer Science & Engineering",
      semester: 4,
      attendance: 75.8,
      cgpa: 3.18,
      cgpaTenPoint: 7.05,
      classRank: "Top 40%",
      pendingAssignments: 4,
      nepCredits: { earned: 54, required: 80, majorCore: 28, minorSubject: 10, multidisciplinary: 6, aec: 4, sec: 4, vac: 2 },
      currentExitEligibility: "Eligible for UG Diploma Exit at 80 Credits"
    },
    {
      id: "CU-CS-2026-005",
      name: "Anushka Chakraborty",
      email: "anushka.c@caluniv.ac.in",
      department: "Computer Science & Engineering",
      semester: 2,
      attendance: 92.5,
      cgpa: 3.85,
      cgpaTenPoint: 8.90,
      classRank: "Top 4%",
      pendingAssignments: 0,
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
      coursesAssigned: ["IE-601: Analog Electronics (Major)", "IE-702: Process Control"],
      assignedStudentsCount: 5
    },
    {
      id: "FAC-IE-002",
      name: "Dr. A. Ghosh",
      email: "a.ghosh@caluniv.ac.in",
      designation: "Associate Professor",
      department: "Instrumentation Engineering",
      coursesAssigned: ["IE-602: Transducers & Sensors (Major)", "IE-603L: Prototyping Lab (SEC)"],
      assignedStudentsCount: 5
    },

    // --- Chemical Engineering Faculty ---
    {
      id: "FAC-CE-001",
      name: "Dr. R. N. Mukherjee",
      email: "rn.mukherjee@caluniv.ac.in",
      designation: "Professor & HOD",
      department: "Chemical Engineering",
      coursesAssigned: ["CE-601: Chemical Reaction Engineering", "CE-701: Mass Transfer"],
      assignedStudentsCount: 5
    },
    {
      id: "FAC-CE-002",
      name: "Dr. P. K. Seal",
      email: "pk.seal@caluniv.ac.in",
      designation: "Assistant Professor",
      department: "Chemical Engineering",
      coursesAssigned: ["CE-602: Fluid Mechanics", "CE-504L: Chemical Process Lab (SEC)"],
      assignedStudentsCount: 5
    },

    // --- Computer Science & Engineering Faculty ---
    {
      id: "FAC-CS-001",
      name: "Dr. S. K. Das",
      email: "sk.das@caluniv.ac.in",
      designation: "Professor & HOD",
      department: "Computer Science & Engineering",
      coursesAssigned: ["CS-601: Advanced Algorithms", "CS-703: Artificial Intelligence"],
      assignedStudentsCount: 5
    },
    {
      id: "FAC-CS-002",
      name: "Dr. M. Roy",
      email: "m.roy@caluniv.ac.in",
      designation: "Associate Professor",
      department: "Computer Science & Engineering",
      coursesAssigned: ["CS-602: Database Management Systems", "CS-502L: Web Dev & Cloud Lab (SEC)"],
      assignedStudentsCount: 5
    }
  ]
};
