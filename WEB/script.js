/* ============================================
   SCRIPT.JS — Dark Academia × Cyberpunk
   Scrollytelling Engine
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Loading Screen ---
  const loadingScreen = document.getElementById('loadingScreen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 1800);
  });
  // Fallback: hide after 4 seconds no matter what
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 4000);

  // --- Floating Particles ---
  createParticles();

  // --- Intersection Observer for Reveal Animations ---
  initRevealAnimations();

  // --- Progress Bar ---
  initProgressBar();

  // --- Navigation Dots ---
  initNavDots();

  // --- Typewriter Effect for Section 5 ---
  initTypewriter();

  // --- Voting System ---
  initVoting();

  // --- Smooth scroll for CTA button ---
  const ctaBtn = document.getElementById('ctaBtn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('section-2');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --- Parallax on background images ---
  initParallax();
});


/* ============================================
   PARTICLES
   ============================================ */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 30;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (8 + Math.random() * 15) + 's';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.width = (1 + Math.random() * 2) + 'px';
    particle.style.height = particle.style.width;

    // Random color: teal or soft red for light theme
    if (Math.random() > 0.7) {
      particle.style.background = '#c41e1e';
      particle.style.boxShadow = '0 0 4px rgba(196,30,30,0.2)';
    } else {
      particle.style.background = '#0e7490';
      particle.style.boxShadow = '0 0 4px rgba(14,116,144,0.2)';
    }

    container.appendChild(particle);
  }
}


/* ============================================
   REVEAL ANIMATIONS (Intersection Observer)
   ============================================ */
function initRevealAnimations() {
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger'
  );

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));
}


/* ============================================
   PROGRESS BAR
   ============================================ */
function initProgressBar() {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  }, { passive: true });
}


/* ============================================
   NAVIGATION DOTS
   ============================================ */
function initNavDots() {
  const dots = document.querySelectorAll('.nav-dot');
  const sections = document.querySelectorAll('.section');

  // Click navigation
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetId = dot.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Update active dot on scroll
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dots.forEach((d) => {
          d.classList.remove('active', 'active-red');
        });
        const activeDot = document.querySelector(`.nav-dot[data-target="${id}"]`);
        if (activeDot) {
          // Use red dot for climax sections
          if (id === 'section-5' || id === 'section-6') {
            activeDot.classList.add('active-red');
          } else {
            activeDot.classList.add('active');
          }
        }
      }
    });
  }, {
    root: null,
    rootMargin: '-30% 0px -30% 0px',
    threshold: 0
  });

  sections.forEach((section) => sectionObserver.observe(section));
}


/* ============================================
   TYPEWRITER EFFECT
   ============================================ */
function initTypewriter() {
  const textEl = document.getElementById('typewriterText');
  if (!textEl) return;

  const fullText = '"CÁCH MẠNG KHÔNG PHẢI LÀ THAY ÁO, MÀ LÀ THAY MÁU."';
  let charIndex = 0;
  let hasStarted = false;

  const section5 = document.getElementById('section-5');

  const typeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasStarted) {
        hasStarted = true;
        typeChar();
      }
    });
  }, { threshold: 0.3 });

  typeObserver.observe(section5);

  function typeChar() {
    if (charIndex < fullText.length) {
      textEl.textContent += fullText.charAt(charIndex);
      charIndex++;
      // Vary speed: slower on punctuation
      const currentChar = fullText.charAt(charIndex - 1);
      const delay = [',', '.', '!', '"', ':'].includes(currentChar) ? 150 : 55;
      setTimeout(typeChar, delay);
    }
  }
}


/* ============================================
   VOTING SYSTEM
   ============================================ */
