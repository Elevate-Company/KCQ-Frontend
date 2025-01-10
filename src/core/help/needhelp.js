import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../navbar/navbar';

function NeedHelp() {
  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">Need Help?</h2>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Contact Support</h5>
            <p className="card-text">If you need assistance, please contact our support team.</p>
            <ul className="list-unstyled">
              <li><strong>Email:</strong> support@kcq-express.co</li>
              <li><strong>Phone:</strong> +1 234 567 890</li>
              <li><strong>Address:</strong> 1234 KCQ Express Lane, City, Country</li>
            </ul>
          </div>
        </div>
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">Frequently Asked Questions</h5>
            <p className="card-text">Find answers to common questions below:</p>
            <ul className="list-unstyled">
              <li><strong>Q:</strong> How do I reset my password?</li>
              <li><strong>A:</strong> You can reset your password by clicking on the "Forgot Password" link on the login page.</li>
              <li className="mt-3"><strong>Q:</strong> How do I contact customer support?</li>
              <li><strong>A:</strong> You can contact customer support via email at support@kcq-express.co or by phone at +1 234 567 890.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NeedHelp;