/* ==========================================================================
   FARI STUDIO - FUTURISTIC INTERACTIVE ENGINE (VANILLA JS + THREE.JS)
   ========================================================================== */

'use strict';

/* ==========================================
   1. GLOBAL STATE & STORAGE ARCHITECTURE
   ========================================== */
const DEFAULT_PROJECTS = [
    {
        title: "سامانه متارورس آریا",
        category: "پلتفرم سه‌بعدی و تعاملی",
        description: "توسعه بستر واقعیت مجازی وب بر پایه WebGL و Three.js با معماری پیشرفته.",
        techs: ["HTML5", "Three.js", "WebGL", "CSS3"],
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
    },
    {
        title: "اپلیکیشن نئوبانک لوکس",
        category: "فین‌تک و وب‌اپلیکیشن",
        description: "طراحی رابط کاربری شیشه‌ای Glassmorphism با انیمیشن‌های روان و امنیت بالا.",
        techs: ["Vanilla JS", "Glass UI", "PWA"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
    },
    {
        title: "پورتال هولدینگ استارتاپ",
        category: "وب‌سایت شرکتی لوکس",
        description: "پیاده‌سازی انیمیشن‌های Scroll Reveal و گرافیک واکنش‌گرا برای برند بین‌المللی.",
        techs: ["HTML", "CSS Grids", "JavaScript"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
    }
];

const DEFAULT_SERVICES = [
    {
        icon: "🎨",
        title: "طراحی تجربیات لوکس (Luxury UI/UX)",
        description: "خلق زوایای بصری مدرن، Glassmorphism، تایپوگرافی اختصاصی و هماهنگی کامل فرم و عملکرد."
    },
    {
        icon: "🚀",
        title: "توسعه فرانت‌اند تعاملی سه‌بعدی",
        description: "پیاده‌سازی صحنه‌های سه‌بعدی تعاملی WebGL و Three.js بدون کاهش سرعت بارگذاری."
    },
    {
        icon: "⚡",
        title: "بهینه‌سازی کارایی فوق‌العاده",
        description: "رسیدن به امتیاز بالای ۹۵ در Lighthouse و بهینه‌سازی کدهای فرانت‌اند برای دستگاه‌های مختلف."
    }
];

// LocalStorage Helper Isolations (Backend Ready API Hooks)
const Storage = {
    getUsers: () => JSON.parse(localStorage.getItem('fari_users') || '[]'),
    saveUsers: (users) => localStorage.setItem('fari_users', JSON.stringify(users)),
    getCurrentUser: () => JSON.parse(localStorage.getItem('fari_current_user') || 'null'),
    setCurrentUser: (user) => localStorage.setItem('fari_current_user', JSON.stringify(user)),
    getProjects: () => JSON.parse(localStorage.getItem('fari_projects') || JSON.stringify(DEFAULT_PROJECTS)),
    saveProjects: (projects) => localStorage.setItem('fari_projects', JSON.stringify(projects)),
    getServices: () => JSON.parse(localStorage.getItem('fari_services') || JSON.stringify(DEFAULT_SERVICES)),
    saveServices: (services) => localStorage.setItem('fari_services', JSON.stringify(services))
};

/* ==========================================
   2. INITIALIZATION & APP ENTRY POINT
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initBackgroundCanvas();
    start3DHourglassLoading();
    initHeroCardInteraction();
    setupCodePlayground();
    checkExistingSession();
});

/* ==========================================
   3. MOUSE GLOW & INTERACTION ENGINE
   ========================================== */
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    window.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

function initHeroCardInteraction() {
    const card = document.getElementById('hero-interactive-card');
    if (!card) return;

    window.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.clientX) / 25;
        const yAxis = (window.innerHeight / 2 - e.clientY) / 25;
        card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
}

/* ==========================================
   4. THREE.JS 3D HOURGLASS LOADING ENGINE
   ========================================== */
let hourGlassScene, hourGlassCamera, hourGlassRenderer, hourGlassGroup;

function start3DHourglassLoading() {
    const container = document.getElementById('hourglass-canvas-container');
    if (!container) return;

    // Create Three.js Scene for Loading Screen
    hourGlassScene = new THREE.Scene();
    hourGlassCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    hourGlassCamera.position.z = 6;

    hourGlassRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    hourGlassRenderer.setSize(200, 200);
    container.appendChild(hourGlassRenderer.domElement);

    // Glass Hourglass Mesh Creation
    hourGlassGroup = new THREE.Group();

    const glassMaterial = new THREE.MeshPhongMaterial({
        color: 0xa78bfa,
        transparent: true,
        opacity: 0.6,
        shininess: 90
    });

    const cone1 = new THREE.Mesh(new THREE.ConeGeometry(1, 1.2, 16), glassMaterial);
    cone1.position.y = 0.6;
    cone1.rotation.x = Math.PI;

    const cone2 = new THREE.Mesh(new THREE.ConeGeometry(1, 1.2, 16), glassMaterial);
    cone2.position.y = -0.6;

    hourGlassGroup.add(cone1);
    hourGlassGroup.add(cone2);

    // Add Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 5);
    hourGlassScene.add(light);
    hourGlassScene.add(new THREE.AmbientLight(0x7c3aed, 0.8));

    hourGlassScene.add(hourGlassGroup);

    // Loading Progress Simulation
    let progress = 0;
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    const interval = setInterval(() => {
        progress += 2;
        progressBar.style.width = progress + '%';
        progressText.innerText = progress + '%';

        // Rotate Hourglass 3D Animation
        hourGlassGroup.rotation.y += 0.05;
        if (progress === 50) {
            hourGlassGroup.rotation.z = Math.PI; // Hourglass flip simulation
        }

        hourGlassRenderer.render(hourGlassScene, hourGlassCamera);

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(transitionFromLoadingToAuth, 600);
        }
    }, 40);
}

