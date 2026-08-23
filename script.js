/* ==========================================================================
   FARIBORZ PROGRAMMING STUDIO - INTERACTIVE ENGINE (VANILLA JS + THREE.JS)
   ========================================================================== */

'use strict';

/* ==========================================
   1. GLOBAL STATE & STORAGE ARCHITECTURE
   ========================================== */
const DEFAULT_PROJECTS = [
    {
        title: "سامانه متاورس آریا",
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
let debounceTimer = null;

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
    if (!glow) return;
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

    hourGlassScene = new THREE.Scene();
    hourGlassCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    hourGlassCamera.position.z = 6;

    hourGlassRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    hourGlassRenderer.setSize(200, 200);
    container.appendChild(hourGlassRenderer.domElement);

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

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 5);
    hourGlassScene.add(light);
    hourGlassScene.add(new THREE.AmbientLight(0x7c3aed, 0.8));

    hourGlassScene.add(hourGlassGroup);

    let progress = 0;
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    const interval = setInterval(() => {
        progress += 2;
        if (progressBar) progressBar.style.width = progress + '%';
        if (progressText) progressText.innerText = progress + '%';

        hourGlassGroup.rotation.y += 0.05;
        if (progress === 50) {
            hourGlassGroup.rotation.z = Math.PI;
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
    
    if (loadingScreen) loadingScreen.style.opacity = '0';
    setTimeout(() => {
        if (loadingScreen) loadingScreen.classList.add('hidden');
        if (authScreen) authScreen.classList.remove('hidden');
    }, 800);
}

/* ==========================================
   5. BACKGROUND CANVAS PARTICLES ENGINE
   ========================================== */
function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = window.innerWidth < 600 ? 20 : 50;

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

    if (alertBox) alertBox.classList.add('hidden');

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
    if (!alertBox) return;
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
        const loading = document.getElementById('loading-screen');
        const auth = document.getElementById('auth-screen');
        if (loading) loading.classList.add('hidden');
        if (auth) auth.classList.add('hidden');
        enterMainApplication();
    }
}

function enterMainApplication() {
    const authScreen = document.getElementById('auth-screen');
    const mainApp = document.getElementById('main-app');
    const user = Storage.getCurrentUser();

    if (authScreen) authScreen.classList.add('hidden');
    if (mainApp) mainApp.classList.remove('hidden');

    const nameDisplay = document.getElementById('user-display-name');
    if (nameDisplay) nameDisplay.innerText = user ? user.name : 'کاربر';

    if (user && (user.role === 'admin' || user.phone === '09000000000')) {
        const adminLink = document.getElementById('admin-nav-link');
        if (adminLink) adminLink.classList.remove('hidden');
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
    if (!track || !pagination) return;

    const projects = Storage.getProjects();

    track.innerHTML = '';
    pagination.innerHTML = '';

    projects.forEach((proj, idx) => {
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
    if (!container) return;
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
   10. LIVE CODING PLAYGROUND ENGINE (FIXED)
   ========================================== */
const defaultCode = {
    html: `<div class="card">\n  <h2>استودیوی برنامه‌نویسی فریبرز 🚀</h2>\n  <p>کد بنویسید و خروجی زنده را لحظه‌ای مشاهده کنید.</p>\n  <button onclick="sayHello()">کلیک کنید</button>\n</div>`,
    css: `body {\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n  background: #0f172a;\n  color: #ffffff;\n}\n.card {\n  background: rgba(255, 255, 255, 0.1);\n  padding: 32px;\n  border-radius: 20px;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.5);\n  text-align: center;\n  border: 1px solid rgba(255,255,255,0.2);\n}\nbutton {\n  background: #6366f1;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 8px;\n  cursor: pointer;\n  font-weight: bold;\n}`,
    js: `function sayHello() {\n  alert('به استودیوی برنامه‌نویسی فریبرز خوش آمدید!');\n}`
};

function setupCodePlayground() {
    const htmlEditor = document.getElementById('code-html');
    const cssEditor = document.getElementById('code-css');
    const jsEditor = document.getElementById('code-js');

    if (!htmlEditor || !cssEditor || !jsEditor) return;

    htmlEditor.value = defaultCode.html;
    cssEditor.value = defaultCode.css;
    jsEditor.value = defaultCode.js;

    // ثبت Listenerهای Input برای Live Sync همزمان با Debounce
    [htmlEditor, cssEditor, jsEditor].forEach(editor => {
        editor.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                runLiveCode();
            }, 400);
        });
    });

    runLiveCode();
}

function switchCodeTab(type, evt) {
    const tabs = document.querySelectorAll('.pg-tab');
    tabs.forEach(t => t.classList.remove('active'));

    const htmlEditor = document.getElementById('code-html');
    const cssEditor = document.getElementById('code-css');
    const jsEditor = document.getElementById('code-js');

    if (htmlEditor) htmlEditor.classList.add('hidden');
    if (cssEditor) cssEditor.classList.add('hidden');
    if (jsEditor) jsEditor.classList.add('hidden');

    const target = document.getElementById(`code-${type}`);
    if (target) target.classList.remove('hidden');

    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add('active');
    }
}

