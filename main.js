// =========================================================================
// API BASE CONFIGURATION
// =========================================================================
const API_BASE = 'https://temporary-sih-5.onrender.com/api';

// Helper function for global API handling
async function apiRequest(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.error(`API Error [${method} ${endpoint}]:`, err);
        alert(`Error: ${err.message}`);
        return null;
    }
}

// =========================================================================
// PROTOTYPE STATE MODEL
// =========================================================================
const state = {
    currentRole: 'student', // 'student' | 'faculty' | 'admin'
    authMode: 'login', // 'login' | 'register'
    currentUser: null,
    activeTab: 'home',

    // Database collections (Fetched dynamically from backend)
    students: [],
    faculties: [],
    assignments: [],
    attendanceRecords: [],
    activities: [],
    creditTransfers: []
};

// =========================================================================
// DATA FETCHERS
// =========================================================================
async function fetchCurrentUserData() {
    if (!state.currentUser) return;

    if (state.currentRole === 'student') {
        const [asn, att, act, trf] = await Promise.all([
            apiRequest(`/assignments?studentId=${state.currentUser.id}`),
            apiRequest(`/attendance?studentId=${state.currentUser.id}`),
            apiRequest(`/activities?studentId=${state.currentUser.id}`),
            apiRequest(`/credit-transfers?studentId=${state.currentUser.id}`)
        ]);
        if (asn) state.assignments = asn;
        if (att) state.attendanceRecords = att;
        if (act) state.activities = act;
        if (trf) state.creditTransfers = trf;
    } else if (state.currentRole === 'faculty') {
        const [asn, stu] = await Promise.all([
            apiRequest(`/assignments?facultyId=${state.currentUser.id}`),
            apiRequest('/students')
        ]);
        if (asn) state.assignments = asn;
        if (stu) state.students = stu;
    } else if (state.currentRole === 'admin') {
        const [stu, fac, trf] = await Promise.all([
            apiRequest('/students'),
            apiRequest('/faculties'),
            apiRequest('/credit-transfers')
        ]);
        if (stu) state.students = stu;
        if (fac) state.faculties = fac;
        if (trf) state.creditTransfers = trf;
    }
}

// =========================================================================
// INITIALIZATION & ROUTING
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    setAuthRole('student');
});

function setAuthRole(role) {
    state.currentRole = role;
    
    ['student', 'faculty', 'admin'].forEach(r => {
        const btn = document.getElementById(`tab-btn-${r}`);
        if (r === role) {
            btn.className = 'auth-tab py-2 text-xs sm:text-sm font-medium rounded-lg transition-all bg-blue-600 text-white shadow';
        } else {
            btn.className = 'auth-tab py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-400 hover:text-white transition-all';
        }
    });

    const titleMap = {
        student: 'Student Portal Access',
        faculty: 'Teacher / Faculty Portal Access',
        admin: 'Administrator Portal Access'
    };
    const hintMap = {
        student: 'STU202601 (Alex Morgan)',
        faculty: 'FAC101 (Dr. Robert Vance)',
        admin: 'ADMIN-01 (System Administrator)'
    };

    document.getElementById('auth-title').innerText = titleMap[role];
    document.getElementById('demo-account-label').innerText = hintMap[role];
    
    const extraFields = document.getElementById('reg-extra-fields');
    if (role === 'student') {
        extraFields.classList.remove('hidden');
    } else {
        extraFields.classList.add('hidden');
    }
}

