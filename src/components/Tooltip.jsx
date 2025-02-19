import React from 'react';
import CloseIcon from '../assets/icons/close.svg';

const Tooltip = ({ course, onClose }) => {
  return (
    <div className="tooltip">
      <div className="triangle"></div>
      <div className="tooltip-message">
        <div>
          <span className="teacher">Prof : {course.prof}</span>
          <br />
          <span className="hours">
            {course.debut}-{course.fin}
          </span>
        </div>
        <button className="close-button" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default Tooltip;