function runLiveCode() {
    const htmlEditor = document.getElementById('code-html');
    const cssEditor = document.getElementById('code-css');
    const jsEditor = document.getElementById('code-js');
    const iframe = document.getElementById('live-preview-iframe');

    if (!iframe || !htmlEditor || !cssEditor || !jsEditor) return;

    const html = htmlEditor.value;
    const css = cssEditor.value;
    const js = jsEditor.value;

    const combinedContent = `
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <style>
                #error-display-box {
                    display: none;
                    position: fixed;
                    bottom: 12px;
                    left: 12px;
                    right: 12px;
                    background: rgba(220, 38, 38, 0.95);
                    color: #ffffff;
                    padding: 10px 14px;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 12px;
                    z-index: 99999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    direction: ltr;
                    text-align: left;
                }
                ${css}
            </style>
        </head>
        <body>
            <div id="error-display-box"></div>
            ${html}

            <script>
                window.onerror = function(msg, url, line) {
                    const errBox = document.getElementById('error-display-box');
                    if (errBox) {
                        errBox.style.display = 'block';
                        errBox.innerText = '⚠️ Runtime Error (Line ' + line + '): ' + msg;
                    }
                    return true;
                };

                try {
                    ${js}
                } catch (err) {
                    const errBox = document.getElementById('error-display-box');
                    if (errBox) {
                        errBox.style.display = 'block';
                        errBox.innerText = '⚠️ JS Error: ' + err.message;
                    }
                }
            <\/script>
        </body>
        </html>
    `;

    iframe.srcdoc = combinedContent;
}

function resetPlaygroundCode() {
    setupCodePlayground();
}

function clearPlaygroundCode() {
    const htmlEditor = document.getElementById('code-html');
    const cssEditor = document.getElementById('code-css');
    const jsEditor = document.getElementById('code-js');

    if (htmlEditor) htmlEditor.value = '';
    if (cssEditor) cssEditor.value = '';
    if (jsEditor) jsEditor.value = '';

    runLiveCode();
}

function setPreviewDevice(mode, evt) {
    const wrapper = document.getElementById('preview-frame-wrapper');
    const btns = document.querySelectorAll('.device-btn');
    
    btns.forEach(b => b.classList.remove('active'));
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add('active');
    }

    if (wrapper) {
        if (mode === 'mobile') {
            wrapper.classList.add('mobile-view');
        } else {
            wrapper.classList.remove('mobile-view');
        }
    }
}

/* ==========================================
   11. FRONT-END ADMIN PANEL ENGINE
   ========================================== */
function switchAdminTab(tabName, evt) {
    const tabs = document.querySelectorAll('.admin-tab-content');
    const btns = document.querySelectorAll('.admin-menu-btn');

    tabs.forEach(t => t.classList.add('hidden'));
    btns.forEach(b => b.classList.remove('active'));

    const targetTab = document.getElementById(`admin-tab-${tabName}`);
    if (targetTab) targetTab.classList.remove('hidden');

    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add('active');
    }
}

function renderAdminPanelData() {
    const projects = Storage.getProjects();
    const services = Storage.getServices();
    const users = Storage.getUsers();

    const pStat = document.getElementById('stat-projects-count');
    const sStat = document.getElementById('stat-services-count');
    const uStat = document.getElementById('stat-users-count');

    if (pStat) pStat.innerText = projects.length;
    if (sStat) sStat.innerText = services.length;
    if (uStat) uStat.innerText = users.length + 1;

    const projBody = document.getElementById('admin-projects-table-body');
    if (projBody) {
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
    }

    const servBody = document.getElementById('admin-services-table-body');
    if (servBody) {
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
    const modal = document.getElementById('project-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) modal.classList.add('hidden');
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
