/* =========================================================
   MASTERFULL ACADEMY - APLICACIÓN DE DEMOSTRACIÓN FUNCIONAL
   Roles, cursos independientes, CRUD local y progreso
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const content = document.getElementById("academyContent");
  const sidebar = document.getElementById("academySidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const notificationPanel = document.getElementById("notificationPanel");
  const modal = document.getElementById("academyModal");
  const modalContent = document.getElementById("modalContent");
  const toast = document.getElementById("academyToast");
  const storageKey = "masterfull-academy-demo-v1";

  const courseFactory = function (config) {
    return {
      slug: config.slug,
      title: config.title,
      code: config.code,
      icon: config.icon,
      gradient: config.gradient,
      description: config.description,
      teacher: "Andrea Mendoza",
      published: true,
      progress: config.progress,
      average: config.average,
      nextClass: config.nextClass,
      nextEvaluation: config.nextEvaluation,
      modules: config.modules.map(function (module, moduleIndex) {
        return {
          id: `${config.slug}-module-${moduleIndex + 1}`,
          title: module.title,
          published: true,
          lessons: module.lessons.map(function (lesson, lessonIndex) {
            return {
              id: `${config.slug}-lesson-${moduleIndex + 1}-${lessonIndex + 1}`,
              title: lesson,
              type: lessonIndex % 3 === 0 ? "video" : lessonIndex % 3 === 1 ? "pdf" : "practice",
              duration: lessonIndex % 3 === 0 ? "18 min" : lessonIndex % 3 === 1 ? "PDF" : "25 min",
              completed: config.progress > (moduleIndex * 25) + (lessonIndex * 8),
            };
          }),
        };
      }),
      tasks: [
        { id: `${config.slug}-task-1`, title: "Práctica aplicada 01", due: "28 jul, 23:59", points: 20, status: "active", submissions: Math.max(config.students - 4, 8), submitted: false },
        { id: `${config.slug}-task-2`, title: "Informe de aprendizaje", due: "02 ago, 20:00", points: 20, status: "pending", submissions: 0, submitted: false },
      ],
      evaluations: [
        { id: `${config.slug}-eval-1`, title: "Evaluación de módulo 1", date: "30 jul", questions: 12, attempts: 2, time: 35, points: 20, status: "active" },
        { id: `${config.slug}-eval-2`, title: "Control de progreso", date: "08 ago", questions: 15, attempts: 1, time: 40, points: 20, status: "pending" },
      ],
      gradeCategories: [
        { id: `${config.slug}-grade-1`, name: "Prácticas", weight: 25 },
        { id: `${config.slug}-grade-2`, name: "Tareas", weight: 20 },
        { id: `${config.slug}-grade-3`, name: "Examen parcial", weight: 25 },
        { id: `${config.slug}-grade-4`, name: "Proyecto final", weight: 30 },
      ],
      students: Array.from({ length: config.students }, function (_, index) {
        const names = ["María Torres", "Luis Ramírez", "Camila Soto", "Diego Ruiz", "Valeria Luna", "Mateo Rojas", "Luciana Pérez", "Joaquín Vega"];
        const name = names[index % names.length] + (index >= names.length ? ` ${Math.floor(index / names.length) + 1}` : "");
        return {
          id: `${config.slug}-student-${index + 1}`,
          name,
          email: `estudiante${index + 1}@academy.pe`,
          progress: Math.max(42, Math.min(98, config.progress + ((index * 7) % 23) - 10)),
          grade: Math.max(11, Math.min(20, Math.round((config.average + ((index * 3) % 5) - 2) * 10) / 10)),
          attendance: index % 7 === 0 ? "late" : "present",
        };
      }),
      announcements: [
        { id: `${config.slug}-announcement-1`, title: "Bienvenidos al curso", text: `Ya está disponible la ruta de aprendizaje de ${config.title}.`, date: "Hoy, 09:20" },
        { id: `${config.slug}-announcement-2`, title: "Material actualizado", text: "Revisa los recursos añadidos al módulo actual.", date: "Ayer, 18:10" },
      ],
      files: [
        { id: `${config.slug}-file-1`, name: "Guía del curso.pdf", module: "General", size: "2.4 MB", type: "pdf" },
        { id: `${config.slug}-file-2`, name: "Material módulo 1.pdf", module: config.modules[0].title, size: "4.1 MB", type: "pdf" },
      ],
    };
  };

  const initialData = {
    courses: {
      fisica: courseFactory({
        slug: "fisica",
        title: "Física",
        code: "FIS-2026",
        icon: "fa-atom",
        gradient: "linear-gradient(135deg, #1c4fc7, #22b8e6)",
        description: "Comprende las leyes que explican el movimiento, la materia y la energía mediante experiencias aplicadas.",
        progress: 70,
        average: 16.8,
        students: 20,
        nextClass: "Vectores y sistemas de referencia · Mañana, 10:00",
        nextEvaluation: "Evaluación de módulo 1 · 30 de julio",
        modules: [
          { title: "Análisis dimensional", lessons: ["Introducción a las magnitudes", "Sistema internacional de unidades", "Práctica de conversiones", "Evaluación del módulo"] },
          { title: "Vectores", lessons: ["Concepto y representación", "Operaciones con vectores", "Aplicaciones en el plano", "Práctica calificada"] },
          { title: "Cinemática", lessons: ["Movimiento rectilíneo", "Velocidad y aceleración", "Gráficas del movimiento", "Evaluación de progreso"] },
          { title: "Dinámica", lessons: ["Leyes de Newton", "Fuerza y masa", "Rozamiento", "Proyecto aplicado"] },
          { title: "Energía", lessons: ["Trabajo mecánico", "Energía cinética", "Conservación", "Evaluación final"] },
          { title: "Proyecto integrador", lessons: ["Planteamiento", "Desarrollo", "Presentación", "Retroalimentación"] },
        ],
      }),
      quimica: courseFactory({
        slug: "quimica",
        title: "Química",
        code: "QUI-2026",
        icon: "fa-flask-vial",
        gradient: "linear-gradient(135deg, #117c73, #24b99a)",
        description: "Explora la estructura de la materia y sus transformaciones con un enfoque experimental y responsable.",
        progress: 55,
        average: 15.9,
        students: 18,
        nextClass: "Estructura atómica · Jueves, 08:30",
        nextEvaluation: "Práctica de laboratorio · 02 de agosto",
        modules: [
          { title: "Materia y medición", lessons: ["Propiedades de la materia", "Medición científica", "Laboratorio virtual", "Autoevaluación"] },
          { title: "Estructura atómica", lessons: ["Modelos atómicos", "Configuración electrónica", "Tabla periódica", "Práctica"] },
          { title: "Enlaces químicos", lessons: ["Enlace iónico", "Enlace covalente", "Geometría molecular", "Evaluación"] },
          { title: "Reacciones", lessons: ["Ecuaciones químicas", "Balanceo", "Estequiometría", "Laboratorio"] },
          { title: "Proyecto experimental", lessons: ["Hipótesis", "Protocolo", "Resultados", "Presentación"] },
        ],
      }),
      algebra: courseFactory({
        slug: "algebra",
        title: "Álgebra",
        code: "ALG-2026",
        icon: "fa-square-root-variable",
        gradient: "linear-gradient(135deg, #7446c7, #a66bec)",
        description: "Desarrolla pensamiento lógico y estrategias para resolver problemas mediante lenguaje algebraico.",
        progress: 85,
        average: 17.5,
        students: 22,
        nextClass: "Sistemas de ecuaciones · Viernes, 11:00",
        nextEvaluation: "Control de expresiones · 05 de agosto",
        modules: [
          { title: "Expresiones algebraicas", lessons: ["Lenguaje algebraico", "Términos semejantes", "Operaciones", "Práctica"] },
          { title: "Ecuaciones", lessons: ["Ecuaciones lineales", "Problemas aplicados", "Desigualdades", "Evaluación"] },
          { title: "Sistemas", lessons: ["Método gráfico", "Sustitución", "Igualación", "Práctica calificada"] },
          { title: "Funciones", lessons: ["Concepto de función", "Dominio y rango", "Función lineal", "Proyecto final"] },
        ],
      }),
    },
    messages: [
      { id: 1, course: "Física", sender: "María Torres", text: "Profesora, ya actualicé mi práctica.", time: "10:32", mine: false },
      { id: 2, course: "Física", sender: "Andrea Mendoza", text: "Perfecto, la revisaré hoy.", time: "10:38", mine: true },
    ],
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadSavedData() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved && saved.courses && saved.courses.fisica && saved.courses.quimica && saved.courses.algebra) {
        return saved;
      }
    } catch (error) {
      console.warn("No se pudo leer el estado guardado de Academy.", error);
    }
    return clone(initialData);
  }

  const state = {
    role: localStorage.getItem("masterfull-academy-role") || "teacher",
    view: "dashboard",
    courseSlug: null,
    courseTab: "home",
    classId: null,
    search: "",
    data: loadSavedData(),
  };

  function saveData() {
    localStorage.setItem(storageKey, JSON.stringify(state.data));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function currentUser() {
    return state.role === "teacher"
      ? { name: "Andrea Mendoza", short: "Andrea", initials: "AM", label: "Docente" }
      : { name: "María Torres", short: "María", initials: "MT", label: "Alumno" };
  }

  function courseList() {
    return Object.values(state.data.courses);
  }

  function setTopbar(eyebrow, title) {
    document.getElementById("pageEyebrow").textContent = eyebrow;
    document.getElementById("pageTitle").textContent = title;
  }

  function updateUserInterface() {
    const user = currentUser();
    document.body.dataset.role = state.role;
    document.querySelectorAll(".role-option").forEach(function (button) {
      button.classList.toggle("active", button.dataset.role === state.role);
    });
    document.getElementById("sidebarAvatar").textContent = user.initials;
    document.getElementById("topbarAvatar").textContent = user.initials;
    document.getElementById("sidebarUserName").textContent = user.name;
    document.getElementById("sidebarUserRole").textContent = user.label;
    document.getElementById("topbarUserName").textContent = user.short;
    document.getElementById("topbarUserRole").textContent = user.label;
    document.getElementById("dashboardNavLabel").textContent = state.role === "teacher" ? "Dashboard" : "Inicio";
    document.getElementById("coursesNavLabel").textContent = state.role === "teacher" ? "Cursos" : "Mis cursos";
  }

  function setActiveNavigation(view) {
    document.querySelectorAll(".nav-item").forEach(function (button) {
      button.classList.toggle("active", button.dataset.view === view);
    });
  }

  function closeMobileMenu() {
    sidebar.classList.remove("open");
    sidebarBackdrop.classList.remove("open");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
  }

  function routeForCourse(slug) {
    return `${window.ACADEMY_BASE || "/academy/"}cursos/${slug}`;
  }

  function updateRoute(replace) {
    const path = state.courseSlug
      ? routeForCourse(state.courseSlug)
      : (window.ACADEMY_BASE || "/academy/");
    const method = replace ? "replaceState" : "pushState";
    history[method]({ view: state.view, course: state.courseSlug }, "", path);
  }

  function readRoute() {
    const match = location.pathname.match(/\/academy\/cursos\/([^/]+)/);
    if (match && state.data.courses[match[1]]) {
      state.courseSlug = match[1];
      state.view = "course";
      state.courseTab = "home";
    } else {
      state.courseSlug = null;
      state.view = "dashboard";
    }
  }

  function showToast(message) {
    toast.querySelector("span").textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 2600);
  }

  function metricCard(icon, value, label, trend, color) {
    return `
      <article class="metric-card" style="--metric-color:${color}">
        <span class="metric-icon"><i class="fa-solid ${icon}"></i></span>
        <div><strong>${value}</strong><small>${label}</small></div>
        <span class="metric-trend"><i class="fa-solid fa-arrow-trend-up"></i> ${trend}</span>
      </article>
    `;
  }

  function progressBar(value) {
    return `
      <div class="course-progress">
        <div class="progress-meta"><span>Progreso</span><strong>${value}%</strong></div>
        <div class="progress-track"><span style="width:${value}%"></span></div>
      </div>
    `;
  }

  function courseRow(course) {
    const meta = state.role === "teacher"
      ? `${course.students.length} estudiantes · ${course.modules.length} módulos`
      : `${course.modules.length} módulos · ${course.average}/20 de promedio`;
    return `
      <button class="course-row" type="button" data-course-open="${course.slug}">
        <span class="course-thumb" style="--course-gradient:${course.gradient}"><i class="fa-solid ${course.icon}"></i></span>
        <span class="course-info">
          <strong>${escapeHtml(course.title)}</strong>
          <small>${meta}</small>
        </span>
        ${progressBar(course.progress)}
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    `;
  }

  function courseCard(course) {
    return `
      <article class="course-card">
        <button class="course-card-cover" type="button" data-course-open="${course.slug}" style="--course-gradient:${course.gradient};width:100%;text-align:left">
          <span class="course-code">${course.code}</span>
        </button>
        <div class="course-card-body">
          <h3>${escapeHtml(course.title)}</h3>
          <div class="course-meta">
            <span><i class="fa-solid fa-users"></i> ${course.students.length} estudiantes</span>
            <span><i class="fa-solid fa-layer-group"></i> ${course.modules.length} módulos</span>
          </div>
          ${progressBar(course.progress)}
          <div class="course-card-footer">
            <div class="course-people">
              ${course.students.slice(0,3).map(function (student, index) {
                const colors = ["#2563eb", "#18a66a", "#7c5ce7"];
                return `<span class="mini-avatar" style="--avatar-color:${colors[index]}">${student.name.split(" ").map(function (part) { return part[0]; }).slice(0,2).join("")}</span>`;
              }).join("")}
            </div>
            <button class="text-button" type="button" data-course-open="${course.slug}">
              ${state.role === "teacher" ? "Ingresar" : "Continuar"} <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function teacherDashboard() {
    const courses = courseList();
    const totalStudents = courses.reduce(function (sum, course) { return sum + course.students.length; }, 0);
    return `
      <section class="welcome-panel">
        <div class="welcome-copy">
          <span><i class="fa-solid fa-wand-magic-sparkles"></i> Panel del profesor</span>
          <h1>Bienvenida, Andrea. Tu espacio académico está al día.</h1>
          <p>Administra tus cursos, acompaña el avance de tus estudiantes y organiza las próximas actividades desde un solo lugar.</p>
          <div class="welcome-actions">
            <button class="primary-button" type="button" data-action="quick-task"><i class="fa-solid fa-plus"></i> Nueva tarea</button>
            <button class="ghost-button" type="button" data-view="calendar"><i class="fa-regular fa-calendar"></i> Ver calendario</button>
          </div>
        </div>
        <div class="welcome-visual" aria-hidden="true">
          <div class="orbit-card">
            <span class="orbit-icon"><i class="fa-solid fa-chart-line"></i></span>
            <span><strong>84% de avance</strong><small>Promedio de tus cursos</small></span>
          </div>
          <div class="orbit-card">
            <span class="orbit-icon"><i class="fa-solid fa-file-circle-check"></i></span>
            <span><strong>12 entregas nuevas</strong><small>Esperan retroalimentación</small></span>
          </div>
        </div>
      </section>

      <section class="metrics-grid">
        ${metricCard("fa-book-open", "3", "Cursos activos", "Todos publicados", "#2563eb")}
        ${metricCard("fa-users", totalStudents, "Estudiantes", "+6 este mes", "#18a66a")}
        ${metricCard("fa-clipboard-check", "7", "Evaluaciones pendientes", "3 para esta semana", "#ff5a1f")}
        ${metricCard("fa-chart-simple", "16.7", "Promedio general", "+0.8 puntos", "#7c5ce7")}
      </section>

      <section class="dashboard-grid">
        <article class="section-card">
          <header class="section-card-header">
            <div><h2>Tus cursos</h2><p>Cada espacio conserva su configuración y contenido independiente.</p></div>
            <button class="text-button" type="button" data-view="courses">Ver todos <i class="fa-solid fa-arrow-right"></i></button>
          </header>
          <div class="course-list">${courses.map(courseRow).join("")}</div>
        </article>

        <article class="section-card">
          <header class="section-card-header"><div><h2>Actividad reciente</h2><p>Próximos eventos académicos.</p></div></header>
          <div class="agenda-list">
            ${agendaItem("28", "Jul", "Cierre: Práctica aplicada", "Física · 23:59", "status-pending", "Pendiente", "#ff5a1f")}
            ${agendaItem("30", "Jul", "Evaluación de módulo 1", "Física · 10:00", "status-info", "Evaluación", "#2563eb")}
            ${agendaItem("02", "Ago", "Práctica de laboratorio", "Química · 08:30", "status-active", "Clase", "#18a66a")}
          </div>
        </article>
      </section>
    `;
  }

  function agendaItem(day, month, title, meta, statusClass, statusText, color) {
    return `
      <div class="agenda-item">
        <span class="agenda-date" style="--agenda-color:${color}"><strong>${day}</strong><small>${month}</small></span>
        <span class="agenda-copy"><strong>${title}</strong><small>${meta}</small><span class="status-badge ${statusClass}">${statusText}</span></span>
      </div>
    `;
  }

  function studentDashboard() {
    const courses = courseList();
    return `
      <section class="welcome-panel">
        <div class="welcome-copy">
          <span><i class="fa-solid fa-graduation-cap"></i> Tu ruta de aprendizaje</span>
          <h1>Hola, María. Continúa avanzando a tu ritmo.</h1>
          <p>Tienes una clase pendiente y dos actividades próximas. Todo tu progreso está organizado para que puedas concentrarte en aprender.</p>
          <div class="welcome-actions">
            <button class="primary-button" type="button" data-course-open="fisica"><i class="fa-solid fa-play"></i> Continuar Física</button>
            <button class="ghost-button" type="button" data-view="calendar"><i class="fa-regular fa-calendar"></i> Mi agenda</button>
          </div>
        </div>
        <div class="welcome-visual" aria-hidden="true">
          <div class="orbit-card">
            <span class="orbit-icon"><i class="fa-solid fa-fire"></i></span>
            <span><strong>8 días seguidos</strong><small>Tu mejor racha de estudio</small></span>
          </div>
          <div class="orbit-card">
            <span class="orbit-icon"><i class="fa-solid fa-trophy"></i></span>
            <span><strong>80% promedio</strong><small>Progreso global</small></span>
          </div>
        </div>
      </section>

      <section class="metrics-grid">
        ${metricCard("fa-book-open", "3", "Cursos activos", "2 clases esta semana", "#2563eb")}
        ${metricCard("fa-rectangle-list", "2", "Evaluaciones pendientes", "Próxima: 30 jul", "#ff5a1f")}
        ${metricCard("fa-file-pen", "3", "Tareas pendientes", "1 vence mañana", "#d9a11e")}
        ${metricCard("fa-chart-simple", "16.7", "Promedio general", "+0.8 puntos", "#18a66a")}
      </section>

      <section class="dashboard-grid">
        <article class="section-card">
          <header class="section-card-header">
            <div><h2>Mis cursos</h2><p>Retoma exactamente donde te quedaste.</p></div>
            <button class="text-button" type="button" data-view="courses">Ver todos <i class="fa-solid fa-arrow-right"></i></button>
          </header>
          <div class="course-list">${courses.map(courseRow).join("")}</div>
        </article>
        <article class="section-card">
          <header class="section-card-header"><div><h2>Próximas entregas</h2><p>Organiza tu semana de estudio.</p></div></header>
          <div class="agenda-list">
            ${agendaItem("28", "Jul", "Práctica aplicada 01", "Física · 23:59", "status-pending", "Tarea", "#ff5a1f")}
            ${agendaItem("30", "Jul", "Evaluación de módulo", "Física · 10:00", "status-info", "Evaluación", "#2563eb")}
            ${agendaItem("02", "Ago", "Informe de laboratorio", "Química · 20:00", "status-active", "Tarea", "#18a66a")}
          </div>
        </article>
      </section>
    `;
  }

  function renderDashboard() {
    setTopbar(state.role === "teacher" ? "Panel del profesor" : "Espacio del alumno", "Inicio");
    return state.role === "teacher" ? teacherDashboard() : studentDashboard();
  }

  function renderCourses() {
    setTopbar("Espacio académico", state.role === "teacher" ? "Cursos" : "Mis cursos");
    const query = state.search.trim().toLowerCase();
    const courses = courseList().filter(function (course) {
      return !query || course.title.toLowerCase().includes(query) || course.code.toLowerCase().includes(query);
    });
    return `
      <header class="page-heading">
        <div class="page-heading-copy">
          <span class="eyebrow">${state.role === "teacher" ? "Gestión académica" : "Aprendizaje activo"}</span>
          <h1>${state.role === "teacher" ? "Cursos que administras" : "Tus espacios de aprendizaje"}</h1>
          <p>${state.role === "teacher" ? "Contenido, estudiantes y configuración separados para cada curso." : "Accede a módulos, clases y actividades de los cursos donde estás matriculada."}</p>
        </div>
        ${state.role === "teacher" ? `<div class="heading-actions"><button class="primary-button" type="button" data-action="create-course"><i class="fa-solid fa-plus"></i> Crear curso</button></div>` : ""}
      </header>
      <section class="course-grid">
        ${courses.length ? courses.map(courseCard).join("") : `<div class="empty-state section-card"><div><span class="empty-state-icon"><i class="fa-solid fa-magnifying-glass"></i></span><h2>Sin resultados</h2><p>No encontramos cursos que coincidan con “${escapeHtml(state.search)}”.</p></div></div>`}
      </section>
    `;
  }

  function courseTabs() {
    const teacherTabs = [
      ["home", "fa-house", "Inicio"], ["modules", "fa-layer-group", "Módulos"], ["classes", "fa-circle-play", "Clases"],
      ["tasks", "fa-file-pen", "Tareas"], ["evaluations", "fa-rectangle-list", "Evaluaciones"], ["grades", "fa-chart-column", "Calificaciones"],
      ["students", "fa-users", "Estudiantes"], ["attendance", "fa-user-check", "Asistencia"], ["announcements", "fa-bullhorn", "Anuncios"],
      ["files", "fa-folder-open", "Archivos"], ["settings", "fa-sliders", "Configuración"],
    ];
    const studentTabs = [
      ["home", "fa-house", "Inicio"], ["modules", "fa-layer-group", "Módulos"], ["classes", "fa-circle-play", "Clases"],
      ["tasks", "fa-file-pen", "Tareas"], ["evaluations", "fa-rectangle-list", "Evaluaciones"], ["grades", "fa-chart-column", "Calificaciones"],
      ["attendance", "fa-user-check", "Asistencia"], ["announcements", "fa-bullhorn", "Anuncios"], ["files", "fa-folder-open", "Archivos"],
      ["messages", "fa-comments", "Mensajes"],
    ];
    return (state.role === "teacher" ? teacherTabs : studentTabs).map(function (tab) {
      return `<button class="course-tab ${state.courseTab === tab[0] ? "active" : ""}" type="button" data-course-tab="${tab[0]}"><i class="fa-solid ${tab[1]}"></i>${tab[2]}</button>`;
    }).join("");
  }

  function renderCourse() {
    const course = state.data.courses[state.courseSlug];
    if (!course) {
      state.courseSlug = null;
      state.view = "courses";
      return renderCourses();
    }
    setTopbar(`Curso · ${course.code}`, course.title);
    return `
      <section class="course-hero" style="--course-gradient:${course.gradient}">
        <div>
          <div class="course-breadcrumb"><button type="button" data-view="courses">${state.role === "teacher" ? "Cursos" : "Mis cursos"}</button><i class="fa-solid fa-chevron-right"></i><span>${course.code}</span></div>
          <h1>${escapeHtml(course.title)}</h1>
          <p>${escapeHtml(course.description)}</p>
        </div>
        <div class="course-hero-progress">
          <strong>${state.role === "teacher" ? "Avance promedio del curso" : "Tu progreso"}</strong>
          <div class="progress-track"><span style="width:${course.progress}%"></span></div>
          <small>${course.progress}% completado · ${course.modules.length} módulos</small>
        </div>
      </section>
      <nav class="course-tabs" aria-label="Navegación interna del curso">${courseTabs()}</nav>
      <section id="courseTabContent">${renderCourseTab(course)}</section>
    `;
  }

  function renderCourseTab(course) {
    switch (state.courseTab) {
      case "modules": return renderModules(course);
      case "classes": return state.classId ? renderClassView(course) : renderClasses(course);
      case "tasks": return renderTasks(course);
      case "evaluations": return renderEvaluations(course);
      case "grades": return renderGrades(course);
      case "students": return state.role === "teacher" ? renderStudents(course) : renderCourseHome(course);
      case "attendance": return renderAttendance(course);
      case "announcements": return renderAnnouncements(course);
      case "files": return renderFiles(course);
      case "settings": return state.role === "teacher" ? renderSettings(course) : renderCourseHome(course);
      case "messages": return renderMessages(course.title);
      default: return renderCourseHome(course);
    }
  }

  function renderCourseHome(course) {
    return `
      <div class="course-content-grid">
        <div class="overview-stack">
          <article class="section-card">
            <header class="section-card-header">
              <div><h2>Información del curso</h2><p>Resumen académico y próximos hitos.</p></div>
              ${state.role === "teacher" ? `<div class="inline-actions"><button class="compact-button" type="button" data-action="student-preview"><i class="fa-regular fa-eye"></i> Vista del estudiante</button><button class="compact-button" type="button" data-action="edit-course"><i class="fa-regular fa-pen-to-square"></i> Editar curso</button></div>` : ""}
            </header>
            <div class="quick-stat-grid">
              <div class="quick-stat"><strong>${course.students.length}</strong><small>Estudiantes matriculados</small></div>
              <div class="quick-stat"><strong>${course.modules.length}</strong><small>Módulos de aprendizaje</small></div>
              <div class="quick-stat"><strong>${course.average}</strong><small>Promedio actual</small></div>
              <div class="quick-stat"><strong>${course.progress}%</strong><small>Avance del curso</small></div>
            </div>
          </article>
          <article class="section-card">
            <header class="section-card-header"><div><h2>Actividad reciente</h2><p>Últimos movimientos dentro de este curso.</p></div></header>
            <div class="activity-list">
              ${activityItem("fa-file-circle-check", "Nueva entrega recibida", "María Torres entregó Práctica aplicada 01.", "Hace 20 min", "#18a66a")}
              ${activityItem("fa-comment-dots", "Comentario en una clase", "Se publicó una pregunta en el módulo actual.", "Hace 2 h", "#2563eb")}
              ${activityItem("fa-chart-line", "Progreso actualizado", "El promedio de avance alcanzó " + course.progress + "%.", "Ayer", "#7c5ce7")}
            </div>
          </article>
        </div>
        <div class="overview-stack">
          <article class="section-card">
            <header class="section-card-header"><div><h2>Próximamente</h2><p>Agenda del curso.</p></div></header>
            <div class="agenda-list">
              ${agendaItem("29", "Jul", "Próxima clase", course.nextClass, "status-active", "Clase", "#18a66a")}
              ${agendaItem("30", "Jul", "Próxima evaluación", course.nextEvaluation, "status-info", "Evaluación", "#2563eb")}
            </div>
          </article>
          <article class="section-card">
            <header class="section-card-header"><div><h2>Últimos anuncios</h2><p>Comunicaciones para el grupo.</p></div></header>
            <div class="activity-list">
              ${course.announcements.slice(0,2).map(function (announcement) {
                return activityItem("fa-bullhorn", announcement.title, announcement.text, announcement.date, "#ff5a1f");
              }).join("")}
            </div>
          </article>
        </div>
      </div>
    `;
  }

  function activityItem(icon, title, text, date, color) {
    return `
      <div class="activity-item">
        <span class="activity-icon" style="--activity-color:${color}"><i class="fa-solid ${icon}"></i></span>
        <span class="activity-copy"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(text)}</small></span>
        <span class="activity-date">${escapeHtml(date)}</span>
      </div>
    `;
  }

  function renderModules(course) {
    return `
      <article class="section-card">
        <header class="section-card-header">
          <div><h2>Módulos del curso</h2><p>Contenido ordenado en una ruta de aprendizaje progresiva.</p></div>
          ${state.role === "teacher" ? `<button class="primary-button" type="button" data-action="create-module"><i class="fa-solid fa-plus"></i> Crear módulo</button>` : ""}
        </header>
        <div class="module-list">
          ${course.modules.map(function (module, moduleIndex) {
            return `
              <article class="module-card ${moduleIndex === 0 ? "open" : ""}" data-module-id="${module.id}">
                <button class="module-header" type="button" data-module-toggle="${module.id}">
                  <span class="module-number">${String(moduleIndex + 1).padStart(2,"0")}</span>
                  <span><strong>${escapeHtml(module.title)}</strong><small>${module.lessons.length} contenidos · ${module.published ? "Publicado" : "Oculto"}</small></span>
                  <i class="fa-solid fa-chevron-down"></i>
                </button>
                <div class="module-lessons">
                  ${module.lessons.map(function (lesson) {
                    return `
                      <div class="lesson-row ${lesson.completed ? "completed" : ""}">
                        ${state.role === "student"
                          ? `<button class="lesson-state" type="button" data-lesson-complete="${lesson.id}" aria-label="Marcar clase como completada"><i class="fa-solid fa-check"></i></button>`
                          : `<span class="lesson-state"><i class="fa-solid ${lesson.type === "video" ? "fa-play" : lesson.type === "pdf" ? "fa-file-pdf" : "fa-pen"}"></i></span>`}
                        <span>${escapeHtml(lesson.title)}</span>
                        <span class="lesson-meta">${lesson.duration}</span>
                      </div>
                    `;
                  }).join("")}
                  ${state.role === "teacher" ? `
                    <div class="inline-actions" style="padding-top:12px">
                      <button class="compact-button" type="button" data-module-action="edit" data-module-id="${module.id}"><i class="fa-regular fa-pen-to-square"></i> Editar</button>
                      <button class="compact-button" type="button" data-module-action="duplicate" data-module-id="${module.id}"><i class="fa-regular fa-copy"></i> Duplicar</button>
                      <button class="compact-button" type="button" data-module-action="toggle" data-module-id="${module.id}"><i class="fa-regular fa-eye"></i> ${module.published ? "Ocultar" : "Publicar"}</button>
                      <button class="compact-button" type="button" data-module-action="up" data-module-id="${module.id}" aria-label="Subir módulo"><i class="fa-solid fa-arrow-up"></i></button>
                      <button class="compact-button" type="button" data-module-action="down" data-module-id="${module.id}" aria-label="Bajar módulo"><i class="fa-solid fa-arrow-down"></i></button>
                      <button class="compact-button" type="button" data-module-action="delete" data-module-id="${module.id}"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                  ` : ""}
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </article>
    `;
  }

  function renderClasses(course) {
    const lessons = course.modules.flatMap(function (module) {
      return module.lessons.map(function (lesson) { return { ...lesson, module: module.title }; });
    });
    return `
      <article class="section-card">
        <header class="section-card-header">
          <div><h2>Clases</h2><p>Videos, materiales, apuntes y prácticas del curso.</p></div>
          ${state.role === "teacher" ? `<button class="primary-button" type="button" data-action="create-class"><i class="fa-solid fa-plus"></i> Nueva clase</button>` : ""}
        </header>
        <div class="task-list">
          ${lessons.map(function (lesson) {
            return `
              <article class="task-card">
                <span class="task-icon" style="--task-color:#2563eb"><i class="fa-solid ${lesson.type === "video" ? "fa-circle-play" : lesson.type === "pdf" ? "fa-file-pdf" : "fa-pen-ruler"}"></i></span>
                <span class="task-copy"><strong>${escapeHtml(lesson.title)}</strong><small>${escapeHtml(lesson.module)} · ${lesson.duration}</small></span>
                <span class="task-actions"><button class="compact-button" type="button" data-class-open="${lesson.id}">${state.role === "teacher" ? "Editar" : "Abrir clase"}</button></span>
              </article>
            `;
          }).join("")}
        </div>
      </article>
    `;
  }

  function renderClassView(course) {
    const allLessons = course.modules.flatMap(function (module) {
      return module.lessons.map(function (lesson) { return { ...lesson, module: module.title }; });
    });
    const index = Math.max(0, allLessons.findIndex(function (lesson) { return lesson.id === state.classId; }));
    const lesson = allLessons[index];
    return `
      <div class="course-content-grid">
        <div class="overview-stack">
          <article class="section-card" style="padding:20px">
            <button class="text-button" type="button" data-action="close-class"><i class="fa-solid fa-arrow-left"></i> Volver a clases</button>
            <div style="aspect-ratio:16/9;display:grid;place-items:center;margin:17px 0;border-radius:18px;color:#fff;background:linear-gradient(135deg,#08111f,#173963);position:relative;overflow:hidden">
              <div style="text-align:center"><span class="orbit-icon" style="width:58px;height:58px;margin:0 auto 12px"><i class="fa-solid fa-play"></i></span><strong style="display:block">${escapeHtml(lesson.title)}</strong><small style="color:#9fb0c6">${lesson.duration}</small></div>
            </div>
            <span class="eyebrow">${escapeHtml(lesson.module)}</span>
            <h2>${escapeHtml(lesson.title)}</h2>
            <p style="margin-top:9px;color:var(--academy-muted);font-size:10px">En esta clase desarrollarás el concepto paso a paso, revisarás ejemplos y aplicarás lo aprendido mediante una práctica breve.</p>
            <div class="inline-actions" style="margin-top:17px">
              <button class="compact-button" type="button"><i class="fa-solid fa-file-pdf"></i> Material de clase</button>
              <button class="compact-button" type="button"><i class="fa-solid fa-link"></i> Recurso complementario</button>
              ${state.role === "student" ? `<button class="secondary-button" type="button" data-lesson-complete="${lesson.id}"><i class="fa-solid fa-check"></i> Marcar completada</button>` : ""}
            </div>
          </article>
          <article class="section-card" style="padding:20px">
            <h3>Notas personales</h3>
            <textarea class="class-notes" data-class-notes="${lesson.id}" placeholder="Escribe aquí tus apuntes. Se guardarán en este dispositivo." style="width:100%;min-height:115px;margin-top:12px;padding:13px;border:1px solid var(--academy-border);border-radius:13px;resize:vertical;outline:0">${escapeHtml(localStorage.getItem(`academy-notes-${lesson.id}`) || "")}</textarea>
          </article>
        </div>
        <article class="section-card">
          <header class="section-card-header"><div><h2>Contenido del curso</h2><p>${index + 1} de ${allLessons.length} clases</p></div></header>
          <div class="activity-list">
            ${allLessons.map(function (item) {
              return `<button class="activity-item" type="button" data-class-open="${item.id}" style="width:100%;background:transparent;text-align:left;${item.id === lesson.id ? "color:var(--academy-blue)" : ""}">
                <span class="lesson-state ${item.completed ? "completed" : ""}"><i class="fa-solid ${item.completed ? "fa-check" : "fa-play"}"></i></span>
                <span class="activity-copy"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.module)}</small></span>
                <i class="fa-solid fa-chevron-right"></i>
              </button>`;
            }).join("")}
          </div>
          <div style="padding:0 20px 20px"><button class="primary-button" type="button" data-action="next-class" style="width:100%">Siguiente clase <i class="fa-solid fa-arrow-right"></i></button></div>
        </article>
      </div>
    `;
  }

  function renderTasks(course) {
    return `
      <article class="section-card">
        <header class="section-card-header">
          <div><h2>Tareas</h2><p>Entregas de archivos y texto separadas de las evaluaciones.</p></div>
          ${state.role === "teacher" ? `<button class="primary-button" type="button" data-action="create-task"><i class="fa-solid fa-plus"></i> Nueva tarea</button>` : ""}
        </header>
        <div class="task-list">
          ${course.tasks.map(function (task) {
            return `
              <article class="task-card">
                <span class="task-icon" style="--task-color:${task.status === "active" ? "#ff5a1f" : "#2563eb"}"><i class="fa-solid fa-file-arrow-up"></i></span>
                <span class="task-copy"><strong>${escapeHtml(task.title)}</strong><small>Fecha límite: ${task.due} · ${task.points} puntos · PDF, Word, imágenes o texto</small></span>
                <span class="task-actions">
                  <span class="status-badge ${task.submitted ? "status-done" : task.status === "active" ? "status-pending" : "status-info"}">${task.submitted ? "Entregada" : state.role === "teacher" ? task.submissions + " entregas" : "Pendiente"}</span>
                  ${state.role === "student" && !task.submitted ? `<button class="compact-button" type="button" data-task-submit="${task.id}">Entregar</button>` : ""}
                  ${state.role === "teacher" ? `<button class="compact-button" type="button" data-action="feedback">Revisar</button>` : ""}
                </span>
              </article>
            `;
          }).join("")}
        </div>
      </article>
    `;
  }

  function renderEvaluations(course) {
    return `
      <article class="section-card">
        <header class="section-card-header">
          <div><h2>Evaluaciones</h2><p>Intentos, tiempo, puntaje y retroalimentación configurables.</p></div>
          ${state.role === "teacher" ? `<button class="primary-button" type="button" data-action="create-evaluation"><i class="fa-solid fa-plus"></i> Nueva evaluación</button>` : ""}
        </header>
        <div class="task-list">
          ${course.evaluations.map(function (evaluation) {
            return `
              <article class="task-card">
                <span class="task-icon" style="--task-color:#7c5ce7"><i class="fa-solid fa-rectangle-list"></i></span>
                <span class="task-copy"><strong>${escapeHtml(evaluation.title)}</strong><small>${evaluation.questions} preguntas · ${evaluation.attempts} intento(s) · ${evaluation.time} min · ${evaluation.points} puntos · ${evaluation.date}</small></span>
                <span class="task-actions">
                  <span class="status-badge ${evaluation.status === "active" ? "status-active" : "status-info"}">${evaluation.status === "active" ? "Disponible" : "Programada"}</span>
                  <button class="compact-button" type="button" data-action="${state.role === "teacher" ? "evaluation-results" : "start-evaluation"}">${state.role === "teacher" ? "Resultados" : "Comenzar"}</button>
                </span>
              </article>
            `;
          }).join("")}
        </div>
      </article>
    `;
  }

  function renderGrades(course) {
    const totalWeight = course.gradeCategories.reduce(function (sum, category) { return sum + Number(category.weight); }, 0);
    return `
      <div class="overview-stack">
        <article class="section-card">
          <header class="section-card-header">
            <div><h2>${state.role === "teacher" ? "Configuración de calificaciones" : "Mis calificaciones"}</h2><p>${state.role === "teacher" ? "Categorías y porcentajes exclusivos para " + course.title + "." : "Detalle de tu rendimiento dentro de este curso."}</p></div>
            ${state.role === "teacher" ? `<button class="primary-button" type="button" data-action="create-category"><i class="fa-solid fa-plus"></i> Nueva categoría</button>` : ""}
          </header>
          ${state.role === "teacher" ? `
            <div class="task-list">
              ${course.gradeCategories.map(function (category) {
                return `<div class="task-card">
                  <span class="task-icon" style="--task-color:#2563eb"><i class="fa-solid fa-chart-pie"></i></span>
                  <span class="task-copy"><strong>${escapeHtml(category.name)}</strong><small>Peso editable dentro del promedio final</small></span>
                  <span class="task-actions"><span class="grade-pill" style="--grade-color:#2563eb">${category.weight}%</span><button class="compact-button" type="button" data-category-edit="${category.id}">Editar</button></span>
                </div>`;
              }).join("")}
              <div class="task-card"><span class="task-icon" style="--task-color:${totalWeight === 100 ? "#18a66a" : "#dc4c64"}"><i class="fa-solid ${totalWeight === 100 ? "fa-check" : "fa-triangle-exclamation"}"></i></span><span class="task-copy"><strong>Total configurado: ${totalWeight}%</strong><small>${totalWeight === 100 ? "La ponderación es correcta." : "Ajusta las categorías hasta completar 100%."}</small></span></div>
            </div>
          ` : studentGradeTable(course)}
        </article>
      </div>
    `;
  }

  function studentGradeTable(course) {
    return `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Categoría</th><th>Peso</th><th>Nota</th><th>Estado</th></tr></thead>
          <tbody>
            ${course.gradeCategories.map(function (category, index) {
              const grade = Math.max(13, Math.min(20, course.average + (index % 2 ? .6 : -.3))).toFixed(1);
              return `<tr><td><strong>${escapeHtml(category.name)}</strong></td><td>${category.weight}%</td><td><span class="grade-pill" style="--grade-color:#18a66a">${grade}</span></td><td><span class="status-badge status-done">Calificado</span></td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderStudents(course) {
    return `
      <article class="section-card">
        <header class="section-card-header">
          <div><h2>Estudiantes</h2><p>Progreso, notas, asistencia y comunicación por estudiante.</p></div>
          <div class="inline-actions"><button class="compact-button" type="button" data-action="filter-students"><i class="fa-solid fa-filter"></i> Filtrar</button><button class="primary-button" type="button" data-action="add-student"><i class="fa-solid fa-user-plus"></i> Matricular</button></div>
        </header>
        <div class="data-table-wrap">
          <table class="data-table">
            <thead><tr><th>Estudiante</th><th>Progreso</th><th>Promedio</th><th>Asistencia</th><th>Acciones</th></tr></thead>
            <tbody>
              ${course.students.map(function (student, index) {
                return `<tr>
                  <td><span class="table-person"><span class="mini-avatar" style="--avatar-color:${["#2563eb","#18a66a","#7c5ce7","#ff5a1f"][index % 4]}">${student.name.split(" ").map(function (part) { return part[0]; }).slice(0,2).join("")}</span><span><strong>${escapeHtml(student.name)}</strong><small>${student.email}</small></span></span></td>
                  <td style="min-width:130px">${progressBar(student.progress)}</td>
                  <td><span class="grade-pill" style="--grade-color:${student.grade >= 14 ? "#18a66a" : "#dc4c64"}">${student.grade}</span></td>
                  <td><span class="status-badge ${student.attendance === "present" ? "status-done" : "status-pending"}">${student.attendance === "present" ? "Presente" : "Tardanza"}</span></td>
                  <td><button class="compact-button" type="button" data-action="message-student"><i class="fa-regular fa-message"></i> Mensaje</button></td>
                </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </article>
    `;
  }

  function renderAttendance(course) {
    const present = course.students.filter(function (student) { return student.attendance === "present"; }).length;
    return `
      <div class="overview-stack">
        <section class="metrics-grid" style="margin-bottom:0">
          ${metricCard("fa-user-check", present, "Presentes", "Registro actual", "#18a66a")}
          ${metricCard("fa-clock", course.students.filter(function (student) { return student.attendance === "late"; }).length, "Tardanzas", "Seguimiento", "#d9a11e")}
          ${metricCard("fa-user-xmark", course.students.filter(function (student) { return student.attendance === "absent"; }).length, "Faltas", "Registro actual", "#dc4c64")}
          ${metricCard("fa-file-circle-check", course.students.filter(function (student) { return student.attendance === "justified"; }).length, "Justificadas", "Documentadas", "#2563eb")}
        </section>
        <article class="section-card">
          <header class="section-card-header"><div><h2>${state.role === "teacher" ? "Registro de asistencia" : "Mi asistencia"}</h2><p>${state.role === "teacher" ? "Actualiza el estado de la sesión actual." : "Historial y porcentaje de participación."}</p></div></header>
          ${state.role === "teacher" ? `
            <div class="data-table-wrap"><table class="data-table"><thead><tr><th>Estudiante</th><th>Estado actual</th><th>Registrar</th></tr></thead><tbody>
            ${course.students.slice(0,10).map(function (student, index) {
              return `<tr><td><span class="table-person"><span class="mini-avatar" style="--avatar-color:${["#2563eb","#18a66a","#7c5ce7"][index % 3]}">${student.name.split(" ").map(function (part) { return part[0]; }).slice(0,2).join("")}</span><strong>${escapeHtml(student.name)}</strong></span></td><td>${attendanceLabel(student.attendance)}</td><td><div class="inline-actions">${["present","late","absent","justified"].map(function (status) { return `<button class="compact-button" type="button" data-attendance="${status}" data-student-id="${student.id}" title="${attendanceText(status)}">${attendanceIcon(status)}</button>`; }).join("")}</div></td></tr>`;
            }).join("")}
            </tbody></table></div>
          ` : `<div style="padding:5px 20px 22px">${progressBar(94)}<p style="margin-top:12px;color:var(--academy-muted);font-size:10px">Has asistido a 17 de 18 sesiones. No tienes faltas pendientes de justificar.</p></div>`}
        </article>
      </div>
    `;
  }

  function attendanceText(status) {
    return { present: "Presente", late: "Tardanza", absent: "Falta", justified: "Justificado" }[status];
  }

  function attendanceIcon(status) {
    return { present: "P", late: "T", absent: "F", justified: "J" }[status];
  }

  function attendanceLabel(status) {
    const className = status === "present" ? "status-done" : status === "absent" ? "status-late" : status === "late" ? "status-pending" : "status-info";
    return `<span class="status-badge ${className}">${attendanceText(status)}</span>`;
  }

  function renderAnnouncements(course) {
    return `
      <article class="section-card">
        <header class="section-card-header">
          <div><h2>Anuncios</h2><p>Comunicaciones importantes para todo el curso.</p></div>
          ${state.role === "teacher" ? `<button class="primary-button" type="button" data-action="create-announcement"><i class="fa-solid fa-plus"></i> Publicar anuncio</button>` : ""}
        </header>
        <div class="activity-list">${course.announcements.map(function (announcement) { return activityItem("fa-bullhorn", announcement.title, announcement.text, announcement.date, "#ff5a1f"); }).join("")}</div>
      </article>
    `;
  }

  function renderFiles(course) {
    return `
      <article class="section-card">
        <header class="section-card-header">
          <div><h2>Biblioteca del curso</h2><p>Archivos organizados por módulo.</p></div>
          ${state.role === "teacher" ? `<button class="primary-button" type="button" data-action="upload-file"><i class="fa-solid fa-cloud-arrow-up"></i> Subir archivo</button>` : ""}
        </header>
        <div class="task-list">
          ${course.files.map(function (file) {
            return `<article class="task-card"><span class="task-icon" style="--task-color:#dc4c64"><i class="fa-solid fa-file-pdf"></i></span><span class="task-copy"><strong>${escapeHtml(file.name)}</strong><small>${escapeHtml(file.module)} · ${file.size}</small></span><span class="task-actions"><button class="compact-button" type="button" data-action="download-file"><i class="fa-solid fa-download"></i> Descargar</button>${state.role === "teacher" ? `<button class="compact-button" type="button" data-action="delete-file"><i class="fa-regular fa-trash-can"></i></button>` : ""}</span></article>`;
          }).join("")}
        </div>
      </article>
    `;
  }

  function renderSettings(course) {
    return `
      <div class="course-content-grid">
        <article class="section-card" style="padding:22px">
          <span class="eyebrow">Configuración independiente</span>
          <h2>Preferencias de ${escapeHtml(course.title)}</h2>
          <form class="academy-form" style="margin-top:18px" data-form="course-settings">
            <div class="form-field"><label>Nombre del curso</label><input name="title" value="${escapeHtml(course.title)}"></div>
            <div class="form-field"><label>Descripción</label><textarea name="description">${escapeHtml(course.description)}</textarea></div>
            <div class="form-row"><div class="form-field"><label>Código</label><input name="code" value="${course.code}"></div><div class="form-field"><label>Visibilidad</label><select name="published"><option value="true" ${course.published ? "selected" : ""}>Publicado</option><option value="false" ${!course.published ? "selected" : ""}>Oculto</option></select></div></div>
            <div class="form-actions"><button class="primary-button" type="submit">Guardar cambios</button></div>
          </form>
        </article>
        <article class="section-card" style="padding:22px">
          <h3>Datos aislados por curso</h3>
          <p style="margin-top:8px;color:var(--academy-muted);font-size:10px">Módulos, ponderaciones, estudiantes, asistencia y anuncios pertenecen únicamente a este curso. Ningún cambio se comparte con otras materias.</p>
          <div class="quick-stat-grid" style="padding:18px 0 0"><div class="quick-stat"><strong>${course.modules.length}</strong><small>Módulos propios</small></div><div class="quick-stat"><strong>${course.gradeCategories.length}</strong><small>Categorías de nota</small></div></div>
        </article>
      </div>
    `;
  }

  function renderCalendar() {
    setTopbar("Organización académica", "Calendario");
    const days = Array.from({ length: 35 }, function (_, index) {
      const number = index < 2 ? 29 + index : index - 1;
      const muted = index < 2 || index > 32;
      const event = index === 8 ? `<span class="calendar-event" style="--event-color:#ff5a1f">Práctica Física</span>` : index === 10 ? `<span class="calendar-event" style="--event-color:#2563eb">Evaluación</span>` : index === 13 ? `<span class="calendar-event" style="--event-color:#18a66a">Clase Química</span>` : "";
      return `<div class="calendar-day ${muted ? "muted" : ""} ${index === 5 ? "today" : ""}"><span class="day-number">${number}</span>${event}</div>`;
    }).join("");
    return `
      <header class="page-heading"><div class="page-heading-copy"><span class="eyebrow">Agenda central</span><h1>Calendario académico</h1><p>Clases, tareas y evaluaciones organizadas por fecha y curso.</p></div><div class="heading-actions"><button class="primary-button" type="button" data-action="new-event"><i class="fa-solid fa-plus"></i> Nuevo evento</button></div></header>
      <div class="calendar-layout">
        <article class="section-card calendar-card"><div class="calendar-toolbar"><button class="icon-button" type="button"><i class="fa-solid fa-chevron-left"></i></button><h2>Julio 2026</h2><button class="icon-button" type="button"><i class="fa-solid fa-chevron-right"></i></button></div><div class="calendar-grid">${["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map(function (day) { return `<div class="calendar-weekday">${day}</div>`; }).join("")}${days}</div></article>
        <article class="section-card"><header class="section-card-header"><div><h2>Próximos eventos</h2><p>Resumen de tu agenda.</p></div></header><div class="agenda-list">${agendaItem("28","Jul","Práctica aplicada 01","Física · 23:59","status-pending","Tarea","#ff5a1f")}${agendaItem("30","Jul","Evaluación de módulo","Física · 10:00","status-info","Evaluación","#2563eb")}${agendaItem("02","Ago","Laboratorio","Química · 08:30","status-active","Clase","#18a66a")}</div></article>
      </div>
    `;
  }

  function renderGlobalEvaluations() {
    setTopbar("Seguimiento académico", "Evaluaciones");
    const evaluations = courseList().flatMap(function (course) { return course.evaluations.map(function (evaluation) { return { ...evaluation, course: course.title, slug: course.slug }; }); });
    return `
      <header class="page-heading"><div class="page-heading-copy"><span class="eyebrow">Evaluaciones</span><h1>${state.role === "teacher" ? "Evaluaciones de tus cursos" : "Tus próximas evaluaciones"}</h1><p>Vista unificada sin mezclar la configuración interna de cada curso.</p></div></header>
      <article class="section-card"><div class="task-list" style="padding-top:20px">${evaluations.map(function (evaluation) {
        return `<article class="task-card"><span class="task-icon" style="--task-color:#7c5ce7"><i class="fa-solid fa-rectangle-list"></i></span><span class="task-copy"><strong>${escapeHtml(evaluation.title)}</strong><small>${escapeHtml(evaluation.course)} · ${evaluation.questions} preguntas · ${evaluation.time} min · ${evaluation.date}</small></span><span class="task-actions"><button class="compact-button" type="button" data-course-open="${evaluation.slug}">Ver curso</button></span></article>`;
      }).join("")}</div></article>
    `;
  }

  function renderGlobalGrades() {
    setTopbar("Rendimiento", "Calificaciones");
    return `
      <header class="page-heading"><div class="page-heading-copy"><span class="eyebrow">Calificaciones</span><h1>${state.role === "teacher" ? "Rendimiento por curso" : "Resumen de calificaciones"}</h1><p>Cada promedio se calcula con la ponderación definida dentro de su propio curso.</p></div></header>
      <section class="course-grid">${courseList().map(function (course) {
        return `<article class="section-card" style="padding:21px"><span class="status-badge status-active">${course.published ? "Publicado" : "Oculto"}</span><h3 style="margin-top:15px">${course.title}</h3><strong style="display:block;margin-top:18px;font-size:32px">${course.average}<small style="font-size:11px;color:var(--academy-muted)"> / 20</small></strong>${progressBar(Math.round(course.average * 5))}<button class="text-button" type="button" data-course-open="${course.slug}" style="margin-top:17px">Ver detalle <i class="fa-solid fa-arrow-right"></i></button></article>`;
      }).join("")}</section>
    `;
  }

  function renderMessages(courseFilter) {
    setTopbar("Comunicación", "Mensajes");
    const messages = courseFilter ? state.data.messages.filter(function (message) { return message.course === courseFilter; }) : state.data.messages;
    return `
      <div class="course-content-grid">
        <article class="section-card">
          <header class="section-card-header"><div><h2>${courseFilter ? "Mensajes de " + escapeHtml(courseFilter) : "Conversaciones"}</h2><p>Chat organizado por curso.</p></div></header>
          <div class="activity-list">
            ${messages.map(function (message) {
              return `<div class="activity-item" style="${message.mine ? "padding-left:25px" : ""}"><span class="mini-avatar" style="--avatar-color:${message.mine ? "#ff5a1f" : "#2563eb"}">${message.sender.split(" ").map(function (part) { return part[0]; }).slice(0,2).join("")}</span><span class="activity-copy"><strong>${escapeHtml(message.sender)} · ${escapeHtml(message.course)}</strong><small>${escapeHtml(message.text)}</small></span><span class="activity-date">${message.time}</span></div>`;
            }).join("")}
          </div>
          <form class="academy-form" data-form="message" style="padding:0 20px 20px"><div class="form-field"><label>Nuevo mensaje</label><textarea name="message" required placeholder="Escribe un mensaje para el curso..."></textarea></div><div class="form-actions"><button class="secondary-button" type="submit"><i class="fa-regular fa-paper-plane"></i> Enviar</button></div></form>
        </article>
        <article class="section-card"><header class="section-card-header"><div><h2>Cursos</h2><p>Filtra las conversaciones.</p></div></header><div class="course-list">${courseList().map(function (course) { return `<button class="course-row" type="button" data-message-course="${course.title}" style="grid-template-columns:45px 1fr 20px"><span class="course-thumb" style="width:45px;height:45px;--course-gradient:${course.gradient}"><i class="fa-solid ${course.icon}"></i></span><span class="course-info"><strong>${course.title}</strong><small>Conversación del curso</small></span><i class="fa-solid fa-chevron-right"></i></button>`; }).join("")}</div></article>
      </div>
    `;
  }

  function renderProfile() {
    const user = currentUser();
    setTopbar("Cuenta personal", "Perfil");
    return `
      <header class="page-heading"><div class="page-heading-copy"><span class="eyebrow">Perfil</span><h1>Tu información en Academy</h1><p>Preferencias personales y datos de acceso.</p></div></header>
      <div class="course-content-grid">
        <article class="section-card" style="padding:24px">
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:22px"><span class="user-avatar" style="width:64px;height:64px;font-size:16px">${user.initials}</span><span><h2>${user.name}</h2><p style="color:var(--academy-muted);font-size:10px">${user.label} · Masterfull Academy</p></span></div>
          <form class="academy-form" data-form="profile"><div class="form-row"><div class="form-field"><label>Nombre</label><input value="${user.name}"></div><div class="form-field"><label>Correo</label><input value="${state.role === "teacher" ? "andrea@masterfull.edu.pe" : "maria@masterfull.edu.pe"}"></div></div><div class="form-field"><label>Biografía</label><textarea>${state.role === "teacher" ? "Docente especializada en ciencias y aprendizaje digital." : "Estudiante de Masterfull Academy."}</textarea></div><div class="form-actions"><button class="primary-button" type="submit">Guardar perfil</button></div></form>
        </article>
        <article class="section-card" style="padding:24px"><h3>Preferencias</h3><div class="activity-list" style="padding:14px 0 0">${activityItem("fa-bell","Notificaciones académicas","Avisos de tareas, evaluaciones y mensajes.","Activadas","#2563eb")}${activityItem("fa-shield-halved","Seguridad de cuenta","Último acceso: hoy a las 08:42.","Protegida","#18a66a")}</div></article>
      </div>
    `;
  }

  function renderPlaceholder(view) {
    const labels = {
      resources: ["Recursos", "Tus materiales están organizados por curso."],
      analytics: ["Analítica", "Indicadores avanzados de participación y rendimiento."],
      progress: ["Mi progreso", "Tu avance consolidado en todos los cursos."],
    };
    const copy = labels[view] || ["Próximamente", "Este espacio está preparado para futuras funcionalidades."];
    setTopbar("Masterfull Academy", copy[0]);
    return `<section class="empty-state section-card"><div><span class="empty-state-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></span><h2>${copy[0]}</h2><p>${copy[1]}</p><button class="secondary-button" type="button" data-view="dashboard">Volver al inicio</button></div></section>`;
  }

  function render() {
    updateUserInterface();
    setActiveNavigation(state.view === "course" ? "courses" : state.view);
    let html;
    if (state.view === "course") html = renderCourse();
    else if (state.view === "dashboard") html = renderDashboard();
    else if (state.view === "courses") html = renderCourses();
    else if (state.view === "calendar") html = renderCalendar();
    else if (state.view === "evaluations") html = renderGlobalEvaluations();
    else if (state.view === "grades") html = renderGlobalGrades();
    else if (state.view === "messages") html = renderMessages();
    else if (state.view === "profile") html = renderProfile();
    else html = renderPlaceholder(state.view);
    content.innerHTML = html;
    content.classList.remove("content-enter");
    requestAnimationFrame(function () { content.classList.add("content-enter"); });
    content.focus({ preventScroll: true });
  }

  function notificationsMarkup() {
    const items = state.role === "teacher"
      ? [
          ["fa-file-circle-check", "Nuevas entregas", "12 estudiantes enviaron actividades.", "Hace 20 min", "#18a66a"],
          ["fa-message", "Nuevo mensaje", "María preguntó sobre la práctica.", "Hace 1 h", "#2563eb"],
          ["fa-triangle-exclamation", "Evaluación pendiente", "Falta publicar resultados de Física.", "Ayer", "#ff5a1f"],
        ]
      : [
          ["fa-file-pen", "Entrega próxima", "Práctica de Física vence mañana.", "Hace 15 min", "#ff5a1f"],
          ["fa-bullhorn", "Nuevo anuncio", "Se actualizó el material de Química.", "Hace 2 h", "#2563eb"],
          ["fa-circle-check", "Actividad calificada", "Obtuviste 18 en Álgebra.", "Ayer", "#18a66a"],
        ];
    document.getElementById("notificationList").innerHTML = items.map(function (item) {
      return `<article class="notification-item"><span class="notification-item-icon" style="--notification-color:${item[4]}"><i class="fa-solid ${item[0]}"></i></span><span><strong>${item[1]}</strong><p>${item[2]}</p><small>${item[3]}</small></span></article>`;
    }).join("");
  }

  function openNotifications() {
    notificationsMarkup();
    notificationPanel.classList.add("open");
    notificationPanel.setAttribute("aria-hidden", "false");
  }

  function closeNotifications() {
    notificationPanel.classList.remove("open");
    notificationPanel.setAttribute("aria-hidden", "true");
  }

  function openModal(type, options) {
    const config = options || {};
    modal.dataset.type = type;
    modal.dataset.course = state.courseSlug || config.course || "fisica";
    modal.dataset.itemId = config.itemId || "";
    document.getElementById("modalEyebrow").textContent = config.eyebrow || "Masterfull Academy";
    document.getElementById("modalTitle").textContent = config.title || "Nueva actividad";
    modalContent.innerHTML = config.html || "";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    const firstInput = modalContent.querySelector("input, textarea, select");
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function simpleForm(fields, submitText) {
    return `<form class="academy-form" data-form="modal">${fields}<div class="form-actions"><button class="ghost-button" type="button" data-action="close-modal">Cancelar</button><button class="primary-button" type="submit">${submitText || "Guardar"}</button></div></form>`;
  }

  function openModuleForm(module) {
    openModal(module ? "edit-module" : "create-module", {
      title: module ? "Editar módulo" : "Crear módulo",
      itemId: module ? module.id : "",
      html: simpleForm(`
        <div class="form-field"><label>Nombre del módulo</label><input name="title" required value="${module ? escapeHtml(module.title) : ""}" placeholder="Ej. Movimiento y fuerzas"></div>
        <div class="form-field"><label>Visibilidad inicial</label><select name="published"><option value="true">Publicado</option><option value="false" ${module && !module.published ? "selected" : ""}>Oculto</option></select></div>
      `, module ? "Actualizar módulo" : "Crear módulo"),
    });
  }

  function openTaskForm() {
    openModal("create-task", {
      title: "Nueva tarea",
      html: simpleForm(`
        <div class="form-field"><label>Título</label><input name="title" required placeholder="Ej. Informe de laboratorio"></div>
        <div class="form-field"><label>Instrucciones</label><textarea name="description" placeholder="Describe la actividad y sus entregables"></textarea></div>
        <div class="form-row"><div class="form-field"><label>Fecha límite</label><input type="datetime-local" name="due" required></div><div class="form-field"><label>Puntaje</label><input type="number" min="1" max="100" name="points" value="20"></div></div>
        <div class="form-field"><label>Formatos permitidos</label><select name="format"><option>PDF, Word, imágenes y texto</option><option>Solo PDF</option><option>Entrega de texto</option></select></div>
      `, "Publicar tarea"),
    });
  }

  function openEvaluationForm() {
    openModal("create-evaluation", {
      title: "Nueva evaluación",
      html: simpleForm(`
        <div class="form-field"><label>Título</label><input name="title" required placeholder="Ej. Evaluación de módulo"></div>
        <div class="form-row"><div class="form-field"><label>Preguntas</label><input type="number" min="1" name="questions" value="10"></div><div class="form-field"><label>Intentos</label><input type="number" min="1" name="attempts" value="1"></div></div>
        <div class="form-row"><div class="form-field"><label>Tiempo (minutos)</label><input type="number" min="5" name="time" value="30"></div><div class="form-field"><label>Puntaje</label><input type="number" min="1" name="points" value="20"></div></div>
        <div class="form-field"><label>Fecha</label><input type="date" name="date" required></div>
      `, "Crear evaluación"),
    });
  }

  function openCategoryForm(category) {
    openModal(category ? "edit-category" : "create-category", {
      title: category ? "Editar categoría" : "Nueva categoría de nota",
      itemId: category ? category.id : "",
      html: simpleForm(`
        <div class="form-field"><label>Nombre de la categoría</label><input name="name" required value="${category ? escapeHtml(category.name) : ""}" placeholder="Ej. Participación"></div>
        <div class="form-field"><label>Porcentaje</label><input type="number" min="0" max="100" name="weight" value="${category ? category.weight : 10}" required></div>
      `, category ? "Actualizar categoría" : "Agregar categoría"),
    });
  }

  function handleModalSubmit(form) {
    const formData = new FormData(form);
    const course = state.data.courses[modal.dataset.course];
    if (!course) return;
    const type = modal.dataset.type;

    if (type === "create-module" || type === "edit-module") {
      const existing = course.modules.find(function (module) { return module.id === modal.dataset.itemId; });
      if (existing) {
        existing.title = formData.get("title").trim();
        existing.published = formData.get("published") === "true";
      } else {
        course.modules.push({
          id: `${course.slug}-module-${Date.now()}`,
          title: formData.get("title").trim(),
          published: formData.get("published") === "true",
          lessons: [],
        });
      }
      showToast(existing ? "Módulo actualizado" : "Módulo creado correctamente");
    } else if (type === "create-task") {
      course.tasks.push({
        id: `${course.slug}-task-${Date.now()}`,
        title: formData.get("title").trim(),
        due: formData.get("due").replace("T", " · "),
        points: Number(formData.get("points")),
        status: "active",
        submissions: 0,
        submitted: false,
      });
      showToast("Tarea publicada correctamente");
    } else if (type === "create-evaluation") {
      course.evaluations.push({
        id: `${course.slug}-eval-${Date.now()}`,
        title: formData.get("title").trim(),
        date: formData.get("date"),
        questions: Number(formData.get("questions")),
        attempts: Number(formData.get("attempts")),
        time: Number(formData.get("time")),
        points: Number(formData.get("points")),
        status: "pending",
      });
      showToast("Evaluación creada correctamente");
    } else if (type === "create-category" || type === "edit-category") {
      const existing = course.gradeCategories.find(function (category) { return category.id === modal.dataset.itemId; });
      if (existing) {
        existing.name = formData.get("name").trim();
        existing.weight = Number(formData.get("weight"));
      } else {
        course.gradeCategories.push({ id: `${course.slug}-grade-${Date.now()}`, name: formData.get("name").trim(), weight: Number(formData.get("weight")) });
      }
      showToast(existing ? "Categoría actualizada" : "Categoría agregada");
    } else if (type === "create-announcement") {
      course.announcements.unshift({ id: `${course.slug}-announcement-${Date.now()}`, title: formData.get("title").trim(), text: formData.get("text").trim(), date: "Ahora" });
      showToast("Anuncio publicado para el curso");
    } else if (type === "upload-file") {
      course.files.push({ id: `${course.slug}-file-${Date.now()}`, name: formData.get("name").trim(), module: formData.get("module"), size: "1.8 MB", type: "pdf" });
      showToast("Archivo añadido a la biblioteca");
    }
    saveData();
    closeModal();
    render();
  }

  function handleModuleAction(action, moduleId) {
    const course = state.data.courses[state.courseSlug];
    const index = course.modules.findIndex(function (module) { return module.id === moduleId; });
    if (index < 0) return;
    const module = course.modules[index];
    if (action === "edit") {
      openModuleForm(module);
      return;
    }
    if (action === "delete") {
      if (!window.confirm(`¿Eliminar el módulo “${module.title}”?`)) return;
      course.modules.splice(index, 1);
      showToast("Módulo eliminado");
    } else if (action === "duplicate") {
      const copy = clone(module);
      copy.id = `${course.slug}-module-${Date.now()}`;
      copy.title += " (copia)";
      copy.lessons = copy.lessons.map(function (lesson, lessonIndex) { return { ...lesson, id: `${copy.id}-lesson-${lessonIndex + 1}` }; });
      course.modules.splice(index + 1, 0, copy);
      showToast("Módulo duplicado");
    } else if (action === "toggle") {
      module.published = !module.published;
      showToast(module.published ? "Módulo publicado" : "Módulo ocultado");
    } else if (action === "up" && index > 0) {
      [course.modules[index - 1], course.modules[index]] = [course.modules[index], course.modules[index - 1]];
    } else if (action === "down" && index < course.modules.length - 1) {
      [course.modules[index + 1], course.modules[index]] = [course.modules[index], course.modules[index + 1]];
    }
    saveData();
    render();
  }

  document.addEventListener("click", function (event) {
    const roleButton = event.target.closest(".role-option[data-role]");
    if (roleButton) {
      state.role = roleButton.dataset.role;
      localStorage.setItem("masterfull-academy-role", state.role);
      state.courseTab = "home";
      state.classId = null;
      render();
      showToast(`Vista de ${state.role === "teacher" ? "docente" : "alumno"} activada`);
      return;
    }

    const viewButton = event.target.closest("[data-view]");
    if (viewButton) {
      state.view = viewButton.dataset.view;
      state.courseSlug = null;
      state.courseTab = "home";
      state.classId = null;
      updateRoute(false);
      closeMobileMenu();
      render();
      return;
    }

    const courseButton = event.target.closest("[data-course-open]");
    if (courseButton) {
      state.courseSlug = courseButton.dataset.courseOpen;
      state.view = "course";
      state.courseTab = "home";
      state.classId = null;
      updateRoute(false);
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const tabButton = event.target.closest("[data-course-tab]");
    if (tabButton) {
      state.courseTab = tabButton.dataset.courseTab;
      state.classId = null;
      render();
      return;
    }

    const moduleToggle = event.target.closest("[data-module-toggle]");
    if (moduleToggle) {
      const card = moduleToggle.closest(".module-card");
      card.classList.toggle("open");
      return;
    }

    const moduleAction = event.target.closest("[data-module-action]");
    if (moduleAction && state.role === "teacher") {
      handleModuleAction(moduleAction.dataset.moduleAction, moduleAction.dataset.moduleId);
      return;
    }

    const lessonComplete = event.target.closest("[data-lesson-complete]");
    if (lessonComplete && state.role === "student") {
      const course = state.data.courses[state.courseSlug];
      course.modules.forEach(function (module) {
        const lesson = module.lessons.find(function (item) { return item.id === lessonComplete.dataset.lessonComplete; });
        if (lesson) lesson.completed = true;
      });
      const lessons = course.modules.flatMap(function (module) { return module.lessons; });
      course.progress = Math.round((lessons.filter(function (lesson) { return lesson.completed; }).length / Math.max(lessons.length, 1)) * 100);
      saveData();
      showToast("Clase marcada como completada");
      render();
      return;
    }

    const classButton = event.target.closest("[data-class-open]");
    if (classButton) {
      state.classId = classButton.dataset.classOpen;
      state.courseTab = "classes";
      render();
      return;
    }

    const taskSubmit = event.target.closest("[data-task-submit]");
    if (taskSubmit && state.role === "student") {
      const course = state.data.courses[state.courseSlug];
      const task = course.tasks.find(function (item) { return item.id === taskSubmit.dataset.taskSubmit; });
      if (task) task.submitted = true;
      saveData();
      showToast("Tarea entregada correctamente");
      render();
      return;
    }

    const attendanceButton = event.target.closest("[data-attendance]");
    if (attendanceButton && state.role === "teacher") {
      const course = state.data.courses[state.courseSlug];
      const student = course.students.find(function (item) { return item.id === attendanceButton.dataset.studentId; });
      if (student) student.attendance = attendanceButton.dataset.attendance;
      saveData();
      showToast("Asistencia actualizada");
      render();
      return;
    }

    const categoryButton = event.target.closest("[data-category-edit]");
    if (categoryButton && state.role === "teacher") {
      const course = state.data.courses[state.courseSlug];
      openCategoryForm(course.gradeCategories.find(function (category) { return category.id === categoryButton.dataset.categoryEdit; }));
      return;
    }

    const messageCourse = event.target.closest("[data-message-course]");
    if (messageCourse) {
      content.innerHTML = renderMessages(messageCourse.dataset.messageCourse);
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    const action = actionButton.dataset.action;

    if (action === "notifications") openNotifications();
    else if (action === "close-notifications") closeNotifications();
    else if (action === "close-modal") closeModal();
    else if (action === "quick-task" || action === "create-task") {
      if (!state.courseSlug) state.courseSlug = "fisica";
      openTaskForm();
    } else if (action === "create-module") openModuleForm();
    else if (action === "create-evaluation") openEvaluationForm();
    else if (action === "create-category") openCategoryForm();
    else if (action === "create-announcement") {
      openModal("create-announcement", { title: "Publicar anuncio", html: simpleForm(`<div class="form-field"><label>Título</label><input name="title" required></div><div class="form-field"><label>Mensaje</label><textarea name="text" required></textarea></div>`, "Publicar anuncio") });
    } else if (action === "upload-file") {
      const course = state.data.courses[state.courseSlug];
      openModal("upload-file", { title: "Subir archivo", html: simpleForm(`<div class="form-field"><label>Nombre del archivo</label><input name="name" required placeholder="Ej. Guía de práctica.pdf"></div><div class="form-field"><label>Módulo</label><select name="module"><option>General</option>${course.modules.map(function (module) { return `<option>${escapeHtml(module.title)}</option>`; }).join("")}</select></div>`, "Añadir archivo") });
    } else if (action === "student-preview" && state.role === "teacher") {
      state.role = "student";
      localStorage.setItem("masterfull-academy-role", state.role);
      showToast("Vista del estudiante activada");
      render();
    } else if (action === "close-class") {
      state.classId = null;
      render();
    } else if (action === "next-class") {
      const course = state.data.courses[state.courseSlug];
      const lessons = course.modules.flatMap(function (module) { return module.lessons; });
      const index = lessons.findIndex(function (lesson) { return lesson.id === state.classId; });
      state.classId = lessons[Math.min(index + 1, lessons.length - 1)].id;
      render();
    } else if (["support","profile-menu","create-course","create-class","edit-course","new-event","feedback","evaluation-results","start-evaluation","filter-students","add-student","message-student","download-file","delete-file"].includes(action)) {
      showToast("Función preparada para la siguiente etapa del producto");
    }
  });

  document.addEventListener("submit", function (event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault();
    if (form.dataset.form === "modal") {
      handleModalSubmit(form);
    } else if (form.dataset.form === "course-settings") {
      const data = new FormData(form);
      const course = state.data.courses[state.courseSlug];
      course.title = data.get("title").trim();
      course.description = data.get("description").trim();
      course.code = data.get("code").trim();
      course.published = data.get("published") === "true";
      saveData();
      showToast("Configuración del curso guardada");
      render();
    } else if (form.dataset.form === "message") {
      const data = new FormData(form);
      const courseName = state.courseSlug ? state.data.courses[state.courseSlug].title : "Física";
      state.data.messages.push({ id: Date.now(), course: courseName, sender: currentUser().name, text: data.get("message").trim(), time: "Ahora", mine: true });
      saveData();
      showToast("Mensaje enviado");
      form.reset();
      render();
    } else if (form.dataset.form === "profile") {
      showToast("Perfil actualizado");
    }
  });

  document.addEventListener("change", function (event) {
    if (event.target.matches("[data-class-notes]")) {
      localStorage.setItem(`academy-notes-${event.target.dataset.classNotes}`, event.target.value);
      showToast("Notas personales guardadas");
    }
  });

  mobileMenuBtn.addEventListener("click", function () {
    const open = sidebar.classList.toggle("open");
    sidebarBackdrop.classList.toggle("open", open);
    mobileMenuBtn.setAttribute("aria-expanded", String(open));
  });

  sidebarBackdrop.addEventListener("click", closeMobileMenu);

  const searchInput = document.getElementById("globalSearch");
  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      state.search = searchInput.value;
      state.courseSlug = null;
      state.view = "courses";
      updateRoute(false);
      render();
    }
  });

  document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchInput.closest(".global-search").classList.add("mobile-open");
      searchInput.focus();
    }
    if (event.key === "Escape") {
      closeModal();
      closeNotifications();
      closeMobileMenu();
    }
  });

  window.addEventListener("popstate", function () {
    readRoute();
    render();
  });

  readRoute();
  updateRoute(true);
  render();
});
