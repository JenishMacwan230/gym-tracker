import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('members');
  const [members, setMembers] = useState([]);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    fetchMembers();
    fetchEquipment();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/members`);
      setMembers(res.data);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const fetchEquipment = async () => {
    try {
      const res = await axios.get(`${API_BASE}/equipment`);
      setEquipment(res.data);
    } catch (err) {
      console.error('Error fetching equipment:', err);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', fontFamily: 'system-ui, sans-serif', padding: '0 20px' }}>
      <h2>Gym Subscription & Equipment Tracker</h2>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('members')}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'members' ? '#2563eb' : '#e2e8f0',
            color: activeTab === 'members' ? '#ffffff' : '#000000',
            border: 'none',
            borderRadius: '6px'
          }}
        >
          Member Subscriptions
        </button>
        <button 
          onClick={() => setActiveTab('equipment')}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'equipment' ? '#2563eb' : '#e2e8f0',
            color: activeTab === 'equipment' ? '#ffffff' : '#000000',
            border: 'none',
            borderRadius: '6px'
          }}
        >
          Equipment Log
        </button>
      </div>

      {/* Content */}
      {activeTab === 'members' ? (
        <div>
          <h3>Member Subscriptions</h3>
          <table width="100%" cellPadding="12" style={{ borderCollapse: 'collapse', textAlign: 'left', border: '1px solid #e2e8f0' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th>Name</th>
                <th>Email</th>
                <th>Last Paid</th>
                <th>Expires On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr><td colSpan="5">No members found. Add data via API.</td></tr>
              ) : (
                members.map(item => (
                  <tr key={item._id} style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{new Date(item.lastPaymentDate).toLocaleDateString()}</td>
                    <td>{new Date(item.expirationDate).toLocaleDateString()}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: '12px',
                        backgroundColor: item.isExpired ? '#ef4444' : '#22c55e'
                      }}>
                        {item.isExpired ? 'Expired' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h3>Equipment Maintenance Log</h3>
          <table width="100%" cellPadding="12" style={{ borderCollapse: 'collapse', textAlign: 'left', border: '1px solid #e2e8f0' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th>Equipment</th>
                <th>Location</th>
                <th>Last Serviced</th>
                <th>Next Due</th>
                <th>Alert Status</th>
              </tr>
            </thead>
            <tbody>
              {equipment.length === 0 ? (
                <tr><td colSpan="5">No equipment logged. Add data via API.</td></tr>
              ) : (
                equipment.map(item => (
                  <tr key={item._id} style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td>{item.name}</td>
                    <td>{item.location}</td>
                    <td>{new Date(item.lastServiced).toLocaleDateString()}</td>
                    <td>{new Date(item.nextServiceDate).toLocaleDateString()}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: '12px',
                        backgroundColor: item.needsService ? '#f97316' : '#3b82f6'
                      }}>
                        {item.needsService ? 'Service Overdue' : 'Operational'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}