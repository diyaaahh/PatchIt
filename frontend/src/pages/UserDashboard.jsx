import { withAuthenticationRequired } from '@auth0/auth0-react';
import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const UserDashboard = () => {
    const navigate = useNavigate();
      const [loading, setLoading] = useState(true);
    const [potholes, setPotholes] = useState([]);
     const [error, setError] = useState(null);

    const fetchAddress = async (latitude, longitude) => {
        try {
          const response = await axios.get('http://localhost:3000/photo/getAddress', {
            params: { latitude, longitude }
          });
          
          if (response.data && response.data.address) {
            return response.data.address;
          }
          console.warn('Address not found in response:', response.data);
          return 'Location not available';
        } catch (error) {
          console.error('Error fetching address:', error);
          return 'Location not available';
        }
      };
    
      useEffect(() => {
        const fetchPotholes = async () => {
          try {
            const response = await axios.get('http://localhost:3000/photo/getInProgress');
            
            if (!response.data.reports) {
              setError('No reports found');
              return;
            }
    
            const potholesWithLocation = await Promise.all(
              response.data.reports.map(async (pothole) => {
                // Add validation for latitude and longitude
                if (!pothole.latitude || !pothole.longitude) {
                  console.warn('Missing coordinates for pothole:', pothole._id);
                  return { ...pothole, address: 'Invalid coordinates' };
                }
    
                const address = await fetchAddress(pothole.latitude, pothole.longitude);
                return { ...pothole, address };
              })
            );
    
            console.log(potholesWithLocation);
            setPotholes(potholesWithLocation);
          } catch (error) {
            console.error('Error fetching potholes:', error);
            setError('Failed to fetch potholes. Please try again later.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchPotholes();
      }, []);
    
      if (loading) {
        return (
          <div className="flex justify-center items-center min-h-screen">
            <p className="text-lg">Loading potholes...</p>
          </div>
        );
      }


    const handleReportSubmit = () => {
        navigate('/home')
    }
  
    return (
      <div className="min-h-screen overflow-auto bg-gradient-to-br from-blue-50 to-purple-50 p-6">
  
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 flex flex-row justify-between">
            <h2 className="text-2xl font-bold text-blue-600">Active Reports</h2>
            <button className='text-sm font-bold text-gray-500' onClick={handleReportSubmit}>Report Pothole</button>
          </div>
          
          <div className="px-6 pb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Image</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Location</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {potholes.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* Calendar Icon */}
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <img src={`http://localhost:3000${report.photoUrl}`} className="text-sm text-gray-600"/> 
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* Location Pin Icon */}
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm text-gray-600">{report.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.status === 'Active' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* Message Icon */}
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="text-sm text-gray-600">{report.comment}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* User Icon */}
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm text-gray-600">{report.severity}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default withAuthenticationRequired(UserDashboard);