/****************************************************
 * movieSelection.js
 ****************************************************/

// 1) MOVIE-Daten (lokal, zur Demo)
// In einer echten Anwendung: Hole Filme aus der Datenbank,
// z.B. per fetch() in der form-Submit-Funktion.
const allMovies = [
  {
    id: 1,
    title: "Inception",
    image: "https://via.placeholder.com/300x400?text=Inception",
    category: "Science Fiction",
    length: 148
  },
  {
    id: 2,
    title: "The Dark Knight",
    image: "https://via.placeholder.com/300x400?text=Dark+Knight",
    category: "Action",
    length: 152
  },
  {
    id: 3,
    title: "Interstellar",
    image: "https://via.placeholder.com/300x400?text=Interstellar",
    category: "Science Fiction",
    length: 169
  },
  {
    id: 4,
    title: "The Matrix",
    image: "https://via.placeholder.com/300x400?text=Matrix",
    category: "Action",
    length: 136
  },
  {
    id: 5,
    title: "Forrest Gump",
    image: "https://via.placeholder.com/300x400?text=Forrest+Gump",
    category: "Drama",
    length: 142
  },
  {
    id: 6,
    title: "Titanic",
    image: "https://via.placeholder.com/300x400?text=Titanic",
    category: "Drama",
    length: 195
  },
  {
    id: 7,
    title: "Avatar",
    image: "https://via.placeholder.com/300x400?text=Avatar",
    category: "Science Fiction",
    length: 162
  },
  {
    id: 8,
    title: "Joker",
    image: "https://via.placeholder.com/300x400?text=Joker",
    category: "Drama",
    length: 122
  },
  {
    id: 9,
    title: "Parasite",
    image: "https://via.placeholder.com/300x400?text=Parasite",
    category: "Thriller",
    length: 132
  },
  {
    id: 10,
    title: "Wolf of Wallstreet",
    image: "https://m.media-amazon.com/images/I/7186p2oTAcL.jpg",
    category: "Comedy",
    length: 180
  },
];

// 2) Globale Variablen zum Speichern
//    - movies: wird nach dem Filtern gefüllt
//    - acceptedMovies / rejectedMovies für spätere Verarbeitung
let movies = [];
const acceptedMovies = [];
const rejectedMovies = [];

/*
  3) Funktion, um Filme im Slider anzuzeigen.
     - Keine Filme = Kurzer Hinweistext
     - Andernfalls Karten generieren
*/
function renderMovies() {
  const movieSlider = document.getElementById("movie-slider");
  movieSlider.innerHTML = ""; // Alte Karten entfernen

  if (movies.length === 0) {
    movieSlider.innerHTML = "<p>Keine Filme gefunden. Bitte Filter anpassen.</p>";
    return;
  }

  // Wir gehen alle Filme durch und erstellen pro Film eine Karte
  // Der letzte Film im Array soll oben liegen (höchste z-index)
  movies.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    // Höherer zIndex für spätere Filme (damit sie oben liegen)
    movieCard.style.zIndex = index + 1;

    // Karte befüllen mit Bild, Titel, Kategorie, Länge
    movieCard.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>Kategorie: ${movie.category}</p>
      <p>Länge: ${movie.length} Minuten</p>
    `;

    movieSlider.appendChild(movieCard);
  });
}

/*
  4) Funktion, um einen Film zu akzeptieren (Match) oder abzulehnen (Pass).
     - Wir nehmen immer den "obersten" Film, also das letzte Element im Array.
*/
function handleDecision(isAccepted) {
  // Prüfen, ob es überhaupt noch Filme gibt
  if (movies.length === 0) {
    alert("Keine Filme mehr übrig!");
    return;
  }

  // Letzter Film im Array ist der "oben" liegende Film
  const topMovie = movies[movies.length - 1];

  // Im DOM: letztes Kindelement im movie-slider-Container
  const movieSlider = document.getElementById("movie-slider");
  const topCard = movieSlider.lastElementChild;

  // Je nach Entscheidung pushen wir den Film in accepted oder rejected
  if (isAccepted) {
    acceptedMovies.push(topMovie);
    topCard.style.transform = "translateX(200%) rotate(30deg)";
  } else {
    rejectedMovies.push(topMovie);
    topCard.style.transform = "translateX(-200%) rotate(-30deg)";
  }

  // Karte ausblenden
  topCard.style.opacity = "0";

  // Nach 300ms (Ende der Transition) entfernen wir die Karte aus dem DOM
  setTimeout(() => {
    topCard.remove();
  }, 300);

  // Auch aus unserem movies-Array entfernen
  movies.pop();

  // Nur zu Testzwecken: Logs
  console.log("Akzeptiert:", acceptedMovies);
  console.log("Abgelehnt:", rejectedMovies);
}

/*
  5) Filterfunktion, die basierend auf Kategorie/Länge 
     ein gefiltertes Array zurückgibt.
*/
function filterMovies(category, lengthCategory) {
  // Hier ist momentan eine lokale Filterung.
  // In einem echten Projekt würdest du stattdessen
  // eine Anfrage an den Server schicken.
  let filtered = [...allMovies];

  if (category) {
    filtered = filtered.filter(movie => movie.category === category);
  }

  if (lengthCategory) {
    if (lengthCategory === "short") {
      filtered = filtered.filter(movie => movie.length <= 120);
    } else if (lengthCategory === "medium") {
      filtered = filtered.filter(movie => movie.length > 120 && movie.length <= 150);
    } else if (lengthCategory === "long") {
      filtered = filtered.filter(movie => movie.length > 150);
    }
  }

  return filtered;
}

/*
  6) Event-Listener für das Filter-Formular
     - Erst nach Klick auf "Filtern" laden wir die passenden Filme.
     - Dann rendern wir sie im Slider.
*/
document.getElementById("filter-form").addEventListener("submit", event => {
  event.preventDefault();

  // Ausgewählte Filter holen
  const categorySelect = document.getElementById("category-select");
  const lengthSelect = document.getElementById("length-select");

  const selectedCategory = categorySelect.value; // z.B. "Action" oder ""
  const selectedLength = lengthSelect.value;     // z.B. "short" oder ""

  // Filter anwenden (oder in einem echten Projekt: fetch mit Parametern)
  movies = filterMovies(selectedCategory, selectedLength);

  // Bei neuem Filter die Arrays für akzeptierte und abgelehnte ggf. zurücksetzen
  acceptedMovies.length = 0;
  rejectedMovies.length = 0;

  // Jetzt erst Filme anzeigen
  renderMovies();
});

/*
  7) Buttons (Match und Pass) verküpfen
*/
document.getElementById("reject-button").addEventListener("click", () => handleDecision(false));
document.getElementById("accept-button").addEventListener("click", () => handleDecision(true));

/*
  8) Kein initiales Rendern! 
     Wir lassen movies bewusst leer, damit erst nach "Filtern" 
     wirklich Filme angezeigt werden. So sieht der Nutzer 
     anfangs keinen Film, bis ein Filter gesetzt wurde.
*/
movies = []; // leer zum Start
// renderMovies();  <-- entfällt
