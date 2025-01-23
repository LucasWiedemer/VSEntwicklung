/****************************************************
 * app.js
 ****************************************************/

// --- 1) SEITEN/ELEMENTE ---
const loginPage = document.getElementById('login-page');
const registerPage = document.getElementById('register-page');
const movieSelectionPage = document.getElementById('movie-selection-page');
const matchResultsPage = document.getElementById('match-results-page');

// Login
const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');
const loginError = document.getElementById('login-error');

// Register
const registerUsername = document.getElementById('register-username');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const registerButton = document.getElementById('register-button');
const registerError = document.getElementById('register-error');
const registerSuccess = document.getElementById('register-success');
const goToRegisterLink = document.getElementById('go-to-register');
const backToLoginButton = document.getElementById('back-to-login');

// Filter
const filterForm = document.getElementById('filter-form');
const categorySelect = document.getElementById('category-select');
const lengthSelect = document.getElementById('length-select');

// Slider
const movieSlider = document.getElementById('movie-slider');
const rejectButton = document.getElementById('reject-button');
const acceptButton = document.getElementById('accept-button');
const submitMoviesButton = document.getElementById('submit-movies-button');

// Match-Ergebnis
const matchInfo = document.getElementById('match-info');
const matchList = document.getElementById('match-list');
const goBackButton = document.getElementById('go-back-button');

// --- 2) MOCK-FILM-DATEN ---
// Mit Kategorie & Länge
const allMovies = [
  {
    id: 1,
    title: "Inception",
    category: "Sci-Fi",
    length: 148,
    image: "https://via.placeholder.com/300x400?text=Inception"
  },
  {
    id: 2,
    title: "Titanic",
    category: "Romance",
    length: 195,
    image: "https://via.placeholder.com/300x400?text=Titanic"
  },
  {
    id: 3,
    title: "The Matrix",
    category: "Action",
    length: 136,
    image: "https://via.placeholder.com/300x400?text=Matrix"
  },
  {
    id: 4,
    title: "The Dark Knight",
    category: "Action",
    length: 152,
    image: "https://via.placeholder.com/300x400?text=Dark+Knight"
  },
  {
    id: 5,
    title: "Forrest Gump",
    category: "Drama",
    length: 142,
    image: "https://via.placeholder.com/300x400?text=Forrest+Gump"
  },
  {
    id: 6,
    title: "Joker",
    category: "Drama",
    length: 122,
    image: "https://via.placeholder.com/300x400?text=Joker"
  }
];

// Eine globale Variable für das aktuell gefilterte Array
let filteredMovies = [];

// Slider-State
let currentIndex = -1;  // = kein Film
let acceptedMovies = [];
let rejectedMovies = [];

// --- 3) LOGIN/REGISTER (FAKE) ---
function handleLogin() {
  loginError.textContent = '';
  const user = loginUsername.value.trim();
  const pw = loginPassword.value.trim();

  if (user === 'test' && pw === '123') {
    // Erfolg
    showPage(movieSelectionPage);
    // Standardmäßig: Noch kein Filter gesetzt -> Alle Filme
    filteredMovies = [...allMovies];
    initSlider();
  } else {
    loginError.textContent = 'Login fehlgeschlagen!';
  }
}

function handleRegister() {
  registerError.textContent = '';
  registerSuccess.textContent = '';

  const user = registerUsername.value.trim();
  const email = registerEmail.value.trim();
  const pw = registerPassword.value.trim();

  if (!user || !email || !pw) {
    registerError.textContent = 'Bitte alle Felder ausfüllen!';
    return;
  }
  // Demo: Erfolg
  registerSuccess.textContent = 'Registrierung erfolgreich! Du kannst dich jetzt einloggen.';
  setTimeout(() => {
    showPage(loginPage);
  }, 2000);
}

// --- 4) FILTER-FUNKTION ---
function filterMovies(category, lengthCategory) {
  let result = [...allMovies];

  // 1) Nach Kategorie filtern
  if (category) {
    result = result.filter(m => m.category === category);
  }

  // 2) Nach Länge filtern: short <=120, medium 120-150, long >150
  if (lengthCategory) {
    if (lengthCategory === 'short') {
      result = result.filter(m => m.length <= 120);
    } else if (lengthCategory === 'medium') {
      result = result.filter(m => m.length > 120 && m.length <= 150);
    } else if (lengthCategory === 'long') {
      result = result.filter(m => m.length > 150);
    }
  }

  return result;
}

