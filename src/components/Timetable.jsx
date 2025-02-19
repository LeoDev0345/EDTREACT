import React from 'react';
import Course from './Course';

const Timetable = ({ days, hours, courses, isMobile, view, onViewChange }) => {
  const renderDailyView = () => {
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
    const todayCourses = courses[today] || [];

    return (
      <div className="timetable-body">
        <div className="time-column">
          {hours.map((hour) => (
            <div key={hour} className="hour">
              {hour}
            </div>
          ))}
        </div>
        <div className="day-column">
          {todayCourses.map((course, index) => (
            <Course key={`${course.matiere}-${index}`} course={course} isMobile={isMobile} />
          ))}
        </div>
      </div>
    );
  };

  const renderWeeklyView = () => {
    return (
      <div className="timetable-body">
        <div className="time-column">
          {hours.map((hour) => (
            <div key={hour} className="hour">
              {hour}
            </div>
          ))}
        </div>
        {days.map((day) => (
          <div key={day} className="day-column">
            {courses[day] &&
              courses[day].map((course, index) => (
                <Course key={`${course.matiere}-${index}`} course={course} isMobile={isMobile} />
              ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="timetable">
      <div className="view-toggle">
        <button
          className={`view-button ${view === 'weekly' ? 'active' : ''}`}
          onClick={() => onViewChange('weekly')}
        >
          Weekly View
        </button>
        <button
          className={`view-button ${view === 'daily' ? 'active' : ''}`}
          onClick={() => onViewChange('daily')}
        >
          Daily View
        </button>
      </div>
      <div className="header">
        <div className="time-column"></div>
        {days.map((day) => (
          <div key={day} className="day">
            {isMobile ? '' : day}
            <span>{!isMobile && <br />}</span>
            {courses[day] && courses[day].date
              ? isMobile
                ? new Date(courses[day].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' })
                : new Date(courses[day].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
              : null}
          </div>
        ))}
      </div>
      {view === 'daily' ? renderDailyView() : renderWeeklyView()}
    </div>
  );
};

export default Timetable;

