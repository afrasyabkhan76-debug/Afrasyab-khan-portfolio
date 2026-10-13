var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- 1. Dark / light theme (remembers your choice) ----------
var root = document.documentElement;
var themeBtn = document.getElementById("theme-btn");

function applyTheme(theme) {
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    themeBtn.textContent = "Light";
  } else {
    root.removeAttribute("data-theme");
    themeBtn.textContent = "Dark";
  }
}
var savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
applyTheme(savedTheme === "dark" ? "dark" : "light");

themeBtn.addEventListener("click", function () {
  var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------- 2. Mobile menu ----------
var nav = document.getElementById("nav");
var menuBtn = document.getElementById("menu-btn");
menuBtn.addEventListener("click", function () {
  var open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", function (e) {
  if (e.target.tagName === "A") {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

// ---------- 3. Scroll: progress bar, header shadow, active link, back-to-top ----------
var progress = document.getElementById("progress");
var header = document.getElementById("header");
var toTop = document.getElementById("to-top");
var links = document.querySelectorAll(".nav a");
var sections = document.querySelectorAll("main section[id]");

function onScroll() {
  var max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
  header.classList.toggle("scrolled", window.scrollY > 10);
  toTop.classList.toggle("show", window.scrollY > 600);
  var current = "";
  sections.forEach(function (sec) {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  links.forEach(function (a) {
    a.classList.toggle("active", a.getAttribute("href") === "#" + current);
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

// ---------- 4. Reveal on scroll ----------
var revealItems = document.querySelectorAll(".reveal, .title-bar");
if ("IntersectionObserver" in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  revealItems.forEach(function (el) { io.observe(el); });
} else {
  revealItems.forEach(function (el) { el.classList.add("in"); });
}

// ---------- 5. Typing effect in the hero ----------
var typedEl = document.getElementById("typed");
var roles = ["Flutter Developer", "App Developer", "Mobile UI Builder", "Student Programmer"];
var roleIndex = 0, charIndex = roles[0].length, deleting = true;

function typeLoop() {
  var word = roles[roleIndex];
  if (deleting) {
    charIndex--;
    typedEl.textContent = word.substring(0, charIndex);
    if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    setTimeout(typeLoop, 45);
  } else {
    var next = roles[roleIndex];
    charIndex++;
    typedEl.textContent = next.substring(0, charIndex);
    if (charIndex === next.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    setTimeout(typeLoop, 90);
  }
}
if (!reduceMotion) setTimeout(typeLoop, 2200);

// ---------- 6. Glow that follows the mouse on project cards ----------
document.querySelectorAll(".project-card").forEach(function (card) {
  card.addEventListener("mousemove", function (e) {
    var r = card.getBoundingClientRect();
    card.style.setProperty("--mx", (e.clientX - r.left) + "px");
    card.style.setProperty("--my", (e.clientY - r.top) + "px");
  });
});

// ---------- 7. Copy email button ----------
var copyBtn = document.getElementById("copy-btn");
var note = document.getElementById("copy-note");
var email = document.getElementById("mail").textContent;

copyBtn.addEventListener("click", function () {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(
      function () { note.textContent = "Email copied."; },
      function () { note.textContent = "Could not copy. Please select the email and copy it."; }
    );
  } else {
    note.textContent = "Could not copy. Please select the email and copy it.";
  }
});

// ---------- 8. Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();