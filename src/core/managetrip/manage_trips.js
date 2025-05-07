import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/managetrip/managetrips.css';
import ManageTripCard from './managetripcard';
import Navbar from '../navbar/navbar';
import { Pagination } from 'react-bootstrap';

function ManageTrips() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Show 3 trips per page as requested
  
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    filterAndSearchTrips(trips, filter, searchQuery);
  }, [filter, searchQuery, trips]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/trips/`, {
        headers: {
          'Authorization': `Token ${token}`,
        }
      });
      
      const fetchedTrips = response.data;
      setTrips(fetchedTrips);
      filterAndSearchTrips(fetchedTrips, filter, searchQuery);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setError("Failed to load trips. Please try again later.");
      setLoading(false);
    }
  };

  const filterAndSearchTrips = (trips, filter, query) => {
    const currentDate = new Date();
    let filtered = [...trips];
    
    // Apply filter
    if (filter === 'upcoming') {
      filtered = filtered.filter((trip) => {
        const departureDate = new Date(trip.departure_time);
        return departureDate > currentDate;
      });
    } else if (filter === 'completed') {
      filtered = filtered.filter((trip) => {
        const departureDate = new Date(trip.departure_time);
        return departureDate < currentDate;
      });
    } else if (filter === 'cancelled') {
      filtered = filtered.filter((trip) => trip.status === 'cancelled');
    }

    // Apply search
    if (query) {
      filtered = filtered.filter(trip => {
        // Get boat type from ferry_boat object or string
        const boatType = typeof trip.ferry_boat === 'object' 
          ? (trip.ferry_boat.name || trip.ferry_boat.slug || '') 
          : (trip.ferry_boat || '');
        
        // Search in origin, destination, or boat type (case-insensitive)
        const searchFields = [
          boatType,
          trip.origin || '',
          trip.destination || ''
        ];
        
        return searchFields.some(field => 
          field.toLowerCase().includes(query.toLowerCase())
        );
      });
    }

    setFilteredTrips(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Get current trips for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrips = filteredTrips.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Previous and next page handlers
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="manage-trips-container container text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="manage-trips-container container mt-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="manage-trips-container container">
        <div className="header-search-dropdown-row">
          <h1 className="header-trip mt-3">Manage Trips</h1>
          <div className="search-dropdown-container mt-3">
            <input
              type="text"
              className="search-input-trip"
              placeholder="Search trips and boats type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="filter-dropdown-trip"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button 
              type="button" 
              className="btn-add-trip"
              onClick={() => navigate('/addtrip')}
            >
              + Add Trip
            </button>
          </div>
        </div>

        <div className="trip-cards-container">
          {currentTrips.length > 0 ? (
            currentTrips.map((trip) => (
              <ManageTripCard key={trip.id} trip={trip} />
            ))
          ) : (
            <div className="no-trips-message text-center mt-5">
              <p>No trips found. Try adjusting your search or filter.</p>
            </div>
          )}
        </div>

        {filteredTrips.length > 0 && (
          <div className="pagination-container mt-4 d-flex justify-content-center">
            <Pagination>
              <Pagination.Prev
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              />
              
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item 
                  key={index + 1} 
                  active={index + 1 === currentPage}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              
              <Pagination.Next
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageTrips;