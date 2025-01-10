import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../navbar/navbar'; 
import axios from 'axios';
import moment from 'moment';

function Reports() {
  const [filter, setFilter] = useState('daily'); 
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [totalTripsCompleted, setTotalTripsCompleted] = useState(0);
  const [passengerStats, setPassengerStats] = useState({
    adults: 0,
    children: 0,
    seniors: 0,
    infants: 0,
  });
  const [routeStats, setRouteStats] = useState([]);
  const [error, setError] = useState('');

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    const fetchTotalTicketsAndRevenue = async () => {
      const token = localStorage.getItem('accessToken');
      const today = moment().format('YYYY-MM-DD');
      let startDate, endDate;

      if (filter === 'daily') {
        startDate = today;
        endDate = today;
      } else if (filter === 'monthly') {
        startDate = moment().startOf('month').format('YYYY-MM-DD');
        endDate = moment().endOf('month').format('YYYY-MM-DD');
      } else if (filter === 'yearly') {
        startDate = moment().startOf('year').format('YYYY-MM-DD');
        endDate = moment().endOf('year').format('YYYY-MM-DD');
      }

      try {
        const response = await axios.get('https://api.kcq-express.co/api/tickets/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        });
        const data = response.data;
        setTotalTicketsSold(data.length); // Assuming the API returns an array of tickets
        const total = data.reduce((sum, ticket) => sum + parseFloat(ticket.price), 0);
        setTotalRevenue(total);

        // Calculate passenger statistics
        const stats = {
          adults: 0,
          children: 0,
          seniors: 0,
          infants: 0,
        };
        const routeStats = {};
        data.forEach(ticket => {
          if (ticket.age_group === 'adult') stats.adults++;
          if (ticket.age_group === 'child') stats.children++;
          if (ticket.age_group === 'senior') stats.seniors++;
          if (ticket.age_group === 'infant') stats.infants++;

          const route = `${ticket.trip.origin} ↔ ${ticket.trip.destination}`;
          if (!routeStats[route]) {
            routeStats[route] = {
              ticketsSold: 0,
              revenue: 0,
              availableSeats: ticket.trip.available_seats,
            };
          }
          routeStats[route].ticketsSold++;
          routeStats[route].revenue += parseFloat(ticket.price);
        });
        setPassengerStats(stats);
        setTotalPassengers(stats.adults + stats.children + stats.seniors + stats.infants);

        // Convert routeStats to an array and find the top 3 picked routes
        const routeStatsArray = Object.keys(routeStats).map(route => ({
          route,
          ticketsSold: routeStats[route].ticketsSold,
          revenue: routeStats[route].revenue,
          occupancy: ((routeStats[route].ticketsSold / routeStats[route].availableSeats) * 100).toFixed(1),
        }));
        routeStatsArray.sort((a, b) => b.ticketsSold - a.ticketsSold);
        setRouteStats(routeStatsArray.slice(0, 3));
      } catch (error) {
        console.error('Error fetching total tickets and revenue:', error);
        setError('Failed to fetch total tickets and revenue');
      }
    };

    const fetchTotalTripsCompleted = async () => {
      const token = localStorage.getItem('accessToken');
      const today = moment().format('YYYY-MM-DD');
      let startDate, endDate;

      if (filter === 'daily') {
        startDate = today;
        endDate = today;
      } else if (filter === 'monthly') {
        startDate = moment().startOf('month').format('YYYY-MM-DD');
        endDate = moment().endOf('month').format('YYYY-MM-DD');
      } else if (filter === 'yearly') {
        startDate = moment().startOf('year').format('YYYY-MM-DD');
        endDate = moment().endOf('year').format('YYYY-MM-DD');
      }

      try {
        const response = await axios.get('https://api.kcq-express.co/api/trips/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        });
        const data = response.data;
        console.log('Trips data:', data); // Log the trips data for debugging
        const completedTrips = data.filter(trip => trip.status === 'completed').length;
        setTotalTripsCompleted(completedTrips);
      } catch (error) {
        console.error('Error fetching total trips completed:', error);
        setError('Failed to fetch total trips completed');
      }
    };

    fetchTotalTicketsAndRevenue();
    fetchTotalTripsCompleted();
  }, [filter]);

  const calculatePercentage = (count) => {
    return ((count / totalPassengers) * 100).toFixed(1);
  };

  return (
    <div>
      <Navbar /> 
      <div className="container my-4">
        <h2 className="text-center mb-4">Ferry Ticketing Management System Report</h2>

        <div className="d-flex justify-content-end mb-4">
          <select className="form-select w-auto" value={filter} onChange={handleFilterChange}>
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="card mb-4">
          <div
            className="card-header text-white"
            style={{ backgroundColor: "#091057" }}
          >
            Overview
          </div>
          <div className="card-body">
            <p><strong>Total Tickets Sold:</strong> {totalTicketsSold}</p>
            <p><strong>Total Revenue:</strong> ₱{totalRevenue.toFixed(2)}</p>
            <p><strong>Total Passengers:</strong> {totalPassengers}</p>
            <p><strong>Trips Completed:</strong> {totalTripsCompleted}</p>
            {error && <p className="text-danger">{error}</p>}
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-success text-white">Financial Summary</div>
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount (₱)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Revenue</td>
                  <td>{totalRevenue.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Net Revenue</td>
                  <td>{totalRevenue.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Average Ticket Price</td>
                  <td>{(totalRevenue / totalTicketsSold).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

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
                  <td>{passengerStats.adults}</td>
                  <td>{calculatePercentage(passengerStats.adults)}%</td>
                </tr>
                <tr>
                  <td>Children</td>
                  <td>{passengerStats.children}</td>
                  <td>{calculatePercentage(passengerStats.children)}%</td>
                </tr>
                <tr>
                  <td>Seniors</td>
                  <td>{passengerStats.seniors}</td>
                  <td>{calculatePercentage(passengerStats.seniors)}%</td>
                </tr>
                <tr>
                  <td>Infants</td>
                  <td>{passengerStats.infants}</td>
                  <td>{calculatePercentage(passengerStats.infants)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-warning text-dark">Route Analysis</div>
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Tickets Sold</th>
                  <th>Revenue (₱)</th>
                  <th>Average Occupancy</th>
                </tr>
              </thead>
              <tbody>
                {routeStats.map((routeStat, index) => (
                  <tr key={index}>
                    <td>{routeStat.route}</td>
                    <td>{routeStat.ticketsSold}</td>
                    <td>{routeStat.revenue.toFixed(2)}</td>
                    <td>{routeStat.occupancy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;