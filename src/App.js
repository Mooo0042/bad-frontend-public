import React, { useState, useEffect, useCallback } from 'react';

// Internationalization
const translations = {
  de: {
    // Login page
    loginTitle: 'Musik Einreichen',
    loginSubtitle: 'Passwort eingeben zum Fortfahren',
    passwordPlaceholder: 'Passwort eingeben',
    loginButton: 'Anmelden',
    wrongPassword: '❌ Falsches Passwort',

    // Main form
    mainTitle: 'Musik Einreichen',
    yourName: 'Dein Name',
    namePlaceholder: 'Wie heißt du?',
    saveButton: 'Speichern',
    nameSaved: '✅ Name gespeichert',
    searchSong: 'Song suchen',
    searchPlaceholder: 'Song-Name, Künstler oder Album eingeben...',
    searching: '🔍 Suche nach Songs...',
    songsFound: '🎵 {count} Songs gefunden',
    noSongsFound: '❌ Keine Songs gefunden',
    searchResults: 'Suchergebnisse ({count})',
    songSelected: '✅ Song ausgewählt: {name} - {artist}',

    // Confirmation
    confirmTitle: 'Ist das der richtige Song?',
    by: 'von',
    album: 'Album',
    explicit: 'Explicit',
    yesButton: '✅ Ja, das ist es!',
    noButton: '❌ Nein, nächster Song',

    // Fallback
    orDirectLink: 'Oder Spotify Link direkt eingeben',
    linkPlaceholder: 'https://open.spotify.com/track/...',
    submitButton: 'Song einreichen',
    submitting: 'Wird eingereicht...',

    // Messages
    enterName: '❌ Bitte gib deinen Namen ein',
    selectSong: '❌ Bitte wähle einen Song aus oder gib einen Link ein',
    validSpotifyLink: '❌ Bitte gib einen gültigen Spotify-Link ein',
    submissionSuccess: '🎉 Erfolgreich eingereicht! Warten auf Freigabe...',
    networkError: '❌ Netzwerkfehler: {error}',
    error: '❌ Fehler: {error}',

    // Instructions
    step1: 'Gib deinen Namen ein und speichere ihn',
    step2: 'Suche nach deinem Song oder gib den Spotify-Link ein',
    step3: 'Reiche den Song ein und warte auf die Freigabe!',
    footer: '🎵 Deine Musik wird geprüft und zur Playlist hinzugefügt',

    // Language
    language: 'Sprache'
  },
  en: {
    // Login page
    loginTitle: 'Submit Music',
    loginSubtitle: 'Enter password to continue',
    passwordPlaceholder: 'Enter password',
    loginButton: 'Login',
    wrongPassword: '❌ Wrong password',

    // Main form
    mainTitle: 'Submit Music',
    yourName: 'Your Name',
    namePlaceholder: 'What\'s your name?',
    saveButton: 'Save',
    nameSaved: '✅ Name saved',
    searchSong: 'Search Song',
    searchPlaceholder: 'Enter song name, artist or album...',
    searching: '🔍 Searching for songs...',
    songsFound: '🎵 {count} songs found',
    noSongsFound: '❌ No songs found',
    searchResults: 'Search Results ({count})',
    songSelected: '✅ Song selected: {name} - {artist}',

    // Confirmation
    confirmTitle: 'Is this the right song?',
    by: 'by',
    album: 'Album',
    explicit: 'Explicit',
    yesButton: '✅ Yes, that\'s it!',
    noButton: '❌ No, next song',

    // Fallback
    orDirectLink: 'Or enter Spotify link directly',
    linkPlaceholder: 'https://open.spotify.com/track/...',
    submitButton: 'Submit Song',
    submitting: 'Submitting...',

    // Messages
    enterName: '❌ Please enter your name',
    selectSong: '❌ Please select a song or enter a link',
    validSpotifyLink: '❌ Please enter a valid Spotify link',
    submissionSuccess: '🎉 Successfully submitted! Waiting for approval...',
    networkError: '❌ Network error: {error}',
    error: '❌ Error: {error}',

    // Instructions
    step1: 'Enter your name and save it',
    step2: 'Search for your song or enter the Spotify link',
    step3: 'Submit the song and wait for approval!',
    footer: '🎵 Your music will be reviewed and added to the playlist',

    // Language
    language: 'Language'
  }
};

// Helper function to get translated text
const t = (key, lang, replacements = {}) => {
  let text = translations[lang]?.[key] || translations['en'][key] || key;

  // Replace placeholders like {count}, {name}, etc.
  Object.keys(replacements).forEach(placeholder => {
    text = text.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
  });

  return text;
};

