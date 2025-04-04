import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/passenger/addpassenger.css"; // Import the CSS file

function AddPassenger() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [totalBookings, setTotalBookings] = useState(0);
  const [boardingStatus, setBoardingStatus] = useState("NOT_CHECKED_IN");
  const [isDelete, setIsDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passengerData = {
      name,
      email,
      contact,
      phone,
      total_bookings: totalBookings,
      boarding_status: boardingStatus,
      is_delete: isDelete,
    };

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No access token found. Please log in.");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/passengers/`,
        passengerData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      setSuccess("Passenger added successfully");
      setError("");
      console.log(response.data);

      // Clear the input fields
      setName("");
      setEmail("");
      setContact("");
      setPhone("");
      setTotalBookings(0);
      setBoardingStatus("NOT_CHECKED_IN");
      setIsDelete(false);
    } catch (error) {
      setError("Failed to add passenger");
      setSuccess("");
      console.error(
        "Error adding passenger:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header text-white bg-theme1">
          <h4 className="mb-0">Add Passenger</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contact" className="form-label">
                Contact
              </label>
              <input
                type="text"
                className="form-control"
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="totalBookings" className="form-label">
                Total Bookings
              </label>
              <input
                type="number"
                className="form-control"
                id="totalBookings"
                value={totalBookings}
                onChange={(e) => setTotalBookings(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="boardingStatus" className="form-label">
                Boarding Status
              </label>
              <select
                className="form-select"
                id="boardingStatus"
                value={boardingStatus}
                onChange={(e) => setBoardingStatus(e.target.value)}
                required
              >
                <option value="NOT_CHECKED_IN">NOT_CHECKED_IN</option>
                <option value="CHECKED_IN">CHECKED_IN</option>
                <option value="BOARDING">BOARDING</option>
                <option value="MISSED">MISSED</option>
              </select>
            </div>
            <div className="form-check mb-4">
              <input
                type="checkbox"
                className="form-check-input small-checkbox"
                id="isDelete"
                checked={isDelete}
                onChange={(e) => setIsDelete(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="isDelete">
                Is Deleted?
              </label>
            </div>
            <button type="submit" className="btn btn-success w-100">
              Add Passenger
            </button>
          </form>
          {error && (
            <div className="alert alert-danger alert-dismissible mt-3">
              <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success alert-dismissible mt-3">
              <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
              {success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddPassenger;