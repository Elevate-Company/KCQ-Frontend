import React from 'react';
import '../../css/issueticket/issueticket.css';
import SelectTrip from './selectrip';

function IssueTicket() {
  const selectTripCount = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="issue-ticket-container mt-5">
      <div className="cards-row">
        <div className="card-select-issue select-card">
          <div className="card-select">
            Select Trip
          </div>
          {selectTripCount.map((_, index) => (
            <SelectTrip key={index} />
          ))}
          <div className="arrow-container">
            <button className="arrow" onClick={() => alert('Arrow button clicked!')}>
              &gt;
            </button>
          </div>
        </div>

        <div className="card-contact-issue contact-card">
          <div className="card-contact">
            <h3>Contact Info</h3>
            <form className="contact-form">
              <label>
                Passenger Name:
                <input type="text" placeholder="Name" />
              </label>
              <label>
                Phone Number:
                <input type="tel" placeholder="Contact number" />
              </label>
              <label>
                Passenger Email:
                <input type="email" placeholder="Email" />
              </label>
              <label>
                Number of Tickets:
                <input type="number" placeholder="Number" />
              </label>
              <hr />
              <p></p>
              <div className="total-section">
                <p>Total</p>
                <p>PHP 1,999</p>
              </div>
              <hr />
              <button type="button" className="generate-btn" onClick={() => alert('Ticket Generated!')}>
                Generate Ticket
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueTicket;