function initVoting() {
  const options = document.querySelectorAll('.vote-option');
  const resultsDiv = document.getElementById('voteResults');
  const countDiv = document.getElementById('voteCount');

  // Load votes from localStorage
  let votes = JSON.parse(localStorage.getItem('mlnVotes') || '{"reform":0,"coup":0,"revolution":0}');
  let hasVoted = localStorage.getItem('mlnHasVoted') === 'true';

  if (hasVoted) {
    showResults(votes);
  }

  options.forEach((option) => {
    option.addEventListener('click', () => {
      if (hasVoted) return;

      const vote = option.getAttribute('data-vote');

      // Remove previous selection
      options.forEach((o) => o.classList.remove('selected'));

      // Select current
      option.classList.add('selected');

      // Count vote
      votes[vote]++;
      localStorage.setItem('mlnVotes', JSON.stringify(votes));
      localStorage.setItem('mlnHasVoted', 'true');
      hasVoted = true;

      // Show results with animation delay
      setTimeout(() => {
        showResults(votes);
      }, 500);
    });
  });

  function showResults(v) {
    const total = v.reform + v.coup + v.revolution;
    if (total === 0) return;

    const pReform = Math.round((v.reform / total) * 100);
    const pCoup = Math.round((v.coup / total) * 100);
    const pRevolution = Math.round((v.revolution / total) * 100);

    // Animate vote bars
    const reformBar = document.querySelector('.vote-option.reform .vote-bar');
    const coupBar = document.querySelector('.vote-option.coup .vote-bar');
    const revolutionBar = document.querySelector('.vote-option.revolution .vote-bar');

    if (reformBar) reformBar.style.width = pReform + '%';
    if (coupBar) coupBar.style.width = pCoup + '%';
    if (revolutionBar) revolutionBar.style.width = pRevolution + '%';

    // Show count
    resultsDiv.classList.add('visible');
    countDiv.textContent = `Tổng: ${total} phiếu · Cải lương: ${pReform}% · Đảo chính: ${pCoup}% · Cách mạng: ${pRevolution}%`;
  }
}


/* ============================================
   PARALLAX BACKGROUND
   ============================================ */
function initParallax() {
  const bgs = document.querySelectorAll('.section-bg');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    bgs.forEach((bg) => {
      const section = bg.parentElement;
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;
      const offset = (scrollY - sectionTop) * 0.15;
      bg.style.transform = `translateY(${offset}px) scale(1.1)`;
    });
  }, { passive: true });
}


/* ============================================
   KEYBOARD NAVIGATION (Arrow Keys)
   ============================================ */
document.addEventListener('keydown', (e) => {
  const sections = document.querySelectorAll('.section');
  const sectionArray = Array.from(sections);
  
  // Find current section in view
  let currentIndex = 0;
  const scrollY = window.scrollY + window.innerHeight / 2;
  
  sectionArray.forEach((section, index) => {
    if (section.offsetTop <= scrollY) {
      currentIndex = index;
    }
  });

  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault();
    const next = Math.min(currentIndex + 1, sectionArray.length - 1);
    sectionArray[next].scrollIntoView({ behavior: 'smooth' });
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    const prev = Math.max(currentIndex - 1, 0);
    sectionArray[prev].scrollIntoView({ behavior: 'smooth' });
  }
});

/* ============================================
   CROSSWORD GAME LOGIC (SECTION 8)
   ============================================ */
let currentRevealRow = null;

function openCwModal(rowNum, numText, questionText, hintText) {
  currentRevealRow = rowNum;
  const modal = document.getElementById('cwModal');
  if (modal) {
    document.getElementById('cwModalNum').textContent = numText;
    document.getElementById('cwModalText').textContent = questionText;
    document.getElementById('cwModalHint').textContent = hintText;
    modal.classList.add('active');
  }
}

function closeCwModal() {
  const modal = document.getElementById('cwModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function revealFromModal() {
  if (currentRevealRow !== null) {
    revealRow(currentRevealRow);
    closeCwModal();
  }
}

function revealRow(rowNum) {
  const row = document.getElementById('cw-row-' + rowNum);
  if (row) {
    const cells = row.querySelectorAll('.cw-cell');
    cells.forEach(cell => {
      cell.classList.remove('hidden');
    });
  }
}

function revealKeyword() {
  const highlightCells = document.querySelectorAll('.cw-cell.highlight');
  highlightCells.forEach(cell => {
    cell.classList.remove('hidden');
  });
}

function revealAll() {
  const allCells = document.querySelectorAll('.cw-cell');
  allCells.forEach(cell => {
    cell.classList.remove('hidden');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Attach click listeners to all question cards for modal popup
  const cards = document.querySelectorAll('.cw-q-card');
  cards.forEach((card, index) => {
    const rowNum = index + 1;
    card.addEventListener('click', () => {
      const numText = card.querySelector('.cw-q-num').innerText;
      const questionText = card.querySelector('p').innerText;
      const hintText = card.querySelector('.cw-hint').innerText;
      openCwModal(rowNum, numText, questionText, hintText);
    });
    // Prevent the "Mở ô chữ" inner button from opening the modal if clicked directly
    const btn = card.querySelector('.cw-reveal-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        revealRow(rowNum);
      });
    }
  });
});

