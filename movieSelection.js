// Dummy-Daten für Filme (Testdaten)
const movies = [
    { id: 1, title: "Inception", image: "https://via.placeholder.com/300x400?text=Inception" },
    { id: 2, title: "The Dark Knight", image: "https://via.placeholder.com/300x400?text=Dark+Knight" },
    { id: 3, title: "Interstellar", image: "https://via.placeholder.com/300x400?text=Interstellar" },
    { id: 4, title: "The Matrix", image: "https://via.placeholder.com/300x400?text=Matrix" },
    { id: 5, title: "Forrest Gump", image: "https://via.placeholder.com/300x400?text=Forrest+Gump" },
    { id: 6, title: "Titanic", image: "https://via.placeholder.com/300x400?text=Titanic" },
    { id: 7, title: "Avatar", image: "https://via.placeholder.com/300x400?text=Avatar" },
    { id: 8, title: "Joker", image: "https://via.placeholder.com/300x400?text=Joker" },
    { id: 9, title: "Parasite", image: "https://via.placeholder.com/300x400?text=Parasite" },
    { id: 10, title: "Wolf of Wallstreet", image: "https://m.media-amazon.com/images/I/7186p2oTAcL.jpg" },
  ];
  
  let currentIndex = movies.length - 1; // Start mit der letzten Karte
  const acceptedMovies = [];
  const rejectedMovies = [];
  
  // Funktion: Rendern der Filme
  function renderMovies() {
    const movieSlider = document.getElementById("movie-slider");
  
    movies.forEach((movie, index) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      movieCard.style.zIndex = index;
  
      movieCard.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}">
        <h3>${movie.title}</h3>
      `;
  
      movieSlider.appendChild(movieCard);
    });
  }
  
  // Funktion: Verarbeitung der Entscheidung
  function handleDecision(isAccepted) {
    if (currentIndex < 0) {
      alert("Keine Filme mehr übrig!");
      return;
    }
  
    const movie = movies[currentIndex];
    const movieCard = document.querySelectorAll(".movie-card")[currentIndex];
  
    if (isAccepted) {
      acceptedMovies.push(movie);
      movieCard.style.transform = "translateX(200%) rotate(30deg)";
    } else {
      rejectedMovies.push(movie);
      movieCard.style.transform = "translateX(-200%) rotate(-30deg)";
    }
  
    movieCard.style.opacity = "0"; // Karte verschwindet
    currentIndex--;
  
    console.log("Akzeptiert:", acceptedMovies);
    console.log("Abgelehnt:", rejectedMovies);
  }
  
  // Event-Listener für Buttons
  document.getElementById("reject-button").addEventListener("click", () => handleDecision(false));
  document.getElementById("accept-button").addEventListener("click", () => handleDecision(true));
  
  // Initialisierung der Anwendung
  renderMovies();
  