// Wird aufgerufen, wenn der User auf "Filtern" klickt
function handleFilterSubmit(event) {
  event.preventDefault();
  // Gewählte Filteroptionen
  const selectedCategory = categorySelect.value; 
  const selectedLength = lengthSelect.value;

  // Lokal filtern
  filteredMovies = filterMovies(selectedCategory, selectedLength);

  // Slider neu initialisieren
  initSlider();
}

// --- 5) SLIDER ---
function initSlider() {
  movieSlider.innerHTML = '';
  acceptedMovies = [];
  rejectedMovies = [];

  if (filteredMovies.length === 0) {
    // Keine Filme -> Kurze Meldung
    movieSlider.innerHTML = '<p style="color:#333; text-align:center;">Keine Filme gefunden. Bitte Filter ändern.</p>';
    currentIndex = -1;
    return;
  }

  // Oberste Karte = letztes Element im Array
  currentIndex = filteredMovies.length - 1;

  // Karten erzeugen (von erstem bis letztem)
  filteredMovies.forEach((movie, index) => {
    const card = document.createElement('div');
    card.classList.add('slider-card');
    card.style.zIndex = index + 1; // hintere Karten haben niedrigeren z-index

    card.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
    `;
    movieSlider.appendChild(card);
  });
}

function handleDecision(isAccepted) {
  if (currentIndex < 0) {
    alert('Keine Filme mehr übrig!');
    return;
  }

  // Oberster Film
  const movie = filteredMovies[currentIndex];
  const card = movieSlider.lastElementChild; // Dom-Element

  if (isAccepted) {
    acceptedMovies.push(movie);
    card.style.transform = 'translateX(200%) rotate(20deg)';
  } else {
    rejectedMovies.push(movie);
    card.style.transform = 'translateX(-200%) rotate(-20deg)';
  }
  card.style.opacity = '0';

  setTimeout(() => {
    if (card.parentNode) {
      card.parentNode.removeChild(card);
    }
  }, 300);

  currentIndex--;
}

// --- 6) ABSENDEN DER AUSWAHL -> MATCH-ERGEBNIS (FAKE) ---
function handleMoviesSubmission() {
  // In echt: fetch('/api/saveSelections', ...) + fetch('/api/matchResult', ...)
  // Hier Mock: Wir tun so, als ob wir eine Schnittmenge mit "anderem User" bilden
  const otherUserLikes = [1, 3, 6]; 
  // IDs, die wir gematched haben:
  const myAcceptedIds = acceptedMovies.map(m => m.id);

  const matchedIds = myAcceptedIds.filter(id => otherUserLikes.includes(id));
  const matchedFilms = allMovies.filter(m => matchedIds.includes(m.id));

  showPage(matchResultsPage);

  if (matchedFilms.length > 0) {
    matchInfo.textContent = `Ihr habt ${matchedFilms.length} gemeinsame Filme!`;
  } else {
    matchInfo.textContent = 'Keine Übereinstimmungen.';
  }

  matchList.innerHTML = '';
  matchedFilms.forEach(f => {
    const li = document.createElement('li');
    li.textContent = f.title;
    matchList.appendChild(li);
  });
}

// --- 7) NAVIGATION ---
function showPage(pageDiv) {
  document.querySelectorAll('.page').forEach(div => {
    div.classList.add('hidden');
  });
  pageDiv.classList.remove('hidden');
}

function handleGoBack() {
  showPage(movieSelectionPage);
  // Filter erneut anwenden (oder Slider resetten)
  initSlider();
}

// --- 8) EVENT-LISTENER ---
loginButton.addEventListener('click', handleLogin);
registerButton.addEventListener('click', handleRegister);

goToRegisterLink.addEventListener('click', (e) => {
  e.preventDefault();
  showPage(registerPage);
});
backToLoginButton.addEventListener('click', () => {
  showPage(loginPage);
});

filterForm.addEventListener('submit', handleFilterSubmit);

rejectButton.addEventListener('click', () => handleDecision(false));
acceptButton.addEventListener('click', () => handleDecision(true));
submitMoviesButton.addEventListener('click', handleMoviesSubmission);

goBackButton.addEventListener('click', handleGoBack);

// Standard: Login-Seite anzeigen
showPage(loginPage);