// Custom SVG Icons
const LockIcon = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '2.5rem', height: '2.5rem'}}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <circle cx="12" cy="16" r="1"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const MusicIcon = ({ size = "large" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    style={{
      width: size === "large" ? '3rem' : '1.25rem', 
      height: size === "large" ? '3rem' : '1.25rem'
    }}
  >
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="16" r="3"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '1.25rem', height: '1.25rem'}}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '1.25rem', height: '1.25rem'}}>
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22,2 15,22 11,13 2,9 22,2"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '1.25rem', height: '1.25rem'}}>
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '1.25rem', height: '1.25rem'}}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '1.25rem', height: '1.25rem'}}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '1.25rem', height: '1.25rem'}}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New search-related state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);

  // Language state
  const [language, setLanguage] = useState('de');
  
  const REQUIRED_PASSWORD = process.env.REACT_APP_LOGIN_PASSWORD || 'musik2025';

  useEffect(() => {
    // Language detection and persistence
    const savedLanguage = localStorage.getItem('musicAppLanguage');
    if (savedLanguage && (savedLanguage === 'de' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language || navigator.languages[0];
      const detectedLang = browserLang.startsWith('de') ? 'de' : 'en';
      setLanguage(detectedLang);
      localStorage.setItem('musicAppLanguage', detectedLang);
    }

    // Check URL for password parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlPassword = urlParams.get('password') || urlParams.get('p');

    if (urlPassword === REQUIRED_PASSWORD) {
      setIsAuthenticated(true);
      setPassword(urlPassword);
    }

    // In a real app, you would use localStorage here
    // For demo purposes, we'll use component state
    // const savedAuth = localStorage.getItem('musicAuth');
    // const savedName = localStorage.getItem('musicName');
    // if (savedAuth === REQUIRED_PASSWORD) {
    //   setIsAuthenticated(true);
    //   setPassword(savedAuth);
    // }
    // if (savedName) {
    //   setName(savedName);
    // }
  }, [REQUIRED_PASSWORD]);

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('musicAppLanguage', newLang);
  };

  // Language Selector Component
  const LanguageSelector = () => (
    <div style={{
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '0.5rem',
      padding: '0.5rem',
      backdropFilter: 'blur(10px)'
    }}>
      <GlobeIcon />
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '0.875rem',
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        <option value="de" style={{background: '#1f2937', color: 'white'}}>Deutsch</option>
        <option value="en" style={{background: '#1f2937', color: 'white'}}>English</option>
      </select>
    </div>
  );

  const handleLogin = () => {
    if (password === REQUIRED_PASSWORD) {
      setIsAuthenticated(true);
      // localStorage.setItem('musicAuth', password);
      setStatus('');
    } else {
      setStatus(t('wrongPassword', language));
    }
  };

  const handleNameSave = () => {
    if (name.trim()) {
      // localStorage.setItem('musicName', name.trim());
      setStatus(t('nameSaved', language));
    }
  };

  const searchTracks = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setStatus(t('searching', language));

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://tropical-alvera-msorg-b735c0d5.koyeb.app';
      const res = await fetch(`${apiUrl}/search-tracks?q=${encodeURIComponent(query)}&limit=10`);
      const data = await res.json();

      if (res.ok) {
        setSearchResults(data);
        setCurrentResultIndex(0);
        if (data.length > 0) {
          setStatus(t('songsFound', language, { count: data.length }));
        } else {
          setStatus(t('noSongsFound', language));
        }
      } else {
        setStatus(t('error', language, { error: data.error || 'Unknown error' }));
        setSearchResults([]);
      }
    } catch (e) {
      setStatus(t('networkError', language, { error: e.message }));
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectTrack = (track) => {
    setSelectedTrack(track);
    setStatus(t('songSelected', language, { name: track.name, artist: track.artist }));
  };

  const confirmTrack = () => {
    if (selectedTrack) {
      submit(selectedTrack);
    }
  };

  const showNextResult = () => {
    if (searchResults.length > 0) {
      const nextIndex = (currentResultIndex + 1) % searchResults.length;
      setCurrentResultIndex(nextIndex);
      selectTrack(searchResults[nextIndex]);
    }
  };

  const submit = useCallback(async (track = null, forceLink = null) => {
    if (!name.trim()) {
      setStatus(t('enterName', language));
      return;
    }

    // Use selected track or fall back to link input for backwards compatibility
    const trackToSubmit = track || selectedTrack;
    const linkToUse = forceLink || link;

    if (!trackToSubmit && !linkToUse.trim()) {
      setStatus(t('selectSong', language));
      return;
    }

    let submitData = { user: name.trim() };

    if (trackToSubmit) {
      // Submit using track ID
      submitData.trackId = trackToSubmit.id;
      submitData.link = trackToSubmit.spotify_url;
    } else {
      // Fallback to link submission for backwards compatibility
      const isSpotify = linkToUse.includes('open.spotify.com');
      if (!isSpotify) {
        setStatus(t('validSpotifyLink', language));
        return;
      }
      const cleanLink = linkToUse.trim().split('?')[0];
      submitData.link = cleanLink;
    }

    setIsLoading(true);
    setStatus(t('submitting', language));

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://tropical-alvera-msorg-b735c0d5.koyeb.app';
      const res = await fetch(`${apiUrl}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(t('submissionSuccess', language));
        // Reset form
        setLink('');
        setSearchQuery('');
        setSearchResults([]);
        setSelectedTrack(null);
        setCurrentResultIndex(0);
      } else {
        setStatus(t('error', language, { error: data.error || 'Unknown error' }));
      }
    } catch (e) {
      setStatus(t('networkError', language, { error: e.message }));
    } finally {
      setIsLoading(false);
    }
  }, [name, selectedTrack, link, language]);

  const logout = () => {
    setIsAuthenticated(false);
    setPassword('');
    // localStorage.removeItem('musicAuth');
    setStatus('');
  };

  // Inline Styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #581c87 0%, #1e3a8a 50%, #312e81 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(16px)',
    borderRadius: '1.5rem',
    padding: '2rem',
    width: '100%',
    maxWidth: '28rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  };

  const mainCardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(16px)',
    borderRadius: '1.5rem',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    marginBottom: '1.5rem'
  };

  const iconContainerStyle = {
    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    width: '5rem',
    height: '5rem',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem auto',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    color: 'white',
    transform: 'rotate(3deg)',
    transition: 'transform 0.3s ease'
  };

  const musicIconContainerStyle = {
    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    width: '6rem',
    height: '6rem',
    borderRadius: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem auto',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
    color: 'white',
    transform: 'rotate(3deg)',
    transition: 'transform 0.3s ease',
    cursor: 'pointer'
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.75rem',
    padding: '0.75rem 1rem',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    minWidth: '0'
  };
  
  const buttonStyle = {
    width: '100%',
    background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
    color: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxSizing: 'border-box'
  };

  const submitButtonStyle = {
    ...buttonStyle,
    padding: '1rem 1.5rem',
    transform: 'scale(1)',
    transition: 'all 0.2s ease'
  };

  if (!isAuthenticated) {
    return (
      <div style={containerStyle}>
        <LanguageSelector />
        <div style={cardStyle}>
          <div style={{textAlign: 'center', marginBottom: '2rem'}}>
            <div
              style={iconContainerStyle}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(6deg)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(3deg)'}
            >
              <LockIcon />
            </div>
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '0.5rem',
              margin: '0'
            }}>
              {t('loginTitle', language)}
            </h1>
            <p style={{color: '#d1d5db', margin: '0.5rem 0 0 0'}}>
              {t('loginSubtitle', language)}
            </p>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div style={{position: 'relative', width: '100%', minWidth: '0'}}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder={t('passwordPlaceholder', language)}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                style={{...inputStyle, paddingRight: '3rem'}}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '0.75rem',
                  color: '#9ca3af',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <button
              type="button"
              onClick={handleLogin}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #7c3aed, #db2777)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #8b5cf6, #ec4899)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {t('loginButton', language)}
            </button>
            {status && (
              <div style={{
                textAlign: 'center',
                padding: '0.75rem',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '0.75rem',
                color: '#fca5a5'
              }}>
                {status}
              </div>
            )}
            <div style={{textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af'}}>
              <p style={{margin: '0 0 0.25rem 0'}}>💡 Tipp: Du kannst das Passwort auch im Link übergeben:</p>
              <p style={{color: '#6b7280', fontSize: '0.75rem', margin: '0'}}>?password=deinpasswort</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #581c87 0%, #1e3a8a 50%, #312e81 100%)',
      padding: '1rem',
      position: 'relative'
    }}>
      <LanguageSelector />
      <div style={{maxWidth: '42rem', margin: '0 auto', paddingTop: '2rem'}}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <div
            style={musicIconContainerStyle}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(6deg)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(3deg)'}
          >
            <MusicIcon size="large" />
          </div>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '0.5rem',
            background: 'linear-gradient(90deg, #f472b6, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0'
          }}>
            {t('mainTitle', language)}
          </h1>
          <p style={{color: '#d1d5db', fontSize: '1.125rem', margin: '0.5rem 0 1rem 0'}}>
            {language === 'de' ? 'Teile deine Lieblingssongs mit uns!' : 'Share your favorite songs with us!'}
          </p>
          
          <button
            type="button"
            onClick={logout}
            style={{
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: '#9ca3af',
              background: 'none',
              border: 'none',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: '0'
            }}
          >
            Abmelden
          </button>
        </div>

        {/* Main Form */}
        <div style={mainCardStyle}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {/* Name Input */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <label style={{
                color: 'white',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <UserIcon />
                {t('yourName', language)}
              </label>
              <div style={{display: 'flex', gap: '0.75rem', width: '100%', minWidth: '0'}}>
                <input
                  type="text"
                  value={name}
                  placeholder={t('namePlaceholder', language)}
                  onChange={(e) => setName(e.target.value)}
                  style={{...inputStyle, flex: '1', minWidth: '0'}}
                />
                <button
                  type="button"
                  onClick={handleNameSave}
                  style={{
                    background: '#16a34a',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.75rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    boxSizing: 'border-box',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                >
                  {t('saveButton', language)}
                </button>
              </div>
            </div>

            {/* Song Search */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <label style={{
                color: 'white',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <SearchIcon />
                {t('searchSong', language)}
              </label>
              <div style={{position: 'relative', width: '100%', minWidth: '0'}}>
                <input
                  type="text"
                  value={searchQuery}
                  placeholder={t('searchPlaceholder', language)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim()) {
                      searchTracks(e.target.value);
                    } else {
                      setSearchResults([]);
                      setSelectedTrack(null);
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      searchTracks(searchQuery);
                    }
                  }}
                  style={inputStyle}
                />
                {isSearching && (
                  <div style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1.25rem',
                    height: '1.25rem',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                )}
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && !selectedTrack && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem',
                padding: '1rem',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                <h3 style={{color: 'white', margin: '0 0 1rem 0', fontSize: '1rem'}}>
                  {t('searchResults', language, { count: searchResults.length })}
                </h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                  {searchResults.map((track, index) => (
                    <div
                      key={track.id}
                      onClick={() => selectTrack(track)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {track.image ? (
                        <img
                          src={track.image}
                          alt={`${track.name} cover`}
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '0.25rem',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '50px',
                          height: '50px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          🎵
                        </div>
                      )}
                      <div style={{flex: 1, minWidth: 0}}>
                        <div style={{
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {track.name}
                        </div>
                        <div style={{
                          color: '#d1d5db',
                          fontSize: '0.8rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {track.artist} • {track.album}
                        </div>
                        {track.explicit && (
                          <span style={{
                            background: '#ef4444',
                            color: 'white',
                            fontSize: '0.7rem',
                            padding: '0.125rem 0.25rem',
                            borderRadius: '0.25rem',
                            marginTop: '0.25rem',
                            display: 'inline-block'
                          }}>
                            Explicit
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Track Confirmation */}
            {selectedTrack && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '2px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '0.75rem',
                padding: '1.5rem'
              }}>
                <h3 style={{color: 'white', margin: '0 0 1rem 0', fontSize: '1.1rem'}}>
                  {t('confirmTitle', language)}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  {selectedTrack.image ? (
                    <img
                      src={selectedTrack.image}
                      alt={`${selectedTrack.name} cover`}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '0.5rem',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '2rem'
                    }}>
                      🎵
                    </div>
                  )}
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      marginBottom: '0.25rem'
                    }}>
                      {selectedTrack.name}
                    </div>
                    <div style={{
                      color: '#d1d5db',
                      fontSize: '0.9rem',
                      marginBottom: '0.25rem'
                    }}>
                      {t('by', language)} {selectedTrack.artist}
                    </div>
                    <div style={{
                      color: '#9ca3af',
                      fontSize: '0.8rem'
                    }}>
                      {t('album', language)}: {selectedTrack.album}
                    </div>
                    {selectedTrack.explicit && (
                      <span style={{
                        background: '#ef4444',
                        color: 'white',
                        fontSize: '0.7rem',
                        padding: '0.125rem 0.25rem',
                        borderRadius: '0.25rem',
                        marginTop: '0.5rem',
                        display: 'inline-block'
                      }}>
                        {t('explicit', language)}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
                  <button
                    type="button"
                    onClick={confirmTrack}
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      minWidth: '150px',
                      background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.75rem',
                      fontWeight: '600',
                      border: 'none',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.background = 'linear-gradient(90deg, #16a34a, #15803d)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    {t('yesButton', language)}
                  </button>
                  <button
                    type="button"
                    onClick={showNextResult}
                    disabled={searchResults.length <= 1}
                    style={{
                      flex: 1,
                      minWidth: '150px',
                      background: 'rgba(239, 68, 68, 0.8)',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.75rem',
                      fontWeight: '600',
                      border: 'none',
                      cursor: searchResults.length <= 1 ? 'not-allowed' : 'pointer',
                      opacity: searchResults.length <= 1 ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (searchResults.length > 1) {
                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.9)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (searchResults.length > 1) {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    {t('noButton', language)}
                  </button>
                </div>
              </div>
            )}

            {/* Fallback Link Input (for backwards compatibility) */}
            {!selectedTrack && searchResults.length === 0 && (
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <label style={{
                  color: 'white',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <MusicIcon size="small" />
                  {t('orDirectLink', language)}
                </label>
                <div style={{position: 'relative', width: '100%', minWidth: '0'}}>
                  <input
                    ref={(el) => window.linkInputRef = el}
                    type="text"
                    value={link}
                    placeholder={t('linkPlaceholder', language)}
                    onChange={(e) => setLink(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && submit()}
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* Submit Button (only show when no track selected) */}
            {!selectedTrack && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  // Get current input value directly from DOM to avoid React state timing issues
                  const currentLink = window.linkInputRef?.value || link;
                  // Pass the current link directly to submit function
                  submit(null, currentLink);
                }}
                disabled={isLoading}
                style={{
                  ...submitButtonStyle,
                  opacity: isLoading ? 0.5 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #7c3aed, #db2777)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #8b5cf6, #ec4899)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    {t('submitting', language)}
                  </>
                ) : (
                  <>
                    <SendIcon />
                    {t('submitButton', language)}
                  </>
                )}
              </button>
            )}

            {/* Status Message */}
            {status && (
              <div style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid',
                textAlign: 'center',
                fontWeight: '500',
                ...(status.includes('❌') || status.includes('Fehler') 
                  ? {
                      background: 'rgba(239, 68, 68, 0.2)',
                      borderColor: 'rgba(239, 68, 68, 0.3)',
                      color: '#fca5a5'
                    }
                  : status.includes('✅') || status.includes('🎉')
                  ? {
                      background: 'rgba(34, 197, 94, 0.2)',
                      borderColor: 'rgba(34, 197, 94, 0.3)',
                      color: '#86efac'
                    }
                  : {
                      background: 'rgba(59, 130, 246, 0.2)',
                      borderColor: 'rgba(59, 130, 246, 0.3)',
                      color: '#93c5fd'
                    })
              }}>
                {status}
              </div>
            )}

            {/* Info Box */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.75rem',
              padding: '1rem'
            }}>
              <h3 style={{
                color: 'white',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0 0 0.75rem 0'
              }}>
                <MusicIcon size="small" style={{color: '#c084fc'}} />
                {language === 'de' ? 'So funktioniert es:' : 'How it works:'}
              </h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#d1d5db', fontSize: '0.875rem'}}>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
                  <span style={{
                    background: '#8b5cf6',
                    color: 'white',
                    borderRadius: '50%',
                    width: '1.5rem',
                    height: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    marginTop: '0.125rem',
                    flexShrink: 0
                  }}>1</span>
                  <span>{t('step1', language)}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
                  <span style={{
                    background: '#8b5cf6',
                    color: 'white',
                    borderRadius: '50%',
                    width: '1.5rem',
                    height: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    marginTop: '0.125rem',
                    flexShrink: 0
                  }}>2</span>
                  <span>{t('step2', language)}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
                  <span style={{
                    background: '#8b5cf6',
                    color: 'white',
                    borderRadius: '50%',
                    width: '1.5rem',
                    height: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    marginTop: '0.125rem',
                    flexShrink: 0
                  }}>3</span>
                  <span>{t('step3', language)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{textAlign: 'center', marginTop: '2rem', color: '#9ca3af', fontSize: '0.875rem'}}>
          <p style={{margin: '0'}}>{t('footer', language)}</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
                              }
