import React from 'react';
import '../../css/dashboard/dashboard.css';
import DashCard from './dashcard';
import Navbar from '../navbar';

function Dashboard() {
  return (
    <div>
      <Navbar />
      <DashCard />
    </div>
  );
}

export default Dashboard;
