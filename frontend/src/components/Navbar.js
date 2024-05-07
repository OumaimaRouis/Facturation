import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuth') === 'true';
    setIsAuthenticated(isAuth);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuth');
    setIsAuthenticated(false); // Mettre à jour l'état après la déconnexion
    navigate('/auth/login');
  };

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            LIMIMA
            <img src="/images/logo black white circle.png" alt="Logo" style={{ width: '50px', marginLeft: '10px' }} />
            <i className='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>

            {!isAuthenticated ? (
              <>
                <li className='nav-item'>
                  <Link to='/auth/login' className='nav-links' onClick={closeMobileMenu}>
                    Log In
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link to='/auth/register' className='nav-links' onClick={closeMobileMenu}>
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item'>
                  <Link to='/client' className='nav-links' onClick={closeMobileMenu}>
                    Client
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link to='/facturation' className='nav-links' onClick={closeMobileMenu}>
                    Facture
                  </Link>
                </li>
                <li className='nav-item'>
                  <button
                    type="button" onClick={handleLogout}
                    className="bg-red-500 font-bold py-2 px-8 rounded shadow border-2 border-red-500 
                    hover:bg-transparent hover:text-black-500 
                    transition-all duration-300"
                  >
                    Log Out
                  </button>
                </li>
              </>
            )}

          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
