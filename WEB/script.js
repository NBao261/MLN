document.addEventListener('DOMContentLoaded', () => {
  initObservers();
  initCrossword();
  initScrollSpy();
  initInkTimeline();
  initDaVinciMap();
  initRailToggle();
});

/* ============================================
   RAIL TOGGLE (SIDE NAVIGATION)
   ============================================ */
function initRailToggle() {
  const railToggle  = document.getElementById('railToggle');
  const chapterRail = document.getElementById('chapterRail');
  if (!railToggle || !chapterRail) return;

  let hideTimer = null;

  function showRail() {
    clearTimeout(hideTimer);
    chapterRail.classList.remove('rail-hidden');
    chapterRail.classList.add('rail-visible');
    railToggle.classList.add('hidden');
  }

  function scheduleHide() {
    hideTimer = setTimeout(() => {
      chapterRail.classList.remove('rail-visible');
      chapterRail.classList.add('rail-hidden');
      railToggle.classList.remove('hidden');
    }, 300); // delay 300ms
  }

  // Hover vào nút → hiện rail
  railToggle.addEventListener('mouseenter', showRail);

  // Hover vào rail → giữ rail
  chapterRail.addEventListener('mouseenter', () => clearTimeout(hideTimer));

  // Rời khỏi rail → ẩn
  chapterRail.addEventListener('mouseleave', scheduleHide);

  // Click nút → toggle
  railToggle.addEventListener('click', () => {
    if (chapterRail.classList.contains('rail-hidden')) {
      showRail();
    } else {
      scheduleHide();
    }
  });

  // Click ra ngoài → ẩn
  document.addEventListener('click', (e) => {
    if (!chapterRail.contains(e.target) && !railToggle.contains(e.target)) {
      scheduleHide();
    }
  });
}

/* ============================================
   INTERSECTION OBSERVERS (Fade-in, Typewriter)
   ============================================ */
function initObservers() {
  const fadeEls = document.querySelectorAll('.fade-in');
  const typewriters = document.querySelectorAll('.typewriter-classic');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('fade-in')) {
          entry.target.classList.add('visible');
        }
        if (entry.target.classList.contains('typewriter-classic')) {
          entry.target.style.animation = 'none';
          entry.target.offsetHeight; /* trigger reflow */
          entry.target.style.animation = null; 
        }
      }
    });
  }, { threshold: 0.2 });

  fadeEls.forEach(el => observer.observe(el));
  typewriters.forEach(el => observer.observe(el));
}

/* ============================================
   SCROLLSPY (SIDE RAIL NAVIGATION)
   ============================================ */
function initScrollSpy() {
  const sections = document.querySelectorAll('.section');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-target') === current) {
        item.classList.add('active');
      }
    });
  });
}

/* ============================================
   INK TIMELINE LOGIC (SECTION 4)
   ============================================ */
function initInkTimeline() {
  const section4 = document.getElementById('section-4');
  const timelineProgress = document.getElementById('timelineProgress');
  const items = document.querySelectorAll('.timeline-item');
  const timelineLine = document.querySelector('.timeline-line');

  if (!section4 || !timelineProgress || !timelineLine) return;

  window.addEventListener('scroll', () => {
    const rect = section4.getBoundingClientRect();
    const sectionTop = rect.top;
    const windowHeight = window.innerHeight;

    // Only process if section is in view
    if (sectionTop < windowHeight && rect.bottom > 0) {
      // Calculate how far we scrolled into the section
      let progress = (windowHeight / 2 - sectionTop) / (rect.height);
      progress = Math.max(0, Math.min(1, progress)); // Clamp 0-1

      // Set progress line height
      const totalHeight = timelineLine.clientHeight;
      timelineProgress.style.height = `${progress * totalHeight}px`;

      // Activate items based on progress
      items.forEach((item, index) => {
        const itemTop = item.offsetTop;
        if (progress * totalHeight > itemTop - 20) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  });
}

/* ============================================
   DA VINCI SVG MAP (SECTION 3)
   ============================================ */
function initDaVinciMap() {
  const nodes = document.querySelectorAll('.map-node');
  const tooltip = document.getElementById('mapTooltip');

  if (!tooltip) return;

  // Sửa lỗi position: fixed bị giới hạn bởi transform của thẻ cha
  document.body.appendChild(tooltip);

  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      const info = node.getAttribute('data-info');
      tooltip.innerHTML = info.replace(': ', ':<br><strong>') + '</strong>'; // Thêm chút highlight cho text
      tooltip.classList.add('show');
    });

    node.addEventListener('mousemove', (e) => {
      // Vị trí tooltip theo chuột
      let left = e.clientX + 20;
      let top = e.clientY + 20;
      
      // Chống tràn màn hình
      if (left + 320 > window.innerWidth) left = e.clientX - 340;
      
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    });

    node.addEventListener('mouseleave', () => {
      tooltip.classList.remove('show');
    });
  });
}