function toggleAuthMode() {
    state.authMode = state.authMode === 'login' ? 'register' : 'login';
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const toggleBtn = document.getElementById('auth-toggle-btn');

    if (state.authMode === 'register') {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
        toggleBtn.innerText = 'Existing User? Login';
    } else {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
        toggleBtn.innerText = 'New Registration?';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const emailInput = document.querySelector('#login-form input[type="email"]')?.value;
    const passInput = document.querySelector('#login-form input[type="password"]')?.value;

    const res = await apiRequest('/auth/login', 'POST', {
        email: emailInput,
        password: passInput,
        role: state.currentRole
    });

    if (res && res.user) {
        state.currentUser = res.user;
    } else {
        // Demo fallback resolution from API
        if (state.currentRole === 'student') {
            const students = await apiRequest('/students');
            state.currentUser = students ? students[0] : { id: 'STU202601', name: 'Alex Morgan', email: 'alex.m@univ.edu', department: 'Computer Science', program: 'B.S. Software Engineering', semester: 6, cgpa: 3.82, totalCredits: 88, attendancePct: 88.5, avatar: 'AM' };
        } else if (state.currentRole === 'faculty') {
            const faculties = await apiRequest('/faculties');
            state.currentUser = faculties ? faculties[0] : { id: 'FAC101', name: 'Dr. Robert Vance', department: 'Computer Science', email: 'r.vance@univ.edu', course: 'CS302 - Algorithms', avatar: 'RV' };
        } else {
            state.currentUser = { name: 'System Administrator', email: 'admin@edupulse.edu', role: 'admin' };
        }
    }

    state.activeTab = state.currentRole === 'student' ? 'home' : 'dashboard';
    await launchApp();
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const dept = document.getElementById('reg-dept').value;

    const payload = {
        name,
        email,
        department: dept,
        role: state.currentRole
    };

    if (state.currentRole === 'student') {
        payload.program = document.getElementById('reg-program').value || 'B.S. General';
        payload.semester = parseInt(document.getElementById('reg-semester').value) || 1;
    }

    const newUser = await apiRequest('/auth/register', 'POST', payload);

    if (newUser) {
        state.currentUser = newUser;
        state.activeTab = state.currentRole === 'student' ? 'home' : 'dashboard';
        alert('Registration Successful! Redirecting to dashboard.');
        await launchApp();
    }
}

async function launchApp() {
    await fetchCurrentUserData();

    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app-header').classList.remove('hidden');
    document.getElementById('app-viewport').classList.remove('hidden');

    document.getElementById('role-badge').innerText = state.currentRole.toUpperCase();
    document.getElementById('header-user-name').innerText = state.currentUser.name;
    document.getElementById('header-user-sub').innerText = state.currentUser.department || 'Admin Office';
    document.getElementById('header-avatar').innerText = state.currentUser.avatar || 'AD';

    renderRoleNavigation();
    renderView();
    lucide.createIcons();
}

function handleLogout() {
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('app-header').classList.add('hidden');
    document.getElementById('app-viewport').classList.add('hidden');
    state.currentUser = null;
    state.authMode = 'login';
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

// =========================================================================
// NAVIGATION RENDERER
// =========================================================================
function renderRoleNavigation() {
    const nav = document.getElementById('role-nav');
    let tabs = [];

    if (state.currentRole === 'student') {
        tabs = [
            { id: 'home', label: 'Home Dashboard', icon: 'layout-dashboard' },
            { id: 'assignments', label: 'Assignments', icon: 'file-text' },
            { id: 'attendance', label: 'Attendance', icon: 'calendar-check' },
            { id: 'credits', label: 'Credits & Transfer', icon: 'award' },
            { id: 'activity', label: 'Activity Record', icon: 'activity' },
            { id: 'progress', label: 'Academic Progress', icon: 'line-chart' },
            { id: 'profile', label: 'Student Profile', icon: 'user' }
        ];
    } else if (state.currentRole === 'faculty') {
        tabs = [
            { id: 'dashboard', label: 'Faculty Dashboard', icon: 'layout-dashboard' },
            { id: 'assignments', label: 'Assignment Management', icon: 'file-edit' },
            { id: 'attendance', label: 'Mark Attendance', icon: 'check-square' },
            { id: 'students', label: 'Student Directory', icon: 'users' },
            { id: 'profile', label: 'Faculty Profile', icon: 'user-check' }
        ];
    } else if (state.currentRole === 'admin') {
        tabs = [
            { id: 'dashboard', label: 'Admin Overview', icon: 'layout-dashboard' },
            { id: 'students', label: 'Student Roster', icon: 'users' },
            { id: 'transfers', label: 'Credit Transfer Requests', icon: 'arrow-right-left' },
            { id: 'academics', label: 'Courses & Departments', icon: 'book-open' },
            { id: 'reports', label: 'System Analytics', icon: 'bar-chart-3' }
        ];
    }

    nav.innerHTML = tabs.map(tab => `
        <button onclick="switchTab('${tab.id}')" class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${state.activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}">
            <i data-lucide="${tab.icon}" class="w-4 h-4"></i>
            <span>${tab.label}</span>
        </button>
    `).join('');

    lucide.createIcons();
}

async function switchTab(tabId) {
    state.activeTab = tabId;
    await fetchCurrentUserData();
    renderRoleNavigation();
    renderView();
}

// =========================================================================
// VIEW SWITCHER & SCREEN RENDERERS
// =========================================================================
function renderView() {
    const container = document.getElementById('view-container');
    
    if (state.currentRole === 'student') {
        switch(state.activeTab) {
            case 'home': container.innerHTML = renderStudentDashboard(); break;
            case 'assignments': container.innerHTML = renderStudentAssignments(); break;
            case 'attendance': container.innerHTML = renderStudentAttendance(); break;
            case 'credits': container.innerHTML = renderStudentCredits(); break;
            case 'activity': container.innerHTML = renderStudentActivities(); break;
            case 'progress': container.innerHTML = renderStudentProgress(); break;
            case 'profile': container.innerHTML = renderStudentProfile(); break;
            default: container.innerHTML = renderStudentDashboard();
        }
    } else if (state.currentRole === 'faculty') {
        switch(state.activeTab) {
            case 'dashboard': container.innerHTML = renderFacultyDashboard(); break;
            case 'assignments': container.innerHTML = renderFacultyAssignments(); break;
            case 'attendance': container.innerHTML = renderFacultyAttendance(); break;
            case 'students': container.innerHTML = renderStudentDirectory(); break;
            case 'profile': container.innerHTML = renderFacultyProfile(); break;
            default: container.innerHTML = renderFacultyDashboard();
        }
    } else if (state.currentRole === 'admin') {
        switch(state.activeTab) {
            case 'dashboard': container.innerHTML = renderAdminDashboard(); break;
            case 'students': container.innerHTML = renderStudentDirectory(); break;
            case 'transfers': container.innerHTML = renderAdminTransfers(); break;
            case 'academics': container.innerHTML = renderAdminAcademics(); break;
            case 'reports': container.innerHTML = renderAdminReports(); break;
            default: container.innerHTML = renderAdminDashboard();
        }
    }
    lucide.createIcons();
}

// -------------------------------------------------------------------------
// STUDENT VIEWS
// -------------------------------------------------------------------------
function renderStudentDashboard() {
    const s = state.currentUser;
    const pendingAsn = state.assignments.filter(a => a.status === 'Pending').length;
    
    return `
        <div class="space-y-6">
            <div class="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-2xl font-bold">
                        ${s.avatar || 'ST'}
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold">Welcome back, ${s.name}!</h1>
                        <p class="text-blue-200 text-sm mt-0.5">${s.program || 'B.S.'} • Semester ${s.semester || 1} (${s.id})</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="switchTab('assignments')" class="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                        <i data-lucide="file-text" class="w-4 h-4"></i> View Assignments
                    </button>
                    <button onclick="switchTab('profile')" class="bg-white text-blue-900 hover:bg-blue-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                        Edit Profile
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div onclick="switchTab('attendance')" class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer">
                    <div class="flex justify-between items-center text-slate-500 mb-2">
                        <span class="text-xs font-semibold uppercase tracking-wider">Attendance</span>
                        <i data-lucide="calendar-check" class="w-5 h-5 text-emerald-600"></i>
                    </div>
                    <div class="text-2xl font-bold text-slate-800">${s.attendancePct || 0}%</div>
                    <div class="mt-2 w-full bg-slate-100 rounded-full h-2">
                        <div class="bg-emerald-500 h-2 rounded-full" style="width: ${s.attendancePct || 0}%"></div>
                    </div>
                    <p class="text-xs ${(s.attendancePct || 0) < 75 ? 'text-amber-600 font-semibold' : 'text-slate-500'} mt-2">
                        ${(s.attendancePct || 0) < 75 ? '⚠️ Warning: Below 75% limit' : 'Good standing overall'}
                    </p>
                </div>

                <div onclick="switchTab('progress')" class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer">
                    <div class="flex justify-between items-center text-slate-500 mb-2">
                        <span class="text-xs font-semibold uppercase tracking-wider">Academic CGPA</span>
                        <i data-lucide="award" class="w-5 h-5 text-blue-600"></i>
                    </div>
                    <div class="text-2xl font-bold text-slate-800">${s.cgpa || 'N/A'} / 4.00</div>
                    <p class="text-xs text-blue-600 font-medium mt-3">Class Rank: Top 5%</p>
                </div>

                <div onclick="switchTab('assignments')" class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer">
                    <div class="flex justify-between items-center text-slate-500 mb-2">
                        <span class="text-xs font-semibold uppercase tracking-wider">Pending Assignments</span>
                        <i data-lucide="clock" class="w-5 h-5 text-amber-500"></i>
                    </div>
                    <div class="text-2xl font-bold text-slate-800">${pendingAsn} Items</div>
                    <p class="text-xs text-amber-600 font-medium mt-3">Next due in 3 days</p>
                </div>

                <div onclick="switchTab('credits')" class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer">
                    <div class="flex justify-between items-center text-slate-500 mb-2">
                        <span class="text-xs font-semibold uppercase tracking-wider">Academic Credits</span>
                        <i data-lucide="book-open" class="w-5 h-5 text-indigo-600"></i>
                    </div>
                    <div class="text-2xl font-bold text-slate-800">${s.totalCredits || 0} / 120</div>
                    <div class="mt-2 w-full bg-slate-100 rounded-full h-2">
                        <div class="bg-indigo-600 h-2 rounded-full" style="width: ${((s.totalCredits || 0)/120)*100}%"></div>
                    </div>
                    <p class="text-xs text-slate-500 mt-2">${120 - (s.totalCredits || 0)} credits remaining</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-slate-800 flex items-center gap-2">
                            <i data-lucide="alert-circle" class="w-5 h-5 text-blue-600"></i>
                            Upcoming Deadlines
                        </h3>
                        <button onclick="switchTab('assignments')" class="text-xs text-blue-600 font-semibold hover:underline">View All</button>
                    </div>
                    <div class="space-y-3">
                        ${state.assignments.map(a => `
                            <div class="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-semibold text-slate-800">${a.title}</p>
                                    <p class="text-xs text-slate-500">${a.subject} • Due: ${a.dueDate}</p>
                                </div>
                                <span class="px-2.5 py-1 text-xs font-semibold rounded-full ${a.status==='Pending'?'bg-amber-100 text-amber-800':a.status==='Submitted'?'bg-blue-100 text-blue-800':'bg-emerald-100 text-emerald-800'}">
                                    ${a.status}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-slate-800 flex items-center gap-2">
                            <i data-lucide="activity" class="w-5 h-5 text-indigo-600"></i>
                            Recent Activity Record
                        </h3>
                        <button onclick="switchTab('activity')" class="text-xs text-blue-600 font-semibold hover:underline">View Timeline</button>
                    </div>
                    <div class="space-y-3">
                        ${state.activities.map(act => `
                            <div class="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-start justify-between">
                                <div>
                                    <p class="text-sm font-semibold text-slate-800">${act.title}</p>
                                    <p class="text-xs text-slate-500">${act.category} • ${act.date}</p>
                                </div>
                                <span class="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                                    ${act.certificateStatus}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderStudentAssignments() {
    return `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 class="text-xl font-bold text-slate-800">Assignment Tracker</h2>
                    <p class="text-slate-500 text-sm">View, submit, and track feedback for all active coursework.</p>
                </div>
                <div class="flex gap-2 w-full sm:w-auto">
                    <select id="asn-filter" onchange="filterStudentAssignments()" class="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                        <option value="ALL">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Graded">Graded</option>
                    </select>
                </div>
            </div>

            <div id="student-assignments-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${renderAssignmentCards(state.assignments)}
            </div>
        </div>
    `;
}

function renderAssignmentCards(list) {
    return list.map(a => `
        <div class="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between gap-4">
            <div>
                <div class="flex justify-between items-start gap-2 mb-2">
                    <span class="px-2.5 py-1 text-xs font-bold rounded-full ${
                        a.status==='Pending'?'bg-amber-100 text-amber-800':
                        a.status==='Submitted'?'bg-blue-100 text-blue-800':
                        a.status==='Late'?'bg-rose-100 text-rose-800':'bg-emerald-100 text-emerald-800'
                    }">${a.status}</span>
                    <span class="text-xs font-medium text-slate-500">Due: ${a.dueDate}</span>
                </div>
                <h3 class="font-bold text-slate-800 text-base mb-1">${a.title}</h3>
                <p class="text-xs font-semibold text-blue-600 mb-2">${a.subject} • ${a.faculty}</p>
                <p class="text-xs text-slate-600 line-clamp-2">${a.description}</p>
            </div>

            ${a.marks !== 'N/A' && a.marks ? `
                <div class="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                    <div class="flex justify-between font-bold text-slate-700">
                        <span>Grade / Marks:</span>
                        <span class="text-emerald-600">${a.marks}</span>
                    </div>
                    <p class="text-slate-500 mt-1 italic">"${a.feedback}"</p>
                </div>
            ` : ''}

            <button onclick="openSubmitModal('${a.id}')" class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2">
                <i data-lucide="${a.status==='Pending'?'upload-cloud':'eye'}" class="w-4 h-4"></i>
                <span>${a.status==='Pending' ? 'Submit Work' : 'View Submission Details'}</span>
            </button>
        </div>
    `).join('');
}

function filterStudentAssignments() {
    const val = document.getElementById('asn-filter').value;
    const filtered = val === 'ALL' ? state.assignments : state.assignments.filter(a => a.status === val);
    document.getElementById('student-assignments-list').innerHTML = renderAssignmentCards(filtered);
    lucide.createIcons();
}

function openSubmitModal(asnId) {
    const asn = state.assignments.find(a => a.id === asnId);
    if (!asn) return;
    openModal(`
        <div class="space-y-4">
            <div class="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 class="font-bold text-lg text-slate-800">${asn.title}</h3>
                <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            <p class="text-xs text-slate-500">${asn.subject} • Faculty: ${asn.faculty}</p>
            <div class="bg-slate-50 p-3 rounded-lg text-xs text-slate-700 space-y-1">
                <p class="font-semibold">Instructions:</p>
                <p>${asn.description}</p>
            </div>

            ${asn.status === 'Pending' ? `
                <form onsubmit="submitAssignment(event, '${asn.id}')" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Upload Submission File</label>
                        <div class="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                            <i data-lucide="file-up" class="w-8 h-8 mx-auto text-blue-500 mb-2"></i>
                            <p class="text-xs text-slate-600 font-medium">Click to browse or drag and drop assignment file (.pdf, .zip)</p>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Student Comments</label>
                        <textarea id="asn-comment" class="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Add optional comments for faculty..."></textarea>
                    </div>
                    <button type="submit" class="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg text-xs hover:bg-blue-700 transition-colors">Confirm & Upload Assignment</button>
                </form>
            ` : `
                <div class="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-2">
                    <i data-lucide="check-circle-2" class="w-8 h-8 mx-auto text-emerald-600"></i>
                    <h4 class="font-bold text-emerald-900 text-sm">Assignment Submitted</h4>
                    <p class="text-xs text-emerald-700">Status: ${asn.status} | Marks: ${asn.marks || 'Pending'}</p>
                </div>
            `}
        </div>
    `);
}

async function submitAssignment(e, id) {
    e.preventDefault();
    const comment = document.getElementById('asn-comment')?.value || '';

    const res = await apiRequest(`/assignments/${id}/submit`, 'POST', {
        studentId: state.currentUser.id,
        comment: comment,
        status: 'Submitted'
    });

    if (res) {
        closeModal();
        await fetchCurrentUserData();
        renderView();
        alert('Assignment successfully uploaded and logged!');
    }
}

function renderStudentAttendance() {
    const overall = state.currentUser.attendancePct || 0;
    return `
        <div class="space-y-6">
            ${overall < 75 ? `
                <div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <i data-lucide="alert-triangle" class="w-6 h-6 text-amber-600"></i>
                        <div>
                            <h4 class="font-bold text-amber-900 text-sm">Low Attendance Warning</h4>
                            <p class="text-xs text-amber-700">Your current overall attendance is ${overall}%. Minimum required requirement is 75% for exam eligibility.</p>
                        </div>
                    </div>
                </div>
            ` : ''}

            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-xl font-bold text-slate-800">Attendance Monitoring</h2>
                        <p class="text-xs text-slate-500 mt-1">Course-wise breakdown and attendance records</p>
                    </div>
                    <div class="text-right">
                        <span class="text-2xl font-bold text-slate-800">${overall}%</span>
                        <p class="text-xs font-semibold text-emerald-600">Overall Average</p>
                    </div>
                </div>

                <div class="space-y-4">
                    ${state.attendanceRecords.map(r => `
                        <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div class="space-y-1">
                                <p class="font-bold text-slate-800 text-sm">${r.subject}</p>
                                <p class="text-xs text-slate-500">Classes Attended: ${r.attended} / ${r.totalClasses}</p>
                            </div>
                            <div class="flex items-center gap-4 w-full md:w-1/2">
                                <div class="flex-1">
                                    <div class="flex justify-between text-xs font-semibold mb-1">
                                        <span>Percentage</span>
                                        <span class="${r.pct < 75 ? 'text-amber-600' : 'text-emerald-600'}">${r.pct}%</span>
                                    </div>
                                    <div class="w-full bg-slate-200 rounded-full h-2.5">
                                        <div class="${r.pct < 75 ? 'bg-amber-500' : 'bg-emerald-500'} h-2.5 rounded-full" style="width: ${r.pct}%"></div>
                                    </div>
                                </div>
                                ${r.pct < 75 ? '<span class="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded">Low</span>' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderStudentCredits() {
    const transfers = state.creditTransfers.filter(t => t.studentId === state.currentUser.id);
    return `
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h2 class="text-xl font-bold text-slate-800">Academic Credits & HEI Transfer</h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="p-4 rounded-xl bg-blue-50 border border-blue-100">
                        <span class="text-xs text-blue-600 font-bold uppercase">Required Credits</span>
                        <p class="text-2xl font-bold text-blue-900 mt-1">120</p>
                    </div>
                    <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                        <span class="text-xs text-emerald-600 font-bold uppercase">Credits Completed</span>
                        <p class="text-2xl font-bold text-emerald-900 mt-1">${state.currentUser.totalCredits || 0}</p>
                    </div>
                    <div class="p-4 rounded-xl bg-slate-100 border border-slate-200">
                        <span class="text-xs text-slate-600 font-bold uppercase">Remaining</span>
                        <p class="text-2xl font-bold text-slate-800 mt-1">${120 - (state.currentUser.totalCredits || 0)}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-bold text-slate-800 text-lg">HEI Credit Transfer Requests</h3>
                    <button onclick="openCreditTransferModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                        <i data-lucide="plus" class="w-4 h-4"></i> Request HEI Transfer
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs text-slate-600">
                        <thead class="bg-slate-100 uppercase text-slate-700 font-bold">
                            <tr>
                                <th class="p-3">Source HEI</th>
                                <th class="p-3">Course Name</th>
                                <th class="p-3">Credits</th>
                                <th class="p-3">Grade</th>
                                <th class="p-3">Request Date</th>
                                <th class="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${transfers.map(t => `
                                <tr>
                                    <td class="p-3 font-semibold text-slate-800">${t.sourceInst}</td>
                                    <td class="p-3">${t.course}</td>
                                    <td class="p-3 font-bold">${t.credits}</td>
                                    <td class="p-3 font-bold text-blue-600">${t.grade}</td>
                                    <td class="p-3">${t.requestDate}</td>
                                    <td class="p-3">
                                        <span class="px-2 py-1 rounded text-xs font-bold ${
                                            t.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                            t.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                        }">${t.status}</span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function openCreditTransferModal() {
    openModal(`
        <div class="space-y-4">
            <div class="flex justify-between items-center border-b pb-3">
                <h3 class="font-bold text-lg text-slate-800">Request HEI Credit Transfer</h3>
                <button onclick="closeModal()"><i data-lucide="x" class="w-5 h-5 text-slate-400"></i></button>
            </div>
            <form onsubmit="submitCreditTransfer(event)" class="space-y-3 text-xs">
                <div>
                    <label class="block font-semibold mb-1">Source Institution (HEI)</label>
                    <input id="trf-source" required class="w-full p-2 border rounded-lg" placeholder="e.g., Stanford Online / External College">
                </div>
                <div>
                    <label class="block font-semibold mb-1">Course / Subject Name</label>
                    <input id="trf-course" required class="w-full p-2 border rounded-lg" placeholder="e.g., Data Structures">
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block font-semibold mb-1">Credits</label>
                        <input id="trf-credits" type="number" min="1" max="10" required class="w-full p-2 border rounded-lg" value="3">
                    </div>
                    <div>
                        <label class="block font-semibold mb-1">Grade Earned</label>
                        <input id="trf-grade" required class="w-full p-2 border rounded-lg" placeholder="A, B+, Pass">
                    </div>
                </div>
                <button type="submit" class="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Submit Request for Admin Approval</button>
            </form>
        </div>
    `);
}

async function submitCreditTransfer(e) {
    e.preventDefault();
    const payload = {
        studentId: state.currentUser.id,
        studentName: state.currentUser.name,
        sourceInst: document.getElementById('trf-source').value,
        destInst: 'EduPulse Univ',
        course: document.getElementById('trf-course').value,
        credits: parseInt(document.getElementById('trf-credits').value),
        grade: document.getElementById('trf-grade').value,
        status: 'Pending',
        requestDate: new Date().toISOString().split('T')[0]
    };

    const res = await apiRequest('/credit-transfers', 'POST', payload);
    if (res) {
        closeModal();
        await fetchCurrentUserData();
        renderView();
        alert('Transfer request submitted to academic registrar!');
    }
}

function renderStudentActivities() {
    return `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-xl font-bold text-slate-800">Comprehensive Student Activity Record</h2>
                    <p class="text-xs text-slate-500">Co-curricular achievements, workshops, and certifications</p>
                </div>
                <button onclick="openAddActivityModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <i data-lucide="plus" class="w-4 h-4"></i> Add Activity
                </button>
            </div>

            <div class="relative border-l-2 border-slate-200 pl-6 space-y-6 my-4">
                ${state.activities.map(act => `
                    <div class="relative">
                        <div class="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white"></div>
                        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                            <div class="flex justify-between items-start">
                                <h4 class="font-bold text-slate-800 text-sm">${act.title}</h4>
                                <span class="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">${act.category}</span>
                            </div>
                            <p class="text-xs font-medium text-slate-500">${act.organization} • ${act.date}</p>
                            <p class="text-xs text-slate-600 mt-2">${act.description}</p>
                            <div class="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                                <span class="text-emerald-600 font-semibold flex items-center gap-1">
                                    <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> ${act.certificateStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function openAddActivityModal() {
    openModal(`
        <div class="space-y-4">
            <div class="flex justify-between items-center border-b pb-3">
                <h3 class="font-bold text-lg text-slate-800">Log New Co-Curricular Activity</h3>
                <button onclick="closeModal()"><i data-lucide="x" class="w-5 h-5 text-slate-400"></i></button>
            </div>
            <form onsubmit="saveActivity(event)" class="space-y-3 text-xs">
                <div>
                    <label class="block font-semibold mb-1">Activity Title</label>
                    <input id="act-title" required class="w-full p-2 border rounded-lg" placeholder="e.g. AI Ethics Workshop">
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block font-semibold mb-1">Category</label>
                        <select id="act-cat" class="w-full p-2 border rounded-lg">
                            <option>Academic/Competition</option>
                            <option>Workshops</option>
                            <option>Internships</option>
                            <option>Extracurricular</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-semibold mb-1">Date</label>
                        <input id="act-date" type="date" required class="w-full p-2 border rounded-lg">
                    </div>
                </div>
                <div>
                    <label class="block font-semibold mb-1">Organization / Host</label>
                    <input id="act-org" required class="w-full p-2 border rounded-lg" placeholder="IEEE / ACM / University">
                </div>
                <div>
                    <label class="block font-semibold mb-1">Description</label>
                    <textarea id="act-desc" rows="3" class="w-full p-2 border rounded-lg"></textarea>
                </div>
                <button type="submit" class="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Add to Profile Record</button>
            </form>
        </div>
    `);
}

async function saveActivity(e) {
    e.preventDefault();
    const payload = {
        studentId: state.currentUser.id,
        title: document.getElementById('act-title').value,
        category: document.getElementById('act-cat').value,
        date: document.getElementById('act-date').value,
        organization: document.getElementById('act-org').value,
        description: document.getElementById('act-desc').value,
        certificateStatus: 'Pending Verification'
    };

    const res = await apiRequest('/activities', 'POST', payload);
    if (res) {
        closeModal();
        await fetchCurrentUserData();
        renderView();
    }
}

function renderStudentProgress() {
    return `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <h2 class="text-xl font-bold text-slate-800">Academic Progress & Analytics</h2>
            
            <div class="p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                <p class="text-xs font-bold text-slate-600 uppercase mb-4">CGPA Growth Trajectory (Semesters 1 - 6)</p>
                <div class="h-40 flex items-end justify-between gap-2 px-4">
                    <div class="flex-1 bg-blue-200 hover:bg-blue-500 rounded-t h-[75%] transition-all flex items-center justify-center text-xs font-bold text-blue-900">3.50</div>
                    <div class="flex-1 bg-blue-300 hover:bg-blue-500 rounded-t h-[80%] transition-all flex items-center justify-center text-xs font-bold text-blue-900">3.62</div>
                    <div class="flex-1 bg-blue-400 hover:bg-blue-500 rounded-t h-[85%] transition-all flex items-center justify-center text-xs font-bold text-white">3.70</div>
                    <div class="flex-1 bg-blue-500 hover:bg-blue-600 rounded-t h-[88%] transition-all flex items-center justify-center text-xs font-bold text-white">3.75</div>
                    <div class="flex-1 bg-blue-600 hover:bg-blue-700 rounded-t h-[92%] transition-all flex items-center justify-center text-xs font-bold text-white">3.80</div>
                    <div class="flex-1 bg-blue-700 hover:bg-blue-800 rounded-t h-[95%] transition-all flex items-center justify-center text-xs font-bold text-white">3.82</div>
                </div>
                <div class="flex justify-between text-xs text-slate-400 mt-2 px-2">
                    <span>Sem 1</span><span>Sem 2</span><span>Sem 3</span><span>Sem 4</span><span>Sem 5</span><span>Sem 6</span>
                </div>
            </div>
        </div>
    `;
}

function renderStudentProfile() {
    const s = state.currentUser;
    return `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-2xl mx-auto space-y-6">
            <div class="flex justify-between items-center border-b pb-4">
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center">
                        ${s.avatar || 'ST'}
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-slate-800">${s.name}</h2>
                        <p class="text-xs text-slate-500">${s.id} • ${s.department}</p>
                    </div>
                </div>
                <button onclick="alert('Profile edit mode enabled!')" class="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold">Edit Profile</button>
            </div>

            <div class="grid grid-cols-2 gap-4 text-xs">
                <div><span class="text-slate-400 block uppercase">Email</span><span class="font-semibold text-slate-800">${s.email}</span></div>
                <div><span class="text-slate-400 block uppercase">Phone</span><span class="font-semibold text-slate-800">${s.phone || 'N/A'}</span></div>
                <div><span class="text-slate-400 block uppercase">Program</span><span class="font-semibold text-slate-800">${s.program || 'N/A'}</span></div>
                <div><span class="text-slate-400 block uppercase">Semester</span><span class="font-semibold text-slate-800">${s.semester || 'N/A'}</span></div>
                <div><span class="text-slate-400 block uppercase">Enrollment Year</span><span class="font-semibold text-slate-800">${s.enrollmentYear || '2026'}</span></div>
                <div><span class="text-slate-400 block uppercase">Current CGPA</span><span class="font-semibold text-emerald-600">${s.cgpa || 'N/A'}</span></div>
            </div>
        </div>
    `;
}

// -------------------------------------------------------------------------
// FACULTY VIEWS
// -------------------------------------------------------------------------
function renderFacultyDashboard() {
    return `
        <div class="space-y-6">
            <div class="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
                <h1 class="text-2xl font-bold">Faculty Portal</h1>
                <p class="text-xs text-slate-400 mt-1">${state.currentUser.name} • ${state.currentUser.department}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div class="bg-white p-4 rounded-xl border border-slate-200">
                    <span class="text-slate-500 font-semibold">Total Assignments</span>
                    <p class="text-2xl font-bold text-slate-800 mt-1">${state.assignments.length}</p>
                </div>
                <div class="bg-white p-4 rounded-xl border border-slate-200">
                    <span class="text-slate-500 font-semibold">Pending Grading</span>
                    <p class="text-2xl font-bold text-amber-600 mt-1">${state.assignments.filter(a => a.status === 'Submitted').length}</p>
                </div>
                <div class="bg-white p-4 rounded-xl border border-slate-200">
                    <span class="text-slate-500 font-semibold">Course Enrolled</span>
                    <p class="text-2xl font-bold text-blue-600 mt-1">${state.students.length}</p>
                </div>
                <div class="bg-white p-4 rounded-xl border border-slate-200">
                    <span class="text-slate-500 font-semibold">Class Avg. Marks</span>
                    <p class="text-2xl font-bold text-emerald-600 mt-1">82%</p>
                </div>
            </div>
        </div>
    `;
}

function renderFacultyAssignments() {
    return `
        <div class="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-slate-800">Faculty Assignment Control</h2>
                <button onclick="openCreateAssignmentModal()" class="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg font-semibold flex items-center gap-1">
                    <i data-lucide="plus" class="w-4 h-4"></i> Create New Assignment
                </button>
            </div>

            <div class="space-y-4">
                ${state.assignments.map(a => `
                    <div class="p-4 border rounded-xl bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h4 class="font-bold text-slate-800 text-sm">${a.title}</h4>
                            <p class="text-xs text-slate-500">${a.subject} • Due: ${a.dueDate}</p>
                        </div>
                        <button onclick="openGradeModal('${a.id}')" class="px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg font-semibold">
                            Grade & Review Submissions
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function openCreateAssignmentModal() {
    openModal(`
        <div class="space-y-4">
            <div class="flex justify-between items-center border-b pb-3">
                <h3 class="font-bold text-lg text-slate-800">Create Course Assignment</h3>
                <button onclick="closeModal()"><i data-lucide="x" class="w-5 h-5 text-slate-400"></i></button>
            </div>
            <form onsubmit="saveNewAssignment(event)" class="space-y-3 text-xs">
                <div>
                    <label class="block font-semibold mb-1">Title</label>
                    <input id="asn-new-title" required class="w-full p-2 border rounded-lg">
                </div>
                <div>
                    <label class="block font-semibold mb-1">Subject / Course</label>
                    <input id="asn-new-subject" value="${state.currentUser.course || 'CS302'}" required class="w-full p-2 border rounded-lg">
                </div>
                <div>
                    <label class="block font-semibold mb-1">Due Date</label>
                    <input id="asn-new-date" type="date" required class="w-full p-2 border rounded-lg">
                </div>
                <div>
                    <label class="block font-semibold mb-1">Description / Prompt</label>
                    <textarea id="asn-new-desc" rows="3" required class="w-full p-2 border rounded-lg"></textarea>
                </div>
                <button type="submit" class="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Publish Assignment</button>
            </form>
        </div>
    `);
}

async function saveNewAssignment(e) {
    e.preventDefault();
    const payload = {
        title: document.getElementById('asn-new-title').value,
        subject: document.getElementById('asn-new-subject').value,
        faculty: state.currentUser.name,
        facultyId: state.currentUser.id,
        dueDate: document.getElementById('asn-new-date').value,
        description: document.getElementById('asn-new-desc').value,
        status: 'Pending',
        marks: 'N/A',
        feedback: ''
    };

    const res = await apiRequest('/assignments', 'POST', payload);
    if (res) {
        closeModal();
        await fetchCurrentUserData();
        renderView();
    }
}

function openGradeModal(asnId) {
    const asn = state.assignments.find(a => a.id === asnId);
    if (!asn) return;
    openModal(`
        <div class="space-y-4 text-xs">
            <h3 class="font-bold text-base text-slate-800">Grade Assignment: ${asn.title}</h3>
            <form onsubmit="saveGrade(event, '${asn.id}')" class="space-y-3">
                <div>
                    <label class="block font-semibold mb-1">Score / Marks</label>
                    <input id="grade-val" required class="w-full p-2 border rounded-lg" placeholder="e.g. 92/100">
                </div>
                <div>
                    <label class="block font-semibold mb-1">Faculty Feedback</label>
                    <textarea id="grade-feedback" rows="3" class="w-full p-2 border rounded-lg" placeholder="Enter constructive feedback..."></textarea>
                </div>
                <button type="submit" class="w-full py-2 bg-emerald-600 text-white font-semibold rounded-lg">Save Grade</button>
            </form>
        </div>
    `);
}

async function saveGrade(e, id) {
    e.preventDefault();
    const payload = {
        marks: document.getElementById('grade-val').value,
        feedback: document.getElementById('grade-feedback').value,
        status: 'Graded'
    };

    const res = await apiRequest(`/assignments/${id}/grade`, 'PATCH', payload);
    if (res) {
        closeModal();
        await fetchCurrentUserData();
        renderView();
    }
}

function renderFacultyAttendance() {
    return `
        <div class="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h2 class="text-xl font-bold text-slate-800">Register Class Attendance</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-100 font-bold uppercase">
                        <tr>
                            <th class="p-3">Student Name</th>
                            <th class="p-3">ID</th>
                            <th class="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${state.students.map(s => `
                            <tr>
                                <td class="p-3 font-semibold">${s.name}</td>
                                <td class="p-3">${s.id}</td>
                                <td class="p-3">
                                    <button onclick="toggleStudentAttendance('${s.id}')" class="px-3 py-1 rounded text-xs font-bold ${s.attendancePct < 75 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">
                                        Mark Present / Absent
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

async function toggleStudentAttendance(id) {
    const s = state.students.find(st => st.id === id);
    if (!s) return;
    const newPct = s.attendancePct >= 90 ? 70.0 : 95.0;

    const res = await apiRequest(`/students/${id}/attendance`, 'PATCH', { attendancePct: newPct });
    if (res) {
        s.attendancePct = newPct;
        renderView();
    }
}

function renderFacultyProfile() {
    return `<div class="p-6 bg-white rounded-2xl border text-xs font-semibold">Faculty Profile Details: ${state.currentUser.name} (${state.currentUser.department})</div>`;
}

// -------------------------------------------------------------------------
// ADMIN VIEWS
// -------------------------------------------------------------------------
function renderAdminDashboard() {
    return `
        <div class="space-y-6">
            <div class="bg-slate-900 text-white rounded-2xl p-6">
                <h1 class="text-2xl font-bold">University ERP Administration</h1>
                <p class="text-xs text-slate-400">Institutional metrics and policy management platform</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div class="bg-white p-4 rounded-xl border border-slate-200">
                    <span class="text-slate-500 font-semibold">Total Active Students</span>
                    <p class="text-2xl font-bold text-blue-600 mt-1">${state.students.length}</p>
                </div>
                <div class="bg-white p-4 rounded-xl border border-slate-200">
                    <span class="text-slate-500 font-semibold">Pending HEI Transfers</span>
                    <p class="text-2xl font-bold text-amber-600 mt-1">${state.creditTransfers.filter(t=>t.status==='Pending').length}</p>
                </div>
                <div class="bg-white p-4 rounded-xl border border-slate-200">
                    <span class="text-slate-500 font-semibold">Faculty Roster</span>
                    <p class="text-2xl font-bold text-emerald-600 mt-1">${state.faculties.length}</p>
                </div>
                <div class="bg-white p-4 rounded-xl border border-slate-200">
                    <span class="text-slate-500 font-semibold">System Health</span>
                    <p class="text-2xl font-bold text-indigo-600 mt-1">100% Operational</p>
                </div>
            </div>
        </div>
    `;
}

function renderStudentDirectory() {
    return `
        <div class="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h2 class="text-xl font-bold text-slate-800">Comprehensive Student Roster</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-100 font-bold uppercase">
                        <tr>
                            <th class="p-3">Student Name</th>
                            <th class="p-3">ID</th>
                            <th class="p-3">Dept</th>
                            <th class="p-3">CGPA</th>
                            <th class="p-3">Attendance</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${state.students.map(s => `
                            <tr>
                                <td class="p-3 font-semibold">${s.name}</td>
                                <td class="p-3">${s.id}</td>
                                <td class="p-3">${s.department}</td>
                                <td class="p-3 font-bold text-blue-600">${s.cgpa || 'N/A'}</td>
                                <td class="p-3">
                                    <span class="${(s.attendancePct || 0) < 75 ? 'text-amber-600 font-bold' : 'text-slate-700'}">${s.attendancePct || 0}%</span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderAdminTransfers() {
    return `
        <div class="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h2 class="text-xl font-bold text-slate-800">Review HEI Credit Transfer Applications</h2>
            <div class="space-y-3">
                ${state.creditTransfers.map(t => `
                    <div class="p-4 border rounded-xl bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                        <div>
                            <p class="font-bold text-slate-800">${t.studentName} (${t.studentId})</p>
                            <p class="text-slate-500">${t.course} • ${t.credits} Credits from ${t.sourceInst}</p>
                            <p class="text-blue-600 font-semibold mt-1">Grade: ${t.grade}</p>
                        </div>
                        <div class="flex gap-2">
                            ${t.status === 'Pending' ? `
                                <button onclick="updateTransferStatus('${t.id}', 'Approved')" class="px-3 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg">Approve</button>
                                <button onclick="updateTransferStatus('${t.id}', 'Rejected')" class="px-3 py-1.5 bg-rose-600 text-white font-semibold rounded-lg">Reject</button>
                            ` : `
                                <span class="px-3 py-1 rounded font-bold ${t.status==='Approved'?'bg-emerald-100 text-emerald-800':'bg-rose-100 text-rose-800'}">${t.status}</span>
                            `}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

async function updateTransferStatus(id, status) {
    const res = await apiRequest(`/credit-transfers/${id}`, 'PATCH', { status });
    if (res) {
        await fetchCurrentUserData();
        renderView();
    }
}

function renderAdminAcademics() {
    return `<div class="p-6 bg-white rounded-2xl border text-xs font-semibold">Academic Program Management Panel</div>`;
}

function renderAdminReports() {
    return `<div class="p-6 bg-white rounded-2xl border text-xs font-semibold">Institutional Analytics & System Reports</div>`;
}

// =========================================================================
// UTILITY FUNCTIONS (MODALS & HELPERS)
// =========================================================================
function openModal(contentHtml) {
    const modal = document.getElementById('modal-backdrop');
    const body = document.getElementById('modal-content');
    body.innerHTML = contentHtml;
    modal.classList.remove('hidden');
    lucide.createIcons();
}

function closeModal() {
    document.getElementById('modal-backdrop').classList.add('hidden');
}
