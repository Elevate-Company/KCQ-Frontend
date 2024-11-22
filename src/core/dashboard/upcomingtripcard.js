import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/dashboard/upcomingtripcard.css';
import Tripcard from './tripcard';

function UpcomingTripCard() {
  const trips = [
    { id: 1, from: 'Cebu', destination: 'North Korea', boatImage: 'boatlogo.png', dashImage: 'dash.png' },
    { id: 2, from: 'Davao', destination: 'Japan', boatImage: 'boatlogo.png', dashImage: 'dash.png' },
    { id: 3, from: 'Iloilo', destination: 'China', boatImage: 'boatlogo.png', dashImage: 'dash.png' },
  ];

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-12">
          <div className="card shadow-lg border-0 mb-4 responsive-card">
            <div className="card-body">
              <h5 className="mb-4 text-center">Upcoming Trips</h5>
              {trips.map((trip) => (
                <Tripcard
                  key={trip.id}
                  from={trip.from}
                  destination={trip.destination}
                  boatImage={require(`../../assets/${trip.boatImage}`)}
                  dashImage={require(`../../assets/${trip.dashImage}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpcomingTripCard;
