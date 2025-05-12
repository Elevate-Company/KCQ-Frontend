import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../navbar/navbar'; 
import axios from 'axios';
import moment from 'moment';

function Reports() {
  const [filter, setFilter] = useState('daily'); 
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBaggageFees, setTotalBaggageFees] = useState(0);
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [totalTripsCompleted, setTotalTripsCompleted] = useState(0);
  const [passengerStats, setPassengerStats] = useState({
    adults: 0,
    children: 0,
    students: 0,
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
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tickets/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        });
        
        const tickets = response.data;
        console.log('Tickets data:', tickets);
        
        setTotalTicketsSold(tickets.length);
        let revenue = 0;
        let baggageFees = 0;
        
        const stats = {
          adults: 0,
          children: 0,
          students: 0,
          seniors: 0,
          infants: 0,
        };
        
        const routeStats = {};
        
        tickets.forEach(ticket => {
          revenue += parseFloat(ticket.price);
          
          // Add baggage fees to total baggage revenue if available
          if (ticket.baggage_ticket && ticket.baggage && ticket.baggage.total_fee) {
            baggageFees += parseFloat(ticket.baggage.total_fee);
          }
          
          // Update passenger stats
          const ageGroup = ticket.age_group?.toLowerCase();
          if (ageGroup === 'adult') stats.adults++;
          else if (ageGroup === 'child') stats.children++;
          else if (ageGroup === 'student') stats.students++;
          else if (ageGroup === 'senior') stats.seniors++;
          else if (ageGroup === 'infant') stats.infants++;
          
          // Update route stats
          const route = `${ticket.trip.origin} to ${ticket.trip.destination}`;
          if (!routeStats[route]) {
            routeStats[route] = {
              ticketsSold: 0,
              revenue: 0,
              baggageFees: 0,
              availableSeats: ticket.trip.available_seats,
            };
          }
          routeStats[route].ticketsSold++;
          routeStats[route].revenue += parseFloat(ticket.price);
          
          // Add baggage fees to route stats
          if (ticket.baggage_ticket && ticket.baggage && ticket.baggage.total_fee) {
            routeStats[route].baggageFees += parseFloat(ticket.baggage.total_fee);
          }
        });
        
        setTotalRevenue(revenue);
        setTotalBaggageFees(baggageFees);
        setPassengerStats(stats);
        setTotalPassengers(stats.adults + stats.children + stats.students + stats.seniors + stats.infants);

        // Convert routeStats to an array and find the top 3 picked routes
        const routeStatsArray = Object.keys(routeStats).map(route => ({
          route,
          ticketsSold: routeStats[route].ticketsSold,
          revenue: routeStats[route].revenue,
          baggageFees: routeStats[route].baggageFees,
          totalRevenue: routeStats[route].revenue + routeStats[route].baggageFees,
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
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/trips/`, {
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

  // Format decimal values consistently to two decimal places
  const formatDecimal = (value) => {
    return parseFloat(value || 0).toFixed(2);
  };

  const calculatePercentage = (count) => {
    return formatDecimal((count / totalPassengers) * 100);
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
            <p><strong>Ticket Revenue:</strong> ₱{formatDecimal(totalRevenue)}</p>
            <p><strong>Baggage Revenue:</strong> ₱{formatDecimal(totalBaggageFees)}</p>
            <p><strong>Total Revenue:</strong> ₱{formatDecimal(totalRevenue + totalBaggageFees)}</p>
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
                  <td>Ticket Revenue</td>
                  <td>{formatDecimal(totalRevenue)}</td>
                </tr>
                <tr>
                  <td>Baggage Revenue</td>
                  <td>{formatDecimal(totalBaggageFees)}</td>
                </tr>
                <tr>
                  <td>Total Revenue</td>
                  <td>{formatDecimal(totalRevenue + totalBaggageFees)}</td>
                </tr>
                <tr>
                  <td>Average Ticket Price</td>
                  <td>{totalTicketsSold > 0 ? formatDecimal(totalRevenue / totalTicketsSold) : '0.00'}</td>
                </tr>
                <tr>
                  <td>Average Total Revenue per Passenger</td>
                  <td>{totalTicketsSold > 0 ? formatDecimal((totalRevenue + totalBaggageFees) / totalTicketsSold) : '0.00'}</td>
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
                  <td>Students</td>
                  <td>{passengerStats.students}</td>
                  <td>{calculatePercentage(passengerStats.students)}%</td>
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
                  <th>Ticket Revenue (₱)</th>
                  <th>Baggage Revenue (₱)</th>
                  <th>Total Revenue (₱)</th>
                  <th>Average Occupancy</th>
                </tr>
              </thead>
              <tbody>
                {routeStats.map((routeStat, index) => (
                  <tr key={index}>
                    <td>{routeStat.route}</td>
                    <td>{routeStat.ticketsSold}</td>
                    <td>{formatDecimal(routeStat.revenue)}</td>
                    <td>{formatDecimal(routeStat.baggageFees)}</td>
                    <td>{formatDecimal(routeStat.totalRevenue)}</td>
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