/* ============================================
   CROSSWORD GAME LOGIC (INK STYLE)
   ============================================ */
const cwData = [
  { answer: "GIAICAP", highlightIdx: 4, question: "Câu 1: Bản chất của Nhà nước là công cụ chuyên chính của một... thống trị?" },
  { answer: "BAOLUC", highlightIdx: 1, question: "Câu 2: Phương pháp cách mạng tất yếu khi chính quyền cũ dùng cảnh sát Robot đàn áp?" },
  { answer: "DAOCHINH", highlightIdx: 3, question: "Câu 3: Hành động lật đổ chính quyền nhưng không làm thay đổi bản chất chế độ bóc lột?" },
  { answer: "HOABINH", highlightIdx: 0, question: "Câu 4: Phương pháp hiếm khi xảy ra, trừ khi giai cấp thống trị không còn bộ máy bạo lực?" },
  { answer: "MAUTHUAN", highlightIdx: 0, question: "Câu 5: Nguyên nhân sâu xa của Cách mạng là do sự gay gắt của yếu tố này?" },
  { answer: "NHANUOC", highlightIdx: 2, question: "Câu 6: Tổ chức có 'đội vũ trang đặc biệt' tách rời khỏi quần chúng để duy trì trật tự?" },
  { answer: "NHANLOAI", highlightIdx: 0, question: "Câu 7: Giải phóng giai cấp là tiền đề để giải phóng toàn...?" },
  { answer: "CAILUONG", highlightIdx: 7, question: "Câu 8: Trào lưu chỉ xoa dịu bề ngoài (như xin UBI) chứ không thay đổi quyền sở hữu?" }
];

let revealedCount = 0;

function initCrossword() {
  const board = document.getElementById('crosswordBoard');
  if (!board) return;

  const maxHighlightIdx = Math.max(...cwData.map(r => r.highlightIdx));

  cwData.forEach((row, rowIndex) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'cw-row';
    rowDiv.id = `cw-row-${rowIndex}`;

    const offset = maxHighlightIdx - row.highlightIdx;
    rowDiv.style.marginLeft = `calc(${offset} * 41px)`; // 38px width + 3px gap

    // Row number
    const numDiv = document.createElement('div');
    numDiv.className = 'cw-row-num';
    numDiv.textContent = rowIndex + 1;
    rowDiv.appendChild(numDiv);

    const inputs = [];
    for (let i = 0; i < row.answer.length; i++) {
      const cell = document.createElement('div');
      cell.className = 'cw-cell';
      if (i === row.highlightIdx) cell.classList.add('highlight');

      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.className = 'cw-input';
      input.dataset.row = rowIndex;
      input.dataset.col = i;
      
      input.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
        if (this.value && i < row.answer.length - 1) {
          inputs[i + 1].focus();
        }
      });

      input.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && !this.value && i > 0) {
          inputs[i - 1].focus();
        }
      });

      input.addEventListener('focus', () => {
        document.querySelectorAll('.cw-row').forEach(r => r.classList.remove('active-row'));
        rowDiv.classList.add('active-row');
        showQuestion(rowIndex, row);
      });

      cell.appendChild(input);
      inputs.push(input);
      rowDiv.appendChild(cell);
    }

    rowDiv.addEventListener('click', (e) => {
      // If clicking outside an input (e.g. padding), focus the first empty input
      if (e.target.tagName !== 'INPUT') {
        const firstEmpty = inputs.find(inp => !inp.value && !inp.readOnly) || inputs[0];
        firstEmpty.focus();
      }
    });

    board.appendChild(rowDiv);
  });
}

