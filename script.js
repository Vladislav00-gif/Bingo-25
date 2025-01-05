// Cache DOM elements that are frequently accessed
const domElements = {
    board: document.querySelector(".bingo-board"),
    modal: document.getElementById("celebration-modal"),
    cells: () => document.querySelectorAll(".bingo-cell"),
    h1: document.querySelector("h1"),
    subtitle: document.querySelector(".subtitle"),
    editBtn: document.getElementById("editButton"),
    acceptBtn: document.getElementById("acceptButton"),
    colorPicker: document.querySelector(".color-picker"),
    closeModalBtn: document.getElementById("closeModal"),
    resetBtn: document.getElementById("resetGame")
  };
  
  // Debounce function to limit frequent function calls
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Optimize localStorage access
  const storage = {
    get: (key, defaultValue) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('LocalStorage write failed:', e);
      }
    }
  };
  
  // Initialize state with optimized localStorage access
  let state = {
    isEditMode: false,
    currentLang: storage.get('bingo-language', 'en'),
    currentTheme: storage.get('bingo-theme', 'cosmic'),
    winCount: storage.get('bingoWinCount', 0),
    completedLines: new Set(storage.get('completedLines', []))
  };
  
  // Translations for different languages
  const translations = {
    en: {
      title: "Goal Bingo 25",
      subtitle: "Transform Your Dreams into Achievements, One Square at a Time ✨",
      editButton: "Edit Goals",
      acceptButton: "Accept",
      playButton: "Play Bingo",
      colorPicker: "Text Color:",
      keepPlaying: "Keep Playing",
      startFresh: "Start Fresh",
      celebrations: [
        {
          title: "🌟 Amazing! 🌟",
          badge: "🏆",
          achievement: "You've completed a BINGO!",
          motivation: "Want to challenge yourself more?",
        },
        {
          title: "🎯 Double Win! 🎯",
          badge: "⭐",
          achievement: "Two BINGOs! You're on fire!",
          motivation: "Keep the momentum going!",
        },
        {
          title: "🔥 Hat-trick! 🔥",
          badge: "🌟",
          achievement: "Three BINGOs! Incredible streak!",
          motivation: "You're unstoppable!",
        },
        {
          title: "⚡ Legendary! ⚡",
          badge: "👑",
          achievement: "Four BINGOs! You're a champion!",
          motivation: "You're making history!",
        },
        {
          title: "🌈 Ultimate Master! 🌈",
          badge: "🎭",
          achievement: "Five BINGOs! Absolute domination!",
          motivation: "You've achieved greatness!",
        },
        {
          title: "✨ Goal Master Supreme! ✨",
          badge: "🌠",
          achievement: "Beyond Ultimate! You're Exceptional!",
          motivation:
            "Your dedication is inspiring! Keep pushing boundaries and achieving greatness. The sky's not the limit - it's just the beginning!",
        },
        {
          title: "🎊 Cosmic Achievement Unlocked! GG! 🎊",
          badge: "💫",
          achievement: "Seven BINGOs! You're Beyond Legendary!",
          motivation:
            "GG WP! May your dreams soar as high as your achievements! You've proven that with dedication and perseverance, anything is possible. Keep shining bright and inspiring others with your incredible journey!",
        },
      ],
    },
    de: {
      title: "Ziel Bingo 25",
      subtitle: "Verwandle deine Träume in Erfolge, Schritt für Schritt ✨",
      editButton: "Ziele Bearbeiten",
      acceptButton: "Bestätigen",
      playButton: "Bingo Spielen",
      colorPicker: "Textfarbe:",
      keepPlaying: "Weiterspielen",
      startFresh: "Neu Starten",
      celebrations: [
        {
          title: "🌟 Fantastisch! 🌟",
          badge: "🏆",
          achievement: "Du hast ein BINGO geschafft!",
          motivation: "Bereit für mehr Herausforderungen?",
        },
        {
          title: "🎯 Doppelter Erfolg! 🎯",
          badge: "⭐",
          achievement: "Zwei BINGOs! Du bist in Topform!",
          motivation: "Bleib am Ball!",
        },
        {
          title: "🔥 Hattrick! 🔥",
          badge: "🌟",
          achievement: "Drei BINGOs! Unglaubliche Serie!",
          motivation: "Du bist nicht zu stoppen!",
        },
        {
          title: "⚡ Legendär! ⚡",
          badge: "👑",
          achievement: "Vier BINGOs! Du bist ein Champion!",
          motivation: "Du schreibst Geschichte!",
        },
        {
          title: "🌈 Ultimativer Meister! 🌈",
          badge: "🎭",
          achievement: "Fünf BINGOs! Absolute Dominanz!",
          motivation: "Du hast Großartiges erreicht!",
        },
        {
          title: "✨ Zielmeister Supreme! ✨",
          badge: "🌠",
          achievement: "Jenseits des Ultimativen! Du bist außergewöhnlich!",
          motivation:
            "Dein Engagement ist inspirierend! Überwinde weiter Grenzen und erreiche Großes. Der Himmel ist nicht die Grenze - es ist erst der Anfang!",
        },
        {
          title: "🎊 Kosmische Leistung Freigeschaltet! GG! 🎊",
          badge: "💫",
          achievement: "Sieben BINGOs! Du bist mehr als Legendär!",
          motivation:
            "GG WP! Mögen deine Träume so hoch fliegen wie deine Erfolge! Du hast bewiesen, dass mit Hingabe und Ausdauer alles möglich ist. Strahle weiter und inspiriere andere mit deiner unglaublichen Reise!",
        },
      ],
    },  es: {
      title: "Bingo de Objetivos 25",
      subtitle: "Transforma tus Sueños en Logros, Un Paso a la Vez ✨",
      editButton: "Editar Objetivos",
      acceptButton: "Aceptar",
      playButton: "Jugar Bingo",
      colorPicker: "Color del Texto:",
      keepPlaying: "Seguir Jugando",
      startFresh: "Empezar de Nuevo",
      celebrations: [
        {
          title: "🌟 ¡Increíble! 🌟",
          badge: "🏆",
          achievement: "¡Has completado un BINGO!",
          motivation: "¿Listo para más desafíos?",
        },
        {
          title: "🎯 ¡Doble Victoria! 🎯",
          badge: "⭐",
          achievement: "¡Dos BINGOs! ¡Estás en racha!",
          motivation: "¡Mantén el ritmo!",
        },
        {
          title: "🔥 ¡Hat-trick! 🔥",
          badge: "🌟",
          achievement: "¡Tres BINGOs! ¡Racha increíble!",
          motivation: "¡Nada te detiene!",
        },
        {
          title: "⚡ ¡Legendario! ⚡",
          badge: "👑",
          achievement: "¡Cuatro BINGOs! ¡Eres un campeón!",
          motivation: "¡Estás haciendo historia!",
        },
        {
          title: "🌈 ¡Maestro Supremo! 🌈",
          badge: "🎭",
          achievement: "¡Cinco BINGOs! ¡Dominación absoluta!",
          motivation: "¡Has logrado la grandeza!",
        },
        {
          title: "✨ ¡Maestro Supremo de Objetivos! ✨",
          badge: "🌠",
          achievement: "¡Más allá de lo último! ¡Eres excepcional!",
          motivation:
            "¡Tu dedicación es inspiradora! Sigue superando límites y alcanzando la grandeza. El cielo no es el límite - ¡es solo el comienzo!",
        },
        {
          title: "🎊 ¡Logro Cósmico Desbloqueado! ¡GG! 🎊",
          badge: "💫",
          achievement: "¡Siete BINGOs! ¡Eres Más Que Legendario!",
          motivation:
            "¡GG WP! ¡Que tus sueños vuelen tan alto como tus logros! Has demostrado que con dedicación y perseverancia, todo es posible. ¡Sigue brillando e inspirando a otros con tu increíble viaje!",
        },
      ],
    },
    fr: {
      title: "Bingo des Objectifs 25",
      subtitle: "Transformez vos Rêves en Réalisations, Une Case à la Fois ✨",
      editButton: "Modifier les Objectifs",
      acceptButton: "Accepter",
      playButton: "Jouer au Bingo",
      colorPicker: "Couleur du Texte:",
      keepPlaying: "Continuer à Jouer",
      startFresh: "Recommencer",
      celebrations: [
        {
          title: "🌟 Fantastique! 🌟",
          badge: "🏆",
          achievement: "Tu as complété un BINGO!",
          motivation: "Prêt pour plus de défis?",
        },
        {
          title: "🎯 Double Victoire! 🎯",
          badge: "⭐",
          achievement: "Deux BINGOs! Tu es en feu!",
          motivation: "Garde ce rythme!",
        },
        {
          title: "🔥 Hat-trick! 🔥",
          badge: "🌟",
          achievement: "Trois BINGOs! Série incroyable!",
          motivation: "Rien ne t'arrête!",
        },
        {
          title: "⚡ Légendaire! ⚡",
          badge: "👑",
          achievement: "Quatre BINGOs! Tu es un champion!",
          motivation: "Tu écris l'histoire!",
        },
        {
          title: "🌈 Maître Suprême! 🌈",
          badge: "🎭",
          achievement: "Cinq BINGOs! Domination absolue!",
          motivation: "Tu as atteint la grandeur!",
        },
        {
          title: "✨ Maître Suprême des Objectifs! ✨",
          badge: "🌠",
          achievement: "Au-delà de l'ultime! Tu es exceptionnel!",
          motivation:
            "Ta détermination est inspirante! Continue de repousser les limites et d'atteindre la grandeur. Le ciel n'est pas la limite - ce n'est que le début!",
        },
        {
          title: "🎊 Accomplissement Cosmique Débloqué! GG! 🎊",
          badge: "💫",
          achievement: "Sept BINGOs! Tu es Au-delà du Légendaire!",
          motivation:
            "GG WP! Que tes rêves s'élèvent aussi haut que tes réussites! Tu as prouvé qu'avec dévouement et persévérance, tout est possible. Continue de briller et d'inspirer les autres avec ton incroyable voyage!",
        },
      ],
    },
    uk: {
      title: "Бінго Цілей 25",
      subtitle: "Перетворюй Мрії в Досягнення, Крок за Кроком ✨",
      editButton: "Редагувати Цілі",
      acceptButton: "Прийняти",
      playButton: "Грати в Бінго",
      colorPicker: "Колір Тексту:",
      keepPlaying: "Продовжити Гру",
      startFresh: "Почати Заново",
      celebrations: [
        {
          title: "🌟 Неймовірно! 🌟",
          badge: "🏆",
          achievement: "Ти завершив БІНГО!",
          motivation: "Готовий до нових викликів?",
        },
        {
          title: "🎯 Подвійна Перемога! 🎯",
          badge: "⭐",
          achievement: "Два БІНГО! Ти у вогні!",
          motivation: "Тримай цей темп!",
        },
        {
          title: "🔥 Хет-трик! 🔥",
          badge: "🌟",
          achievement: "Три БІНГО! Неймовірна серія!",
          motivation: "Тебе не зупинити!",
        },
        {
          title: "⚡ Легендарно! ⚡",
          badge: "👑",
          achievement: "Чотири БІНГО! Ти чемпіон!",
          motivation: "Ти твориш історію!",
        },
        {
          title: "🌈 Абсолютний Майстер! 🌈",
          badge: "🎭",
          achievement: "П'ять БІНГО! Повне домінування!",
          motivation: "Ти досяг величі!",
        },
        {
          title: "✨ Верховний Майстер Цілей! ✨",
          badge: "🌠",
          achievement: "За межами можливого! Ти феноменальний!",
          motivation:
            "Твоя відданість надихає! Продовжуй долати межі та досягати величі. Небо - це не межа, це лише початок!",
        },
        {
          title: "🎊 Космічне Досягнення Розблоковано! GG! 🎊",
          badge: "💫",
          achievement: "Сім БІНГО! Ти Поза Межами Легендарного!",
          motivation:
            "GG WP! Нехай твої мрії злітають так високо, як твої досягнення! Ти довів, що з відданістю та наполегливістю можливо все. Продовжуй сяяти та надихати інших своїм неймовірним шляхом!",
        },
      ],
    },
  };
  
  // Add these CSS variables to define the themes
  const themes = {
    cosmic: {
      bgGradient1: "#1a1f4b",
      bgGradient2: "#4a1155",
      cellBg: "rgba(30, 30, 60, 0.95)",
      cellHover: "rgba(40, 40, 80, 0.95)",
      cellMarked: "linear-gradient(135deg, #9d50bb 0%, #6e48aa 50%, #4c3499 100%)",
      textColor: "#fff",
      shadowColor: "rgba(147, 86, 220, 0.3)",
      buttonGradient: "linear-gradient(135deg, #9d50bb, #6e48aa)",
      modalBg: "linear-gradient(135deg, #1a1f4b 0%, #4a1155 100%)"
    },
    ocean: {
      bgGradient1: "#000046",
      bgGradient2: "#1cb5e0",
      cellBg: "rgba(0, 20, 40, 0.95)",
      cellHover: "rgba(0, 30, 60, 0.95)",
      cellMarked: "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)",
      textColor: "#b4e7ff",
      shadowColor: "rgba(0, 210, 255, 0.3)",
      buttonGradient: "linear-gradient(135deg, #00d2ff, #3a7bd5)",
      modalBg: "linear-gradient(135deg, #000046 0%, #1cb5e0 100%)"
    },
    forest: {
      bgGradient1: "#134e5e",
      bgGradient2: "#71b280",
      cellBg: "rgba(20, 40, 30, 0.95)",
      cellHover: "rgba(30, 50, 40, 0.95)",
      cellMarked: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
      textColor: "#e0ffe7",
      shadowColor: "rgba(86, 171, 47, 0.3)",
      buttonGradient: "linear-gradient(135deg, #56ab2f, #a8e063)",
      modalBg: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)"
    }
  };
  
  // Initialize everything when the DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    // Initialize language and theme
    updateLanguage(state.currentLang);
    updateTheme(state.currentTheme);
  
    // Load saved state
    state.winCount = parseInt(localStorage.getItem("bingoWinCount")) || 0;
    const savedLines = localStorage.getItem("completedLines");
    if (savedLines) {
      state.completedLines = new Set(JSON.parse(savedLines));
    }
  
    // Load saved goals
    loadGoals();
  
    // Initialize the board
    createBingoBoard();
  });
  
  // Board creation and management
  function createBingoBoard() {
    const fragment = document.createDocumentFragment();
    const cell = document.createElement("div");
    cell.className = "bingo-cell";
    cell.contentEditable = "false";
    
    for (let i = 0; i < 25; i++) {
      const newCell = cell.cloneNode(true);
      newCell.addEventListener("click", handleCellClick, { passive: true });
      fragment.appendChild(newCell);
    }
    
    domElements.board.innerHTML = "";
    domElements.board.appendChild(fragment);
  }
  
  function handleCellClick(event) {
    if (!state.isEditMode) {
      event.target.classList.toggle("marked");
      saveGoals();
      checkWin();
    }
  }
  
  // Game state management
  function saveGoals() {
    const cells = document.querySelectorAll(".bingo-cell");
    const goals = [...cells].map((cell) => ({
      html: cell.innerHTML,
      marked: cell.classList.contains("marked"),
    }));
    localStorage.setItem("bingoGoals", JSON.stringify(goals));
    localStorage.setItem("completedLines", JSON.stringify([...state.completedLines]));
  }
  
  function loadGoals() {
    const savedGoals = localStorage.getItem("bingoGoals");
    if (savedGoals) {
      const goals = JSON.parse(savedGoals);
      const cells = document.querySelectorAll(".bingo-cell");
      cells.forEach((cell, index) => {
        cell.innerHTML = goals[index].html || "";
        if (goals[index].marked) {
          cell.classList.add("marked");
        }
      });
    }
  }
  
  // Win detection and celebration
  function checkWin() {
    const cells = [...domElements.cells()];
    let newWin = false;
  
    // Check rows and columns simultaneously
    for (let i = 0; i < 5; i++) {
      const rowStart = i * 5;
      const rowKey = `row-${i}`;
      const colKey = `col-${i}`;
  
      if (!state.completedLines.has(rowKey) && 
          cells.slice(rowStart, rowStart + 5).every(cell => cell.classList.contains("marked"))) {
        state.completedLines.add(rowKey);
        newWin = true;
      }
  
      if (!state.completedLines.has(colKey) && 
          [0,1,2,3,4].every(j => cells[i + j * 5].classList.contains("marked"))) {
        state.completedLines.add(colKey);
        newWin = true;
      }
    }
  
    // Optimize diagonal checks
    const diagonals = {
      'diag-1': [0, 6, 12, 18, 24],
      'diag-2': [4, 8, 12, 16, 20]
    };
  
    Object.entries(diagonals).forEach(([key, indices]) => {
      if (!state.completedLines.has(key) && 
          indices.every(i => cells[i].classList.contains("marked"))) {
        state.completedLines.add(key);
        newWin = true;
      }
    });
  
    if (newWin) {
      requestAnimationFrame(() => showCelebration());
      saveGoals();
    }
  }
  
  // UI Updates and Event Handlers
  function showCelebration() {
    const modal = document.getElementById("celebration-modal");
    const content = modal.querySelector(".celebration-content");
    const celebrationIndex = Math.min(
      state.winCount,
      translations[state.currentLang].celebrations.length - 1
    );
    const celebration = translations[state.currentLang].celebrations[celebrationIndex];
  
    content.querySelector("h2").textContent = celebration.title;
    content.querySelector(".achievement-badge").textContent = celebration.badge;
    content.querySelector(".achievement-text").textContent = celebration.achievement;
    content.querySelector(".motivation-text").textContent = celebration.motivation;
  
    modal.style.display = "flex";
    setTimeout(() => {
      modal.classList.add("show");
      createConfetti();
    }, 10);
  
    state.winCount++;
    localStorage.setItem("bingoWinCount", state.winCount);
  }
  
  // Language and Theme Management
  function updateLanguage(lang) {
    state.currentLang = lang;
    localStorage.setItem("bingo-language", lang);
  
    document.querySelector("h1").textContent = translations[lang].title;
    document.querySelector(".subtitle").textContent = translations[lang].subtitle;
    document.getElementById("editButton").textContent = translations[lang].editButton;
    document.getElementById("acceptButton").textContent = translations[lang].acceptButton;
    document.querySelector(".color-picker label").textContent = translations[lang].colorPicker;
    document.getElementById("closeModal").textContent = translations[lang].keepPlaying;
    document.getElementById("resetGame").textContent = translations[lang].startFresh;
  
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }
  
  function updateTheme(themeName) {
    const theme = themes[themeName];
    document.documentElement.style.setProperty('--bg-gradient-1', theme.bgGradient1);
    document.documentElement.style.setProperty('--bg-gradient-2', theme.bgGradient2);
    document.documentElement.style.setProperty('--cell-bg', theme.cellBg);
    document.documentElement.style.setProperty('--cell-hover', theme.cellHover);
    document.documentElement.style.setProperty('--cell-marked', theme.cellMarked);
    document.documentElement.style.setProperty('--text-color', theme.textColor);
    document.documentElement.style.setProperty('--shadow-color', theme.shadowColor);
    document.documentElement.style.setProperty('--button-gradient', theme.buttonGradient);
    document.documentElement.style.setProperty('--modal-bg', theme.modalBg);
  
    state.currentTheme = themeName;
    localStorage.setItem("bingo-theme", themeName);
  
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.theme === themeName);
    });
  }
  
  // Event Listeners
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      updateLanguage(btn.dataset.lang);
    });
  });
  
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      updateTheme(btn.dataset.theme);
    });
  });
  
  document.getElementById("editButton").addEventListener("click", () => {
    state.isEditMode = true;
    document.querySelector(".bingo-board").classList.add("edit-mode");
    document.getElementById("editButton").style.display = "none";
    document.getElementById("acceptButton").style.display = "inline-block";
    document.querySelector(".color-picker").style.display = "flex";
    
    const cells = document.querySelectorAll(".bingo-cell");
    cells.forEach(cell => {
      cell.contentEditable = "true";
    });
  });
  
  document.getElementById("acceptButton").addEventListener("click", () => {
    state.isEditMode = false;
    document.querySelector(".bingo-board").classList.remove("edit-mode");
    document.getElementById("editButton").style.display = "inline-block";
    document.getElementById("acceptButton").style.display = "none";
    document.querySelector(".color-picker").style.display = "none";
    
    const cells = document.querySelectorAll(".bingo-cell");
    cells.forEach(cell => {
      cell.contentEditable = "false";
    });
    saveGoals();
  });
  
  document.getElementById("closeModal").addEventListener("click", () => {
    const modal = document.getElementById("celebration-modal");
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 500);
  });
  
  document.getElementById("resetGame").addEventListener("click", () => {
    // Reset all game state
    state.winCount = 0;
    state.completedLines = new Set();
    localStorage.setItem("bingoWinCount", "0");
    localStorage.removeItem("completedLines");
    
    // Clear all marked cells
    const cells = document.querySelectorAll(".bingo-cell");
    cells.forEach(cell => {
      cell.classList.remove("marked");
    });
    
    // Save the cleared state
    saveGoals();
    
    // Close the modal
    const modal = document.getElementById("celebration-modal");
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 500);
  });
  
  // Color picker functionality
  document.getElementById("colorPicker").addEventListener("input", (event) => {
    const color = event.target.value;
    const selectedCell = document.querySelector(".bingo-cell:focus");
    if (selectedCell) {
      selectedCell.style.color = color;
    }
  });
  
  // Confetti celebration effect
  function createConfetti() {
    const fragment = document.createDocumentFragment();
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    
    requestAnimationFrame(() => {
      for (let i = 0; i < 100; i++) {
        const piece = confetti.cloneNode(true);
        piece.style.cssText = `
          background: ${gradients[Math.floor(Math.random() * gradients.length)]};
          left: ${Math.random() * 100}vw;
          animation-duration: ${Math.random() * 3 + 2}s;
          opacity: ${Math.random() * 0.8 + 0.2};
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        `;
        fragment.appendChild(piece);
        setTimeout(() => piece.remove(), 5000);
      }
      document.body.appendChild(fragment);
    });
  }
  
  // Optimize event listeners with delegation where possible
  document.addEventListener('click', (e) => {
    const target = e.target;
    
    if (target.classList.contains('lang-btn')) {
      updateLanguage(target.dataset.lang);
    } else if (target.classList.contains('theme-btn')) {
      updateTheme(target.dataset.theme);
    }
  }, { passive: true });
  
  // Debounce save operations
  const debouncedSave = debounce(saveGoals, 300);
  
  // Use more efficient selectors
  document.addEventListener('input', (e) => {
    if (e.target.id === 'colorPicker') {
      const selectedCell = document.activeElement;
      if (selectedCell?.classList.contains('bingo-cell')) {
        selectedCell.style.color = e.target.value;
      }
    }
  }, { passive: true });
  
  