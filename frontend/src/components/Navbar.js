import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [click, setClick] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuth') === 'true';
    setIsAuthenticated(isAuth);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuth');
    setIsAuthenticated(false);
    navigate('/auth/login');
  };

  const handleNLP = async (text) => {
    try {
      const response = await fetch('http://localhost:3000/api/nlp/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
  
      if (!response.ok) {
        throw new Error('Erreur pendant le processus NLP');
      }
  
      const result = await response.json();
      console.log('Résultat du NLP : ', result);
  
      // Navigation en fonction de l'intention détectée
      switch (result.intent) {
        case 'facture':
          navigate('/facturation');
          break;
        case 'client':
          navigate('/client');
          break;
        case 'home':
          navigate('/');
          break;
          
      default:
        alert('Commande non reconnue.');
    }
       
    } catch (error) {
      console.error('Erreur : ', error.message);
      alert('Erreur pendant le processus NLP.');
    }
  };
  
  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'fr-FR'; // Définir la langue (français)
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript; // Texte capté par le micro
      setVoiceText(transcript); // Sauvegarder le texte dans l'état
      handleNLP(transcript); // Envoyer le texte à la fonction NLP
    };
    

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceText(transcript);
      handleNLP(transcript); // Envoyer le texte extrait au processus NLP
    };

    recognition.onerror = (event) => {
      console.error('Erreur de reconnaissance vocale : ', event.error);
      alert('Erreur de reconnaissance vocale.');
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <>
    
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            LIMIMA
            <img src="/images/logo black white circle.png" alt="Logo" style={{ width: '50px', marginLeft: '10px' }} />
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/auth/login" className="nav-links" onClick={closeMobileMenu}>
                    Log In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/auth/register" className="nav-links" onClick={closeMobileMenu}>
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/client" className="nav-links" onClick={closeMobileMenu}>
                    Client
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/facturation" className="nav-links" onClick={closeMobileMenu}>
                    Facture
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="bg-red-500 font-bold py-2 px-8 rounded shadow border-2 border-red-500 hover:bg-transparent hover:text-black-500 transition-all duration-300"
                  >
                    Log Out
                  </button>
                </li>
              </>
            )}
            <li className="nav-item">
              <button
                className={`voice-button ${isListening ? 'listening' : ''}`}
                onClick={startListening}
                title="Cliquez pour parler"
              >
                🎤
              </button>
            </li>
          </ul>
        </div>
        <div style={{ marginTop: '10px', color: 'gray', fontSize: '14px' }}>
  <strong>Texte capté : </strong> {voiceText}
</div>

      </nav>
    </>
  );
}

export default Navbar;
