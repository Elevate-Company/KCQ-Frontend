import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../navbar/navbar'; // Import Navbar component

function Reports() {
  const [filter, setFilter] = useState('daily'); // State to manage the filter type

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    // You can add logic here to fetch or filter data based on the selected filter
  };

  return (
    <div>
      <Navbar /> {/* Display Navbar at the very top */}
      <div className="container my-4">
        <h1 className="text-center mb-4">Ferry Ticketing Management System Report</h1>

        {/* Filter Dropdown */}
        <div className="d-flex justify-content-end mb-4">
          <select className="form-select w-auto" value={filter} onChange={handleFilterChange}>
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Overview Section */}
        <div className="card mb-4">
          <div
            className="card-header text-white"
            style={{ backgroundColor: "#091057" }}
          >
            Overview
          </div>
          <div className="card-body">
            <p><strong>Total Tickets Sold:</strong> 5,456</p>
            <p><strong>Total Revenue:</strong> $27,280.00</p>
            <p><strong>Total Passengers:</strong> 7,320</p>
            <p><strong>Trips Completed:</strong> 480</p>
            <p><strong>Cancellation Rate:</strong> 4.8%</p>
          </div>
        </div>

        {/* Financial Summary Section */}
        <div className="card mb-4">
          <div className="card-header bg-success text-white">Financial Summary</div>
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount ($)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Revenue</td>
                  <td>27,280.00</td>
                </tr>
                <tr>
                  <td>Refunds Issued</td>
                  <td>1,320.00</td>
                </tr>
                <tr>
                  <td>Net Revenue</td>
                  <td>25,960.00</td>
                </tr>
                <tr>
                  <td>Average Ticket Price</td>
                  <td>5.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Passenger Statistics Section */}
        <div className="card mb-4">
          <div className="card-header bg-info text-white">Passenger Statistics</div>
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Adults</td>
                  <td>4,500</td>
                  <td>61.5%</td>
                </tr>
                <tr>
                  <td>Children</td>
                  <td>2,500</td>
                  <td>34.2%</td>
                </tr>
                <tr>
                  <td>Seniors</td>
                  <td>320</td>
                  <td>4.3%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Route Analysis Section */}
        <div className="card mb-4">
          <div className="card-header bg-warning text-dark">Route Analysis</div>
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Tickets Sold</th>
                  <th>Revenue ($)</th>
                  <th>Average Occupancy</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Route A (City 1 ↔ City 2)</td>
                  <td>2,345</td>
                  <td>11,725.00</td>
                  <td>75%</td>
                </tr>
                <tr>
                  <td>Route B (City 3 ↔ City 4)</td>
                  <td>1,856</td>
                  <td>9,280.00</td>
                  <td>68%</td>
                </tr>
                <tr>
                  <td>Route C (City 5 ↔ City 6)</td>
                  <td>1,255</td>
                  <td>6,275.00</td>
                  <td>55%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Metrics Section */}
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">Operational Metrics</div>
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Average Trip Duration</td>
                  <td>1.5 hours</td>
                </tr>
                <tr>
                  <td>Total Delayed Trips</td>
                  <td>32</td>
                </tr>
                <tr>
                  <td>On-Time Performance</td>
                  <td>93.3%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;