function transitionFromLoadingToAuth() {
    const loadingScreen = document.getElementById('loading-screen');
    const authScreen = document.getElementById('auth-screen');
    
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        authScreen.classList.remove('hidden');
    }, 800);
}

/* ==========================================
   5. BACKGROUND CANVAS PARTICLES ENGINE
   ========================================== */
function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = window.innerWidth < 600 ? 20 : 50; // Performance optimization for mobile

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 3 + 1,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            alpha: Math.random() * 0.5 + 0.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 58, 237, ${p.alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================
   6. FRONT-END AUTHENTICATION SYSTEM
   ========================================== */
function switchAuthMode(mode) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login-btn');
    const tabRegister = document.getElementById('tab-register-btn');
    const alertBox = document.getElementById('auth-alert');

    alertBox.classList.add('hidden');

    if (mode === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
    }
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        btn.innerText = '🔒';
    } else {
        input.type = 'password';
        btn.innerText = '👁';
    }
}

function showAuthAlert(msg, type) {
    const alertBox = document.getElementById('auth-alert');
    alertBox.innerText = msg;
    alertBox.className = `auth-alert ${type}`;
    alertBox.classList.remove('hidden');
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const pass = document.getElementById('reg-pass').value;

    if (!/^09\d{9}$/.test(phone)) {
        showAuthAlert('شماره همراه وارد شده معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)', 'error');
        return;
    }

    if (pass.length < 6) {
        showAuthAlert('رمز عبور باید حداقل ۶ کاراکتر باشد', 'error');
        return;
    }

    const users = Storage.getUsers();
    if (users.find(u => u.phone === phone)) {
        showAuthAlert('حساب کاربری با این شماره قبلاً ثبت شده است', 'error');
        return;
    }

    const newUser = { name, phone, pass, role: 'user' };
    users.push(newUser);
    Storage.saveUsers(users);
    Storage.setCurrentUser(newUser);

    showAuthAlert('ثبت‌نام با موفقیت انجام شد!', 'success');
    setTimeout(enterMainApplication, 800);
}

function handleLogin(e) {
    e.preventDefault();
    const phone = document.getElementById('login-phone').value.trim();
    const pass = document.getElementById('login-pass').value;

    // Hardcoded Admin Quick Access Backdoor Demo
    if (phone === '09000000000' && pass === 'admin123') {
        const adminUser = { name: 'مدیر سیستم', phone, role: 'admin' };
        Storage.setCurrentUser(adminUser);
        enterMainApplication();
        return;
    }

    const users = Storage.getUsers();
    const user = users.find(u => u.phone === phone && u.pass === pass);

    if (user) {
        Storage.setCurrentUser(user);
        enterMainApplication();
    } else {
        showAuthAlert('شماره همراه یا رمز عبور اشتباه است', 'error');
    }
}

function checkExistingSession() {
    const user = Storage.getCurrentUser();
    if (user) {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('auth-screen').classList.add('hidden');
        enterMainApplication();
    }
}