function showQuestion(rowIndex, rowData) {
  const panel = document.getElementById('cwQuestionPanel');
  const placeholder = document.getElementById('cwPlaceholder');

  if (placeholder) placeholder.style.display = 'none';

  // Xoá card cũ
  const old = panel.querySelector('.cw-question-card');
  if (old) old.remove();

  const isRevealed = document.getElementById(`cw-row-${rowIndex}`).classList.contains('revealed');

  const card = document.createElement('div');
  card.className = 'cw-question-card';
  card.innerHTML = `
    <div class="cw-question-num">Hàng ngang số ${rowIndex + 1} · ${rowData.answer.length} ô</div>
    <p class="cw-question-text">${rowData.question}</p>
    <p class="cw-hint-text">${rowData.hint || ''}</p>
    <button class="cw-reveal-answer-btn ${isRevealed ? 'done' : ''}" id="revealBtn-${rowIndex}">
      ${isRevealed ? '✓ Đã mở' : 'Kiểm tra đáp án →'}
    </button>
  `;

  if (!isRevealed) {
    card.querySelector(`#revealBtn-${rowIndex}`).addEventListener('click', function() {
      checkRowAnswer(rowIndex);
    });
  }

  panel.appendChild(card);
}

function checkRowAnswer(rowIndex) {
  const rowDiv = document.getElementById(`cw-row-${rowIndex}`);
  const inputs = Array.from(rowDiv.querySelectorAll('.cw-input'));
  const currentWord = inputs.map(inp => inp.value).join('');
  const correctAnswer = cwData[rowIndex].answer;

  if (currentWord === correctAnswer) {
    revealRow(rowIndex);
    const btn = document.getElementById(`revealBtn-${rowIndex}`);
    if (btn) {
      btn.classList.add('done');
      btn.textContent = '✓ Đã mở';
    }
  } else {
    // Sai đáp án
    rowDiv.classList.remove('wrong');
    void rowDiv.offsetWidth; // trigger reflow
    rowDiv.classList.add('wrong');
  }
}

function revealRow(rowIndex) {
  const rowDiv = document.getElementById(`cw-row-${rowIndex}`);
  if (!rowDiv.classList.contains('revealed')) {
    const inputs = rowDiv.querySelectorAll('.cw-input');
    const answer = cwData[rowIndex].answer;
    
    // Đổ đáp án đúng vào ô
    inputs.forEach((inp, idx) => {
      inp.value = answer[idx];
      inp.readOnly = true;
    });

    rowDiv.classList.add('revealed');
    rowDiv.classList.remove('active-row', 'wrong');

    revealedCount++;
    const rc = document.getElementById('revealCount');
    if (rc) rc.textContent = revealedCount;
  }
}

function revealKeyword() {
  cwData.forEach((row, rowIndex) => {
    const rowDiv = document.getElementById(`cw-row-${rowIndex}`);
    if (rowDiv && !rowDiv.classList.contains('revealed')) {
      const inputs = rowDiv.querySelectorAll('.cw-input');
      const hIdx = row.highlightIdx;
      if (inputs[hIdx]) {
        inputs[hIdx].value = row.answer[hIdx];
        inputs[hIdx].readOnly = true;
        // Có thể thêm 1 class mờ mờ cho ô đã lộ từ khoá
        inputs[hIdx].parentElement.style.background = 'rgba(139,26,26,0.15)';
      }
    }
  });
}

function revealAll() {
  cwData.forEach((row, i) => revealRow(i));
}
