import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/login', { username, password });
      localStorage.setItem('token', response.data.token);  // Speichern des Tokens
      navigate('/select-movies');  // Weiterleitung zur Filmauswahl
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
};
export default LoginPage;

// Beispiel: Login.js

// 1) Elements abrufen
const loginPage = document.getElementById('login-page');
const registerPage = document.getElementById('register-page');
const movieSelectionPage = document.getElementById('movie-selection-page');

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const loginError = document.getElementById('login-error');

// Register-Elements
const goToRegisterLink = document.getElementById('go-to-register');
const backToLoginButton = document.getElementById('back-to-login');
const registerUsernameInput = document.getElementById('register-username');
const registerEmailInput = document.getElementById('register-email');
const registerPasswordInput = document.getElementById('register-password');
const registerButton = document.getElementById('register-button');
const registerError = document.getElementById('register-error');
const registerSuccess = document.getElementById('register-success');

// 2) Utility-Funktion zum Umschalten der Seiten
function showPage(pageId) {
  // Alle Seiten verstecken
  document.querySelectorAll('.page').forEach((page) => {
    page.classList.add('hidden');
  });

  // Gewünschte Seite einblenden
  const pageToShow = document.getElementById(pageId);
  if (pageToShow) {
    pageToShow.classList.remove('hidden');
  }
}

// 3) Login-Funktion
async function handleLogin() {
  loginError.textContent = ''; // ggf. Fehlermeldung zurücksetzen
  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    // Beispiel: POST /login
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Login fehlgeschlagen');
    }

    const data = await response.json();
    // Beispiel: Token in localStorage speichern
    localStorage.setItem('token', data.token);

    // Weiterleitung zur Filmauswahl (Beispiel)
    showPage('movie-selection-page');
  } catch (error) {
    loginError.textContent = 'Login fehlgeschlagen. Bitte überprüfe deine Daten.';
  }
}

// 4) Registrieren-Funktion
async function handleRegister() {
  registerError.textContent = '';
  registerSuccess.textContent = '';

  const username = registerUsernameInput.value;
  const email = registerEmailInput.value;
  const password = registerPasswordInput.value;

  try {
    // POST /register
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    if (!response.ok) {
      throw new Error('Server-Antwort fehlerhaft');
    }

    const data = await response.json();

    if (data.success) {
      // Erfolgreich registriert
      registerSuccess.textContent = 'Registrierung erfolgreich! Du kannst dich jetzt einloggen.';
      // Optional: Automatisch zum Login wechseln
      setTimeout(() => {
        showPage('login-page');
      }, 2000);
    } else {
      // Falls das Backend success=false sendet
      registerError.textContent = data.message || 'Registrierung fehlgeschlagen.';
    }
  } catch (error) {
    registerError.textContent = 'Fehler bei der Registrierung. Bitte versuch es später erneut.';
  }
}

// 5) Event Listener
loginButton.addEventListener('click', handleLogin);

// Link "Jetzt registrieren" → zeigt Register-Seite
goToRegisterLink.addEventListener('click', (e) => {
  e.preventDefault();
  showPage('register-page');
});

// Button "Zum Login" → zeigt Login-Seite
backToLoginButton.addEventListener('click', () => {
  showPage('login-page');
});

// Klick auf "Registrieren"
registerButton.addEventListener('click', handleRegister);

// 6) Standardmäßig Login-Seite zeigen (optional)
showPage('login-page');
