import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import { fetchMoviesBySearch } from '../api';
import logo from '../images/logonavbar.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const searchButtonRef = useRef(null);
  const searchWrapperRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/search-results?query=${searchQuery}`);
      setMenuOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const fetchSearchResults = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await fetchMoviesBySearch(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        fetchSearchResults(searchQuery);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target)
      ) {
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActiveLink = (path) => location.pathname === path;

  return (
    <nav className="bg-black text-white py-4 px-6 relative">
      <div className="flex items-center justify-between">
        <Link to="/">
          <img src={logo} alt="TelaViva Logo" className="px-6 h-10 w-auto" />
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <ul className="flex space-x-4 items-center">
            
            {['/now-playing-movies', '/popular-movies', '/top-rated-movies', '/upcoming-movies', '/watched-movies', '/to-watch-movies', '/genres'].map((path) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`text-[#bd0003] hover:text-gray-300 ${isActiveLink(path) ? 'border-2 border-[#bd0003] text-white' : ''} px-2 py-1 rounded-full`}
                  onClick={() => setMenuOpen(false)}
                >
                  {path === '/now-playing-movies' ? 'Em Cartaz' :
                   path === '/popular-movies' ? 'Populares' :
                   path === '/top-rated-movies' ? 'Alta Avaliação' :
                   path === '/upcoming-movies' ? 'Em Breve' :
                   path === '/watched-movies' ? 'Assistidos' :
                   path === '/to-watch-movies' ? 'Ver Depois' : 'Gêneros'}
                </Link>
              </li>
            ))}
            <div className="relative" ref={searchWrapperRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                ref={searchInputRef}
                className="w-48 px-4 py-2 rounded-full bg-neutral-800 text-white placeholder -white focus:outline-none focus:ring-2 focus:ring-[#bd0003]"
                placeholder="Pesquisar"
              />
              <button
                onClick={handleSearchSubmit}
                className="absolute right-2 top-2 text-[#bd0003]"
                ref={searchButtonRef}
              >
                <FaSearch size={20} />
              </button>
            </div>
          </ul>
        </div>

        <button
          onClick={toggleMenu}
          className="text-white focus:outline-none md:hidden"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <div
        className={`fixed inset-0 bg-black bg-opacity-90 transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50 md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleMenu} className="text-white">
            <FaTimes size={24} />
          </button>
        </div>
        <div className="flex flex-col items-start space-y-6 px-6 pt-4">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              ref={searchInputRef}
              className="w-full px-4 py-2 rounded-full bg-neutral-800 text-white placeholder-white focus:outline-none"
              placeholder="Pesquisar"
            />
            <button
              onClick={handleSearchSubmit}
              className="absolute right-4 top-3 text-[#bd0003]"
            >
              <FaSearch size={20} />
            </button>
          </div>
          <ul className="flex flex-col space-y-4">
            {['/now-playing-movies', '/popular-movies', '/top-rated-movies', '/upcoming-movies', '/watched-movies', '/to-watch-movies', '/genres'].map((path) => (
              <li key={path}>
                <Link
                  to={path}
                  className="text-[#bd0003] hover:text-gray-300"
                  onClick={() => setMenuOpen(false)}
                >
                  {path === '/now-playing-movies' ? 'Em Cartaz' :
                   path === '/popular-movies' ? 'Populares' :
                   path === '/top-rated-movies' ? 'Alta Avaliação' :
                   path === '/upcoming-movies' ? 'Em Breve' :
                   path === '/watched-movies' ? 'Assistidos' :
                   path === '/to-watch-movies' ? 'Ver Depois' : 'Gêneros'}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;