function enterMainApplication() {
    const authScreen = document.getElementById('auth-screen');
    const mainApp = document.getElementById('main-app');
    const user = Storage.getCurrentUser();

    authScreen.classList.add('hidden');
    mainApp.classList.remove('hidden');

    document.getElementById('user-display-name').innerText = user ? user.name : 'کاربر';

    // Show Admin Menu option if user is Admin
    if (user && (user.role === 'admin' || user.phone === '09000000000')) {
        document.getElementById('admin-nav-link').classList.remove('hidden');
    }

    renderPortfolioSlider();
    renderServicesList();
    renderAdminPanelData();
}

function handleLogout() {
    Storage.setCurrentUser(null);
    window.location.reload();
}

/* ==========================================
   7. NAVIGATION & ROUTING ENGINE
   ========================================== */
function navigateTo(targetSection) {
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach(sec => {
        if (sec.id === `section-${targetSection}`) {
            sec.classList.remove('hidden');
            sec.classList.add('active');
        } else {
            sec.classList.add('hidden');
            sec.classList.remove('active');
        }
    });

    navLinks.forEach(link => {
        if (link.dataset.target === targetSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================
   8. PORTFOLIO 3D SLIDER ENGINE
   ========================================== */
let currentSlideIndex = 0;

function renderPortfolioSlider() {
    const track = document.getElementById('slider-track');
    const pagination = document.getElementById('slider-pagination');
    const projects = Storage.getProjects();

    track.innerHTML = '';
    pagination.innerHTML = '';

    projects.forEach((proj, idx) => {
        // Build Card HTML
        const card = document.createElement('div');
        card.className = `slider-card ${idx === currentSlideIndex ? 'active' : (idx === currentSlideIndex - 1 ? 'prev' : 'next')}`;
        
        card.innerHTML = `
            <div class="project-img-wrapper">
                <img src="${proj.image}" alt="${proj.title}">
            </div>
            <div class="project-details">
                <div>
                    <span class="project-category">${proj.category}</span>
                    <h3 class="project-title">${proj.title}</h3>
                    <p class="project-desc">${proj.description}</p>
                </div>
                <div>
                    <div class="project-techs">
                        ${proj.techs.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                    </div>
                    <button class="btn btn-glass btn-sm" onclick="alert('پیش‌نمایش تعاملی پروژه به زودی فعال می‌شود.')">مشاهده پروژه</button>
                </div>
            </div>
        `;
        track.appendChild(card);

        // Build Pagination Dots
        const dot = document.createElement('div');
        dot.className = `dot ${idx === currentSlideIndex ? 'active' : ''}`;
        dot.onclick = () => jumpToSlide(idx);
        pagination.appendChild(dot);
    });
}

function rotateSlider(direction) {
    const projects = Storage.getProjects();
    currentSlideIndex = (currentSlideIndex + direction + projects.length) % projects.length;
    renderPortfolioSlider();
}

function jumpToSlide(index) {
    currentSlideIndex = index;
    renderPortfolioSlider();
}

/* ==========================================
   9. SERVICES RENDER ENGINE
   ========================================== */
function renderServicesList() {
    const container = document.getElementById('services-container');
    const services = Storage.getServices();

    container.innerHTML = services.map(s => `
        <div class="service-card">
            <div class="service-icon-box">${s.icon}</div>
            <h3>${s.title}</h3>
            <p>${s.description}</p>
        </div>
    `).join('');
}

/* ==========================================
   10. LIVE CODING PLAYGROUND ENGINE
   ========================================== */
const defaultCode = {
    html: `<div class="card">\n  <h2>سلام از استودیو فرعی! 🚀</h2>\n  <p>این یک پیش‌نمایش زنده از کد شماست.</p>\n  <button onclick="sayHello()">کلیک کنید</button>\n</div>`,
    css: `body {\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  background: #f3e8ff;\n}\n.card {\n  background: white;\n  padding: 24px;\n  border-radius: 16px;\n  box-shadow: 0 10px 25px rgba(0,0,0,0.1);\n  text-align: center;\n}\nbutton {\n  background: #7c3aed;\n  color: white;\n  border: none;\n  padding: 8px 16px;\n  border-radius: 8px;\n  cursor: pointer;\n}`,
    js: `function sayHello() {\n  alert('کد JavaScript شما با موفقیت اجرا شد!');\n}`
};

function setupCodePlayground() {
    document.getElementById('code-html').value = defaultCode.html;
    document.getElementById('code-css').value = defaultCode.css;
    document.getElementById('code-js').value = defaultCode.js;
    runLiveCode();
}

function switchCodeTab(type) {
    const tabs = document.querySelectorAll('.pg-tab');
    tabs.forEach(t => t.classList.remove('active'));
    
    document.getElementById('code-html').classList.add('hidden');
    document.getElementById('code-css').classList.add('hidden');
    document.getElementById('code-js').classList.add('hidden');

    document.getElementById(`code-${type}`).classList.remove('hidden');
    event.target.classList.add('active');
}

function runLiveCode() {
    const html = document.getElementById('code-html').value;
    const css = `<style>${document.getElementById('code-css').value}</style>`;
    const js = `<script>${document.getElementById('code-js').value}<\/script>`;

    const iframe = document.getElementById('live-preview-iframe');
    const previewDoc = iframe.contentDocument || iframe.contentWindow.document;

    previewDoc.open();
    previewDoc.write(html + css + js);
    previewDoc.close();
}

function resetPlaygroundCode() {
    setupCodePlayground();
}

function clearPlaygroundCode() {
    document.getElementById('code-html').value = '';
    document.getElementById('code-css').value = '';
    document.getElementById('code-js').value = '';
    runLiveCode();
}

function setPreviewDevice(mode) {
    const wrapper = document.getElementById('preview-frame-wrapper');
    const btns = document.querySelectorAll('.device-btn');
    
    btns.forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    if (mode === 'mobile') {
        wrapper.classList.add('mobile');
    } else {
        wrapper.classList.remove('mobile');
    }
}

/* ==========================================
   11. FRONT-END ADMIN PANEL ENGINE
   ========================================== */
function switchAdminTab(tabName) {
    const tabs = document.querySelectorAll('.admin-tab-content');
    const btns = document.querySelectorAll('.admin-menu-btn');

    tabs.forEach(t => t.classList.add('hidden'));
    btns.forEach(b => b.classList.remove('active'));

    document.getElementById(`admin-tab-${tabName}`).classList.remove('hidden');
    event.target.classList.add('active');
}

function renderAdminPanelData() {
    const projects = Storage.getProjects();
    const services = Storage.getServices();
    const users = Storage.getUsers();

    // Render Stats
    document.getElementById('stat-projects-count').innerText = projects.length;
    document.getElementById('stat-services-count').innerText = services.length;
    document.getElementById('stat-users-count').innerText = users.length + 1;

    // Render Admin Projects Table
    const projBody = document.getElementById('admin-projects-table-body');
    projBody.innerHTML = projects.map((p, i) => `
        <tr>
            <td>${p.title}</td>
            <td>${p.category}</td>
            <td>${p.techs.join(', ')}</td>
            <td>
                <button class="btn btn-glass btn-sm" onclick="deleteProject(${i})">حذف</button>
            </td>
        </tr>
    `).join('');

    // Render Admin Services Table
    const servBody = document.getElementById('admin-services-table-body');
    servBody.innerHTML = services.map((s, i) => `
        <tr>
            <td>${s.title}</td>
            <td>${s.description.substring(0, 30)}...</td>
            <td>
                <button class="btn btn-glass btn-sm" onclick="deleteService(${i})">حذف</button>
            </td>
        </tr>
    `).join('');
}

function deleteProject(index) {
    const projects = Storage.getProjects();
    projects.splice(index, 1);
    Storage.saveProjects(projects);
    renderPortfolioSlider();
    renderAdminPanelData();
}

function deleteService(index) {
    const services = Storage.getServices();
    services.splice(index, 1);
    Storage.saveServices(services);
    renderServicesList();
    renderAdminPanelData();
}

function openAddProjectModal() {
    document.getElementById('project-modal').classList.remove('hidden');
}

function closeProjectModal() {
    document.getElementById('project-modal').classList.add('hidden');
}

function saveProjectForm(e) {
    e.preventDefault();
    const title = document.getElementById('proj-input-title').value;
    const category = document.getElementById('proj-input-category').value;
    const description = document.getElementById('proj-input-desc').value;
    const techs = document.getElementById('proj-input-tech').value.split(',').map(t => t.trim());
    const image = document.getElementById('proj-input-img').value;

    const projects = Storage.getProjects();
    projects.push({ title, category, description, techs, image });
    Storage.saveProjects(projects);

    closeProjectModal();
    renderPortfolioSlider();
    renderAdminPanelData();
}
