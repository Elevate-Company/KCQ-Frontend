import React, { useState, useEffect, useRef } from 'react';
import '../../css/settings/editcard.css';
import { toast } from 'react-toastify';
import axios from 'axios';

function EditCard() {
  const [username, setUsername] = useState('N/A');
  const [phone, setPhone] = useState('N/A');
  const [email, setEmail] = useState('N/A');
  const [firstName, setFirstName] = useState('N/A');
  const [lastName, setLastName] = useState('N/A');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef(null);
  
  const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get(`${apiUrl}/api/accounts/my-account/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });

        const data = response.data;
        setUsername(data.username || 'N/A');
        setPhone(data.mobile_number || 'N/A');
        setEmail(data.email || 'N/A');
        setFirstName(data.first_name || 'N/A');
        setLastName(data.last_name || 'N/A');
        
        if (data.profile_image) {
          setProfileImageUrl(`${apiUrl}${data.profile_image}`);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data');
        toast.error('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [apiUrl]);

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage) {
      toast.warning('Please select an image to upload');
      return;
    }
    
    setUpdating(true);
    const token = localStorage.getItem('accessToken');
    
    try {
      const formData = new FormData();
      formData.append('profile_image', profileImage);
      
      await axios.post(`${apiUrl}/api/accounts/upload-profile-image/`, formData, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Profile image updated successfully');
      setUpdating(false);
    } catch (error) {
      console.error('Error uploading profile image:', error);
      setError('Failed to upload profile image');
      toast.error('Failed to upload profile image');
      setUpdating(false);
    }
  };

  const handleUpdateProfile = async () => {
    setUpdating(true);
    const token = localStorage.getItem('accessToken');
    
    try {
      await axios.put(`${apiUrl}/api/accounts/update-profile/`, 
        {
          username,
          mobile_number: phone,
          email,
          first_name: firstName,
          last_name: lastName
        }, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          }
        }
      );
      
      toast.success('Profile updated successfully');
      setUpdating(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
      toast.error('Failed to update profile');
      setUpdating(false);
    }
  };

  return (
    <div className="editcard-container ms-3 mt-4">
      <div className="editcard-content">
        <p className="editcard-title">Edit Profile</p>
        
        {error && <p className="text-danger">{error}</p>}
        
        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <div 
                onClick={() => fileInputRef.current.click()} 
                style={{ 
                  cursor: 'pointer', 
                  margin: '0 auto',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '1px dashed #ccc',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundImage: profileImageUrl ? `url(${profileImageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!profileImageUrl && <span>Click to upload image</span>}
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                style={{ display: 'none' }} 
                accept="image/*"
                onChange={handleProfileImageChange}
              />
              <button 
                className="btn btn-sm btn-primary mt-2" 
                onClick={handleImageUpload}
                disabled={!profileImage || updating}
              >
                {updating ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="firstName" className="editcard-label">FIRST NAME:</label>
                <input
                  type="text"
                  id="firstName"
                  className="editcard-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="col">
                <label htmlFor="lastName" className="editcard-label">LAST NAME:</label>
                <input
                  type="text"
                  id="lastName"
                  className="editcard-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="username" className="editcard-label">USERNAME:</label>
            <input
              type="text"
              id="username"
              className="editcard-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label htmlFor="phone" className="editcard-label">PHONE NUMBER:</label>
            <input
              type="text"
              id="phone"
              className="editcard-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <label htmlFor="email" className="editcard-label">EMAIL:</label>
            <input
              type="email"
              id="email"
              className="editcard-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="editcard-button-container">
              <button 
                className="update-profile-button"
                onClick={handleUpdateProfile}
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EditCard;