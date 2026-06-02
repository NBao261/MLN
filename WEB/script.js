document.addEventListener('DOMContentLoaded', () => {
  initObservers();
  initCrossword();
  initScrollSpy();
  initPressureGauge();
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
          if (!entry.target.hasAttribute('data-typed')) {
            entry.target.setAttribute('data-typed', 'true');
            
            // Lấy text hiện tại và làm sạch
            let originalText = entry.target.getAttribute('data-text');
            if (!originalText) {
              originalText = entry.target.textContent.trim();
              entry.target.setAttribute('data-text', originalText);
            }
            
            // Xóa nội dung và thêm con trỏ nhấp nháy
            entry.target.textContent = '';
            const textNode = document.createTextNode('');
            entry.target.appendChild(textNode);
            const cursor = document.createElement('span');
            cursor.className = 'typewriter-cursor';
            entry.target.appendChild(cursor);

            // Gõ chữ
            let i = 0;
            function type() {
              if (i < originalText.length) {
                textNode.nodeValue += originalText.charAt(i);
                i++;
                setTimeout(type, 50); // Tốc độ gõ
              }
            }
            setTimeout(type, 400); // Delay nhẹ trước khi gõ
          }
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
   SECTION 3: STATE TOGGLE (PRESENTATION)
   ============================================ */
let stateRevealed = false;

function toggleStateView() {
  const sceneBright = document.getElementById('sceneBright');
  const sceneDark = document.getElementById('sceneDark');
  const flashOverlay = document.getElementById('stateFlashOverlay');
  const cardBright = document.getElementById('cardBright');
  const cardDark = document.getElementById('cardDark');
  const toggleBtn = document.getElementById('stateToggleBtn');
  const toggleLabel = document.getElementById('stateToggleLabel');

  if (!stateRevealed) {
    // Flash red overlay
    flashOverlay.classList.add('flash-active');
    setTimeout(() => {
      // Switch scenes
      sceneBright.classList.remove('active');
      sceneDark.classList.add('active');
      // Switch cards
      cardBright.style.display = 'none';
      cardDark.style.display = 'block';
      cardDark.style.animation = 'cardRevealDark 0.6s ease forwards';
      // Update button
      toggleBtn.textContent = 'QUAY LẠI VỎ BỌC ←';
      toggleBtn.classList.add('toggled');
      toggleLabel.textContent = 'ĐANG HIỂN THỊ: SỰ THẬT';
      toggleLabel.classList.add('label-red');
      stateRevealed = true;
    }, 300);
    setTimeout(() => flashOverlay.classList.remove('flash-active'), 800);
  } else {
    // Switch back
    sceneDark.classList.remove('active');
    sceneBright.classList.add('active');
    cardDark.style.display = 'none';
    cardBright.style.display = 'block';
    toggleBtn.textContent = 'LỘT MẶT NẠ →';
    toggleBtn.classList.remove('toggled');
    toggleLabel.textContent = 'ĐANG HIỂN THỊ: VỎ BỌC XÃ HỘI';
    toggleLabel.classList.remove('label-red');
    stateRevealed = false;
  }
}

/* ============================================
   SECTION 4: PRESSURE COOKER (PRESENTATION)
   ============================================ */
function initPressureGauge() {
  // Bỏ hiệu ứng tăng áp suất khi cuộn chuột theo yêu cầu
  // Áp suất chỉ tăng khi click vào 2 nút điều khiển
}

/* Click: Gauge -> MAX */
function triggerPressureMax() {
  const gaugeFill = document.getElementById('gaugeFill');
  const gaugeValue = document.getElementById('gaugeValue');
  const pressureGlow = document.getElementById('pressureGlow');
  const steamContainer = document.getElementById('steamContainer');
  const cookerImg = document.querySelector('.pressure-cooker-img');

  if (gaugeFill) {
    gaugeFill.style.transition = 'width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    gaugeFill.style.width = '100%';
  }
  if (gaugeValue) {
    gaugeValue.classList.add('critical');
    // Animate percentage count
    let count = 0;
    const interval = setInterval(() => {
      count += 2;
      if (count > 100) { count = 100; clearInterval(interval); }
      gaugeValue.textContent = 'ÁP SUẤT: ' + count + '%';
    }, 25);
  }
  if (pressureGlow) pressureGlow.classList.add('active');
  if (steamContainer) steamContainer.classList.add('active');
  if (cookerImg) {
    cookerImg.style.transition = 'filter 1s ease';
    cookerImg.style.filter = 'sepia(0) contrast(1.4) brightness(1.1) saturate(1.8)';
  }
}

/* Click: Cooker -> BURST (shake + heavy steam) */
function triggerCookerBurst() {
  const cookerVisual = document.getElementById('pressureCooker');
  const steamContainer = document.getElementById('steamContainer');
  const pressureGlow = document.getElementById('pressureGlow');

  // Ensure max state
  triggerPressureMax();

  // Shake violently
  if (cookerVisual) {
    cookerVisual.style.animation = 'pressureShake 0.1s ease-in-out infinite';
  }
  // Add extra steam elements
  if (steamContainer) {
    steamContainer.classList.add('active', 'burst');
  }
  if (pressureGlow) {
    pressureGlow.classList.add('active', 'burst');
  }
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

/* ============================================
   SECTION 7 CAROUSEL
   ============================================ */
function moveCarousel(direction) {
  const track = document.getElementById('sCarouselTrack');
  const thumbs = track.querySelectorAll('.thumb');
  let activeIndex = -1;
  thumbs.forEach((t, i) => {
    if (t.classList.contains('active')) activeIndex = i;
  });
  
  if (activeIndex > -1) {
    thumbs[activeIndex].classList.remove('active');
    let nextIndex = (activeIndex + direction + thumbs.length) % thumbs.length;
    thumbs[nextIndex].classList.add('active');
    
    // Optional: Update main image source if needed
    const mainImg = document.querySelector('.main-statue');
    if(mainImg) {
      // In a real app, you might map the thumbnails to main images.
      // Here, we just keep the main image or apply a slight animation
      mainImg.style.opacity = 0;
      setTimeout(() => {
        mainImg.style.opacity = 1;
      }, 300);
    }
  }
}

function setActiveThumb(el) {
  const track = document.getElementById('sCarouselTrack');
  const thumbs = track.querySelectorAll('.thumb');
  thumbs.forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  
  const mainImg = document.querySelector('.main-statue');
  if(mainImg) {
    mainImg.style.opacity = 0;
    setTimeout(() => {
      mainImg.style.opacity = 1;
    }, 300);
  }
}
