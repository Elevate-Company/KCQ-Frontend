import React from 'react';
import '../../css/issueticket/selectrip.css';
import boatLogo from '../../assets/boatlogo.png';

function SelectTrip() {
  return (
    <div className="select-trip-container">
      <div className="card-select-empty">
        <input type="checkbox" className="round-checkbox" />
        <div className="card-content-selecttrip">
          <div className="boat-from-to-container">
            <img src={boatLogo} alt="Boat Logo" className="selectriplogo" />
            <div className="from-to-component">
              <div className="from-section">
                <p>From</p>
                <h4>Cebu</h4>
              </div>
              <div className="dashed-separator mt-4"></div>
              <div className="to-section">
                <p>To</p>
                <h4>Bantayan</h4>
              </div>
            </div>
          </div>
          <div className="additional-info mt-4">
            <div className="date-section">
              <h4>January 15, 2024</h4>
            </div>
            <p></p>
            <div className="boat-number-section">
              <h4>PBO-1234</h4>
            </div>
            <div className="boat-type-section">
              <h4>Pumboat Express</h4>
            </div>
            <div className="price-section">
              <h4 className="price">PHP 1,999</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectTrip;
