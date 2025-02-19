import React, { useState } from 'react';
import Tooltip from './Tooltip';
import InfoIcon from '../assets/icons/info.svg';

const Course = ({ course, isMobile }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  const calculateCourseHeight = (course) => {
    const startDate = convertHourToNumber(course.debut);
    const endDate = convertHourToNumber(course.fin);
    const durationInHours = endDate - startDate;
    return durationInHours * 45;
  };

  const convertHourToNumber = (hourString) => {
    const [hours, minutes] = hourString.split(':').map(Number);
    return hours % 24 + minutes / 60;
  };

  const convertHourToText = (hourString) => {
    const [hours, minutes] = hourString.split(':');
    return `${hours}h${minutes}`;
  };

  const height = calculateCourseHeight(course);

  return (
    <div
      className="course"
      style={{
        height: `${height - 10}px`,
        backgroundColor: course.color.color,
        color: course.color.textColor,
      }}
    >
      <span className="class">{course.matiere}</span>
      <span className="room">Salle : {course.salle.startsWith('SALLE') ? 'DISTANCIEL' : course.salle}</span>
      {!isMobile && height > 45 && <span className="teacher">Prof : {course.prof}</span>}
      {height > 45 && (
        <span className="hours">
          {convertHourToText(course.debut)}-{convertHourToText(course.fin)}
        </span>
      )}
      <div className="info-button-container" onClick={toggleTooltip}>
        <button className="info-button">
          <InfoIcon />
        </button>
        {showTooltip && <Tooltip course={course} onClose={toggleTooltip} />}
      </div>
    </div>
  );
};

export default Course;