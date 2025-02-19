import React, { useState, useEffect } from 'react';
import fetchAndParseSchedule from './logic/scrapper';
import LoadingSpinner from './components/LoadingSpinner';
import Timetable from './components/Timetable';
import Navbar from './components/Navbar';
import './styles.css';

const App = () => {
  const [days] = useState(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']);
  const [hours] = useState(['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']);
  const [courses, setCourses] = useState({
    Lundi: [],
    Mardi: [],
    Mercredi: [],
    Jeudi: [],
    Vendredi: []
  });
  const [studentName, setStudentName] = useState(''); // État pour le nom de l'étudiant
  const [dateInput, setDateInput] = useState(new Date().toISOString().slice(0, 10)); // État pour la date
  const [coursesCount, setCoursesCount] = useState(0); // Nombre de cours chargés
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // État pour le mode mobile
  const [loading, setLoading] = useState(true); // État pour le chargement
  const [isDarkMode, setIsDarkMode] = useState(false); // État pour le mode sombre
  const [view, setView] = useState('weekly'); // État pour la vue (daily/weekly)

  // Gestion du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Charger l'emploi du temps lorsque studentName ou dateInput change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const schedule = await fetchAndParseSchedule(studentName, dateInput);
      if (schedule) {
        setCourses(schedule.reduce((acc, entry) => {
          acc[entry.day] = entry.courses;
          return acc;
        }, {}));
        setCoursesCount(schedule.reduce((acc, entry) => acc + entry.courses.length, 0));
      }
      setLoading(false);
    };

    if (studentName) { // Ne charger que si studentName est défini
      fetchData();
    }
  }, [studentName, dateInput]); // Déclencher lorsque studentName ou dateInput change

  // Fonction pour changer la date
  const changeDate = (days) => {
    const current = new Date(dateInput);
    current.setDate(current.getDate() + days);
    setDateInput(current.toISOString().slice(0, 10));
  };

  // Fonction pour rafraîchir l'emploi du temps
  const handleRefresh = () => {
    setStudentName(studentName); // Force le rechargement des données
  };

  // Fonction pour basculer entre le mode clair et sombre
  const handleToggleDarkMode = (darkMode) => {
    setIsDarkMode(darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
  };

  // Fonction pour changer la vue (daily/weekly)
  const handleViewChange = (newView) => {
    setView(newView);
  };

  // Fonction pour mettre à jour le nom de l'étudiant
  const handleStudentNameChange = (name) => {
    setStudentName(name);
  };

  return (
    <div id="app" className={isDarkMode ? 'dark-mode' : ''}>
      <Navbar
        studentName={studentName}
        dateInput={dateInput}
        onDateChange={setDateInput}
        onRefresh={handleRefresh}
        onToggleDarkMode={handleToggleDarkMode}
        onViewChange={handleViewChange}
        onStudentNameChange={handleStudentNameChange}
      />
      {loading ? (
        <LoadingSpinner />
      ) : coursesCount > 0 ? (
        <Timetable days={days} hours={hours} courses={courses} isMobile={isMobile} view={view} onViewChange={handleViewChange} />
      ) : (
        <div className="empty-week">Pas de cours cette semaine 🏖️</div>
      )}
    </div>
  );
};

export default App;