import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProgramsSection from './components/ProgramsSection';
import EquipmentGallery from './components/EquipmentGallery';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import AdminProfileModal from './components/AdminProfileModal';
import { TableSkeleton, GallerySkeleton } from './components/SkeletonLoader';
import { validateName, validateEmail, validatePhone, validateSerialNumber } from './utils/validation';
import { 
  CreditCardIcon, DumbbellIcon, CameraIcon, TableIcon, PlusIcon, 
  SearchIcon, UserIcon, RefreshIcon, EditIcon, DeleteIcon, ZapIcon, CircleEditBtn, CircleDeleteBtn 
} from './components/Icons';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'about', 'members', 'equipment'
  const [trackerTab, setTrackerTab] = useState('members'); // 'members', 'equipment' inside management view
  const [equipmentViewMode, setEquipmentViewMode] = useState('masonry'); // 'masonry' or 'table'
  const [loadingData, setLoadingData] = useState(true);

  // Super Admin Auth state with localStorage persistence
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('gym_admin_token') || '');
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('gym_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminProfileModal, setShowAdminProfileModal] = useState(false);

  const [members, setMembers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    expiredMembers: 0,
    totalEquipment: 0,
    overdueEquipment: 0,
    operationalEquipment: 0
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [memberFilter, setMemberFilter] = useState('all'); // all, active, expired
  const [equipmentFilter, setEquipmentFilter] = useState('all'); // all, operational, overdue

  // Modals state
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    phone: '',
    planType: 'Monthly',
    durationMonths: 1,
    lastPaymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [equipmentForm, setEquipmentForm] = useState({
    name: '',
    serialNumber: '',
    category: 'Strength',
    location: 'Main Floor',
    imageUrl: '',
    lastServiced: new Date().toISOString().split('T')[0],
    serviceIntervalDays: 90,
    status: 'Operational',
    notes: ''
  });

  // Toast notification
  const [toast, setToast] = useState(null);

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fallbackMembers = [];
  const fallbackEquipment = [];

  const fetchAllData = async () => {
    try {
      setLoadingData(true);
      const [memRes, eqRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE}/members`),
        axios.get(`${API_BASE}/equipment`),
        axios.get(`${API_BASE}/dashboard/stats`)
      ]);
      setMembers(memRes.data);
      setEquipment(eqRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.warn('Backend server unreachable, using clean empty dataset:', err.message);
      setMembers([]);
      setEquipment([]);
      setStats({
        totalMembers: 0,
        activeMembers: 0,
        expiredMembers: 0,
        totalEquipment: 0,
        overdueEquipment: 0,
        operationalEquipment: 0
      });
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Admin Auth Helpers & RBAC Guards
  const requireAdmin = (actionCallback) => {
    if (!adminToken || !adminUser) {
      showNotification('🔒 Super Admin login required to perform this action.');
      setShowLoginModal(true);
      return false;
    }
    if (typeof actionCallback === 'function') {
      actionCallback();
    }
    return true;
  };

  const handleLoginSuccess = (token, user) => {
    setAdminToken(token);
    setAdminUser(user);
    localStorage.setItem('gym_admin_token', token);
    localStorage.setItem('gym_admin_user', JSON.stringify(user));
    showNotification(`🎉 Logged in as Super Admin (${user.username})`);
  };

  const handleLogout = () => {
    setAdminToken('');
    setAdminUser(null);
    localStorage.removeItem('gym_admin_token');
    localStorage.removeItem('gym_admin_user');
    showNotification('🚪 Logged out successfully');
  };

  const handleProfileUpdated = (token, user) => {
    setAdminToken(token);
    setAdminUser(user);
    localStorage.setItem('gym_admin_token', token);
    localStorage.setItem('gym_admin_user', JSON.stringify(user));
    showNotification('✨ Admin credentials updated!');
  };

  const authHeaders = useMemo(() => ({
    headers: { Authorization: `Bearer ${adminToken}` }
  }), [adminToken]);

  // Handler for Seeding Data
  const handleSeedData = () => {
    requireAdmin(async () => {
      try {
        const res = await axios.post(`${API_BASE}/seed`, {}, authHeaders);
        showNotification('✅ ' + (res.data.message || 'Demo dataset loaded!'));
        fetchAllData();
      } catch (err) {
        showNotification('❌ Failed to seed demo data');
      }
    });
  };

  // Member Handlers
  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (!requireAdmin()) return;

    // Regex Validation
    if (!validateName(memberForm.name)) {
      showNotification('❌ Invalid member name! (Must be 2-50 characters, letters only)');
      return;
    }
    if (!validateEmail(memberForm.email)) {
      showNotification('❌ Invalid email format! Please enter a valid email address.');
      return;
    }
    if (memberForm.phone && !validatePhone(memberForm.phone)) {
      showNotification('❌ Invalid phone format! Please enter a valid phone number.');
      return;
    }

    try {
      if (editingMember) {
        await axios.put(`${API_BASE}/members/${editingMember._id}`, memberForm, authHeaders);
        showNotification(`Updated member ${memberForm.name}`);
      } else {
        await axios.post(`${API_BASE}/members`, memberForm, authHeaders);
        showNotification(`Added new member ${memberForm.name}`);
      }
    } catch (err) {
      if (editingMember) {
        setMembers(prev => prev.map(m => m._id === editingMember._id ? { ...m, ...memberForm } : m));
        showNotification(`Updated member ${memberForm.name}`);
      } else {
        const newM = { _id: 'm_' + Date.now(), ...memberForm, isExpired: false, daysRemaining: 30 };
        setMembers(prev => [newM, ...prev]);
        showNotification(`Added new member ${memberForm.name}`);
      }
    } finally {
      setShowMemberModal(false);
      setEditingMember(null);
      resetMemberForm();
      fetchAllData();
    }
  };

  const handleRenewMember = (id, duration = 1) => {
    requireAdmin(async () => {
      try {
        await axios.put(`${API_BASE}/members/${id}/renew`, { durationMonths: duration }, authHeaders);
        showNotification(`🎉 Subscription renewed for +${duration} month(s)!`);
        fetchAllData();
      } catch (err) {
        setMembers(prev => prev.map(m => m._id === id ? { ...m, isExpired: false, daysRemaining: duration * 30 } : m));
        showNotification(`🎉 Subscription renewed for +${duration} month(s)!`);
      }
    });
  };

  const handleDeleteMember = (id, name) => {
    requireAdmin(async () => {
      if (!window.confirm(`Are you sure you want to remove member ${name}?`)) return;
      try {
        await axios.delete(`${API_BASE}/members/${id}`, authHeaders);
      } catch (err) {
        // offline fallback
      } finally {
        setMembers(prev => prev.filter(m => m._id !== id));
        showNotification(`Removed member ${name}`);
      }
    });
  };

  const openEditMember = (m) => {
    requireAdmin(() => {
      setEditingMember(m);
      setMemberForm({
        name: m.name || '',
        email: m.email || '',
        phone: m.phone || '',
        planType: m.planType || 'Monthly',
        durationMonths: m.durationMonths || 1,
        lastPaymentDate: m.lastPaymentDate ? new Date(m.lastPaymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: m.notes || ''
      });
      setShowMemberModal(true);
    });
  };

  const resetMemberForm = () => {
    setMemberForm({
      name: '',
      email: '',
      phone: '',
      planType: 'Monthly',
      durationMonths: 1,
      lastPaymentDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const openNewMemberModal = () => {
    requireAdmin(() => {
      resetMemberForm();
      setEditingMember(null);
      setShowMemberModal(true);
    });
  };

  // Equipment Handlers
  const handleSaveEquipment = async (e) => {
    e.preventDefault();
    if (!requireAdmin()) return;

    // Regex Validation
    if (!validateName(equipmentForm.name)) {
      showNotification('❌ Invalid equipment name! (Must be at least 2 characters)');
      return;
    }
    if (equipmentForm.serialNumber && !validateSerialNumber(equipmentForm.serialNumber)) {
      showNotification('❌ Invalid serial number format! (Alphanumeric, hyphens, underscores only)');
      return;
    }

    try {
      if (editingEquipment) {
        await axios.put(`${API_BASE}/equipment/${editingEquipment._id}`, equipmentForm, authHeaders);
        showNotification(`Updated equipment ${equipmentForm.name}`);
      } else {
        await axios.post(`${API_BASE}/equipment`, equipmentForm, authHeaders);
        showNotification(`Added equipment ${equipmentForm.name}`);
      }
    } catch (err) {
      if (editingEquipment) {
        setEquipment(prev => prev.map(eq => eq._id === editingEquipment._id ? { ...eq, ...equipmentForm } : eq));
        showNotification(`Updated equipment ${equipmentForm.name}`);
      } else {
        const newEq = { _id: 'e_' + Date.now(), ...equipmentForm, needsService: false, status: 'Operational' };
        setEquipment(prev => [newEq, ...prev]);
        showNotification(`Added equipment ${equipmentForm.name}`);
      }
    } finally {
      setShowEquipmentModal(false);
      setEditingEquipment(null);
      resetEquipmentForm();
      fetchAllData();
    }
  };

  const handleLogService = (id, name, currentNeedsService) => {
    requireAdmin(async () => {
      try {
        const res = await axios.put(`${API_BASE}/equipment/${id}/service`, {}, authHeaders);
        const isNowOverdue = res.data?.needsService || res.data?.status === 'Maintenance Needed';
        const label = isNowOverdue ? 'Service Due' : 'Operational';
        showNotification(`🛠️ Status for ${name} set to ${label}`);
        fetchAllData();
      } catch (err) {
        setEquipment(prev => prev.map(eq => {
          if (eq._id === id) {
            const nextNeedsService = !eq.needsService;
            return {
              ...eq,
              needsService: nextNeedsService,
              status: nextNeedsService ? 'Maintenance Needed' : 'Operational',
              lastServiced: nextNeedsService ? eq.lastServiced : new Date().toISOString().split('T')[0]
            };
          }
          return eq;
        }));
        const label = currentNeedsService ? 'Operational' : 'Service Due';
        showNotification(`🛠️ Status for ${name} set to ${label}`);
      }
    });
  };

  const handleDeleteEquipment = (id, name) => {
    requireAdmin(async () => {
      if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;
      try {
        await axios.delete(`${API_BASE}/equipment/${id}`, authHeaders);
      } catch (err) {
        // offline fallback
      } finally {
        setEquipment(prev => prev.filter(eq => eq._id !== id));
        showNotification(`Removed equipment ${name}`);
      }
    });
  };

  const openEditEquipment = (eItem) => {
    requireAdmin(() => {
      setEditingEquipment(eItem);
      setEquipmentForm({
        name: eItem.name || '',
        serialNumber: eItem.serialNumber || '',
        category: eItem.category || 'Strength',
        location: eItem.location || 'Main Floor',
        imageUrl: eItem.imageUrl || '',
        lastServiced: eItem.lastServiced ? new Date(eItem.lastServiced).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        serviceIntervalDays: eItem.serviceIntervalDays || 90,
        status: eItem.status || 'Operational',
        notes: eItem.notes || ''
      });
      setShowEquipmentModal(true);
    });
  };

  const openNewEquipmentModal = () => {
    requireAdmin(() => {
      resetEquipmentForm();
      setEditingEquipment(null);
      setShowEquipmentModal(true);
    });
  };

  const resetEquipmentForm = () => {
    setEquipmentForm({
      name: '',
      serialNumber: '',
      category: 'Strength',
      location: 'Main Floor',
      imageUrl: '',
      lastServiced: new Date().toISOString().split('T')[0],
      serviceIntervalDays: 90,
      status: 'Operational',
      notes: ''
    });
  };

  const handleCloudinaryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data && res.data.url) {
        setEquipmentForm(prev => ({ ...prev, imageUrl: res.data.url }));
        showNotification('☁️ Image uploaded to Cloudinary!');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      const errMsg = err.response?.data?.error || 'Cloudinary upload failed';
      showNotification(`❌ ${errMsg}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Filtered & Priority-Sorted Member List (Expired Plans at top)
  const filteredMembers = useMemo(() => {
    const list = members.filter(m => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.phone?.toLowerCase().includes(q);
      
      if (memberFilter === 'active') return matchesSearch && !m.isExpired;
      if (memberFilter === 'expired') return matchesSearch && m.isExpired;
      return matchesSearch;
    });

    return [...list].sort((a, b) => {
      // 1. Expired plans FIRST at top
      if (a.isExpired && !b.isExpired) return -1;
      if (!a.isExpired && b.isExpired) return 1;
      // 2. If both are expired, sort by most severely expired first
      if (a.isExpired && b.isExpired) {
        return (a.daysRemaining || 0) - (b.daysRemaining || 0);
      }
      // 3. If both are active, sort by closest to expiration date first
      return (a.daysRemaining || 0) - (b.daysRemaining || 0);
    });
  }, [members, searchQuery, memberFilter]);

  const filteredEquipment = useMemo(() => {
    return equipment.filter(e => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        e.name?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q);
      
      if (equipmentFilter === 'operational') return matchesSearch && !e.needsService;
      if (equipmentFilter === 'overdue') return matchesSearch && e.needsService;
      return matchesSearch;
    });
  }, [equipment, searchQuery, equipmentFilter]);

  // Real-time dynamic counts derived directly from active state arrays
  const memberCounts = useMemo(() => {
    const active = members.filter(m => !m.isExpired).length;
    const expired = members.filter(m => m.isExpired).length;
    return { total: members.length, active, expired };
  }, [members]);

  const equipmentCounts = useMemo(() => {
    const operational = equipment.filter(e => !e.needsService).length;
    const overdue = equipment.filter(e => e.needsService).length;
    return { total: equipment.length, operational, overdue };
  }, [equipment]);

  // Enforce Admin-only access to Members page
  useEffect(() => {
    if (!adminUser && activeTab === 'members') {
      setActiveTab('home');
    }
  }, [adminUser, activeTab]);

  // Handle header tab selection
  const handleTabChange = (tab) => {
    if (tab === 'members' && !adminUser) {
      setShowLoginModal(true);
      return;
    }
    setActiveTab(tab);
    if (tab === 'members') setTrackerTab('members');
    if (tab === 'equipment') setTrackerTab('equipment');
  };

  return (
    <div className="app-wrapper">
      {/* Toast Alert */}
      {toast && <div className="toast-alert">{toast}</div>}

      {/* Header Navbar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        onOpenAddMember={openNewMemberModal} 
        adminUser={adminUser}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onOpenSettings={() => setShowAdminProfileModal(true)}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {activeTab === 'home' && (
          <>
            <HeroSection 
              onExploreServices={() => {
                const el = document.getElementById('services');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onStartScheduling={() => {
                setActiveTab('about');
                setTimeout(() => {
                  const contactEl = document.querySelector('.top-contact-location-section') || document.querySelector('.contact-card-premium');
                  if (contactEl) {
                    contactEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 120);
              }}
            />

            <ProgramsSection 
              onSelectProgram={(programId) => {
                showNotification(`Selected training track: ${programId.toUpperCase()}`);
              }} 
            />
          </>
        )}

        {/* About Us Section */}
        {activeTab === 'about' && (
          <AboutUs 
            adminUser={adminUser} 
            adminToken={adminToken} 
            showNotification={showNotification} 
          />
        )}

        {/* Management Section: Members or Equipment */}
        {(activeTab === 'members' || activeTab === 'equipment') && (
          <section className="tracker-section">
            
            {/* Top Action Header Bar */}
            <div className="section-top-action-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {activeTab === 'members' ? (
                  <>
                    <CreditCardIcon size={20} color="#ff6b72" />
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.3px' }}>Member Subscriptions</h2>
                  </>
                ) : (
                  <>
                    <DumbbellIcon size={20} color="#ff6b72" />
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.3px' }}>Equipment Gallery & Maintenance</h2>
                  </>
                )}
              </div>

              {activeTab === 'members' ? (
                <button onClick={openNewMemberModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <PlusIcon size={16} />
                  <span>Add New Member</span>
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {/* View Switcher Mode */}
                  <div className="view-mode-toggle">
                    <button 
                      className={`toggle-btn ${equipmentViewMode === 'masonry' ? 'active' : ''}`}
                      onClick={() => setEquipmentViewMode('masonry')}
                      title="Masonry Photo Grid View"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <CameraIcon size={15} />
                      <span>Photo Gallery</span>
                    </button>
                    <button 
                      className={`toggle-btn ${equipmentViewMode === 'table' ? 'active' : ''}`}
                      onClick={() => setEquipmentViewMode('table')}
                      title="Detailed Data Table View"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <TableIcon size={15} />
                      <span>Table View</span>
                    </button>
                  </div>
                  {adminUser && (
                    <button onClick={openNewEquipmentModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <PlusIcon size={16} />
                      <span>Log Equipment</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Controls Bar */}
            <div className="controls-bar">
              <div className="search-box">
                <span className="search-icon" style={{ display: 'flex', alignItems: 'center' }}>
                  <SearchIcon size={16} color="var(--text-muted)" />
                </span>
                <input 
                  type="text" 
                  className="search-input"
                  placeholder={activeTab === 'members' ? "Search member name, email or phone..." : "Search by equipment name or exercise category..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {activeTab === 'members' ? (
                <div className="filter-group">
                  <button 
                    className={`filter-pill ${memberFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setMemberFilter('all')}
                  >
                    All ({memberCounts.total})
                  </button>
                  <button 
                    className={`filter-pill ${memberFilter === 'active' ? 'active' : ''}`}
                    onClick={() => setMemberFilter('active')}
                  >
                    Active ({memberCounts.active})
                  </button>
                  <button 
                    className={`filter-pill ${memberFilter === 'expired' ? 'active' : ''}`}
                    onClick={() => setMemberFilter('expired')}
                  >
                    Expired ({memberCounts.expired})
                  </button>
                </div>
              ) : (
                <div className="filter-group">
                  <button 
                    className={`filter-pill ${equipmentFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setEquipmentFilter('all')}
                  >
                    All Machines ({equipmentCounts.total})
                  </button>
                  <button 
                    className={`filter-pill ${equipmentFilter === 'operational' ? 'active' : ''}`}
                    onClick={() => setEquipmentFilter('operational')}
                  >
                    Operational ({equipmentCounts.operational})
                  </button>
                  <button 
                    className={`filter-pill ${equipmentFilter === 'overdue' ? 'active' : ''}`}
                    onClick={() => setEquipmentFilter('overdue')}
                  >
                    Service Due ({equipmentCounts.overdue})
                  </button>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            {loadingData ? (
              activeTab === 'equipment' && equipmentViewMode === 'masonry' ? (
                <GallerySkeleton cards={6} />
              ) : (
                <TableSkeleton rows={5} columns={6} />
              )
            ) : activeTab === 'members' ? (
              !adminUser ? (
                <div className="content-card" style={{ textAlign: 'center', padding: '60px 24px', margin: '20px auto', maxWidth: '540px' }}>
                  <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '16px' }}>
                    <ShieldIcon size={36} color="#ff6b72" />
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>Admin Access Required</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                    The Member Subscriptions database and client payment records are restricted to authorized Gym Administrators.
                  </p>
                  <button 
                    onClick={() => setShowLoginModal(true)} 
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontWeight: 700 }}
                  >
                    <KeyIcon size={16} />
                    <span>Login as Super Admin</span>
                  </button>
                </div>
              ) : (
                <div className="content-card">
                  {filteredMembers.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <UserIcon size={32} color="var(--accent-red)" />
                      </div>
                      <h3>No members found</h3>
                      <p>Try refining your search query or click "Seed Demo Data".</p>
                    </div>
                  ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Member Details</th>
                          <th>Plan Tier</th>
                          <th>Last Paid</th>
                          <th>Expires On</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMembers.map(m => (
                          <tr key={m._id}>
                            <td>
                              <div style={{ fontWeight: '600', color: '#ffffff' }}>{m.name}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.email} {m.phone && `• ${m.phone}`}</div>
                            </td>
                            <td>
                              <span className="badge badge-info">{m.planType || 'Monthly'} ({m.durationMonths || 1}m)</span>
                            </td>
                            <td>{m.lastPaymentDate ? new Date(m.lastPaymentDate).toLocaleDateString() : 'N/A'}</td>
                            <td>
                              <div>{m.expirationDate ? new Date(m.expirationDate).toLocaleDateString() : 'N/A'}</div>
                              <div style={{ fontSize: '11px', color: m.isExpired ? '#f87171' : 'var(--text-muted)' }}>
                                {m.isExpired ? `Expired ${Math.abs(m.daysRemaining || 0)} days ago` : `${m.daysRemaining || 0} days remaining`}
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${m.isExpired ? 'badge-danger' : 'badge-success'}`}>
                                <span className="badge-dot" />
                                {m.isExpired ? 'Payment Overdue' : 'Active Paid'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <button 
                                  className="btn btn-action-renew btn-sm"
                                  onClick={() => handleRenewMember(m._id, m.durationMonths || 1)}
                                  title="Renew Membership"
                                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <ZapIcon size={13} />
                                  <span>Renew</span>
                                </button>
                                <button className="btn btn-secondary btn-sm" onClick={() => openEditMember(m)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <EditIcon size={13} />
                                  <span>Edit</span>
                                </button>
                                <CircleDeleteBtn size={28} iconSize={13} onClick={() => handleDeleteMember(m._id, m.name)} title="Delete Member" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
            ) : (
              /* Equipment Tab: Render Masonry Gallery or Data Table */
              equipmentViewMode === 'masonry' ? (
                <EquipmentGallery 
                  items={filteredEquipment} 
                  onEdit={openEditEquipment} 
                  onServiceDone={handleLogService}
                  onDelete={handleDeleteEquipment}
                  adminUser={adminUser}
                />
              ) : (
                <div className="content-card">
                  {filteredEquipment.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <DumbbellIcon size={32} color="var(--accent-red)" />
                      </div>
                      <h3>No equipment records matching filter</h3>
                      <p>Add new equipment machines to track servicing.</p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Equipment Name</th>
                            <th>Category & Location</th>
                            <th>Last Serviced</th>
                            <th>Next Due</th>
                            <th>Status</th>
                            {adminUser && <th style={{ textAlign: 'right' }}>Actions</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEquipment.map(eq => (
                            <tr key={eq._id}>
                              <td>
                                <div style={{ fontWeight: '600', color: '#ffffff' }}>{eq.name}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>S/N: {eq.serialNumber || 'N/A'}</div>
                              </td>
                              <td>
                                <div>{eq.location}</div>
                                <span className="badge badge-info" style={{ fontSize: '11px', marginTop: '2px' }}>{eq.category}</span>
                              </td>
                              <td>{eq.lastServiced ? new Date(eq.lastServiced).toLocaleDateString() : 'N/A'}</td>
                              <td>
                                <div>{eq.nextServiceDate ? new Date(eq.nextServiceDate).toLocaleDateString() : 'N/A'}</div>
                                <div style={{ fontSize: '11px', color: eq.needsService ? '#fbbf24' : 'var(--text-muted)' }}>
                                  Every {eq.serviceIntervalDays} days
                                </div>
                              </td>
                              <td>
                                <span className={`badge ${eq.needsService ? 'badge-warning' : 'badge-success'}`}>
                                  <span className="badge-dot" />
                                  {eq.needsService ? 'Service Overdue' : 'Operational'}
                                </span>
                              </td>
                              {adminUser && (
                                <td style={{ textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <button 
                                      className="btn btn-action-service btn-sm"
                                      onClick={() => handleLogService(eq._id, eq.name)}
                                      title="Log Maintenance Completed"
                                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                      <ZapIcon size={13} />
                                      <span>Service Done</span>
                                    </button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => openEditEquipment(eq)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <EditIcon size={13} />
                                      <span>Edit</span>
                                    </button>
                                    <CircleDeleteBtn size={28} iconSize={13} onClick={() => handleDeleteEquipment(eq._id, eq.name)} title="Delete Equipment" />
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            )}
          </section>
        )}
      </main>

      {/* Member Modal */}
      {showMemberModal && (
        <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingMember ? 'Edit Member Subscription' : 'Add New Gym Member'}</h3>
              <button className="close-btn" onClick={() => setShowMemberModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveMember}>
              <div className="form-group">
                <label>Member Full Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  required
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  placeholder="e.g. sarah@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                  placeholder="+1 (555) 019-2831"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Plan Type</label>
                  <select 
                    className="form-control"
                    value={memberForm.planType}
                    onChange={(e) => {
                      const type = e.target.value;
                      let duration = 1;
                      if (type === 'Quarterly') duration = 3;
                      if (type === 'Annual') duration = 12;
                      setMemberForm({ ...memberForm, planType: type, durationMonths: duration });
                    }}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly (3 Mos)</option>
                    <option value="Annual">Annual (12 Mos)</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration (Months)</label>
                  <input 
                    type="number" 
                    min="1"
                    className="form-control" 
                    value={memberForm.durationMonths}
                    onChange={(e) => setMemberForm({ ...memberForm, durationMonths: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Payment Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={memberForm.lastPaymentDate}
                  onChange={(e) => setMemberForm({ ...memberForm, lastPaymentDate: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowMemberModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMember ? 'Update Member' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Equipment Modal */}
      {showEquipmentModal && (
        <div className="modal-overlay" onClick={() => setShowEquipmentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingEquipment ? 'Edit Machine Details' : 'Log New Equipment'}</h3>
              <button className="close-btn" onClick={() => setShowEquipmentModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveEquipment}>
              <div className="form-group">
                <label>Equipment Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  value={equipmentForm.name}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                  placeholder="e.g. Technogym Treadmill X7"
                />
              </div>
              <div className="form-group">
                <label>Equipment Image (Cloudinary Upload)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label 
                      className={`btn ${uploadingImage ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ cursor: uploadingImage ? 'not-allowed' : 'pointer', width: '100%', justifyContent: 'center', fontSize: '13px', padding: '10px 16px', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      {uploadingImage ? (
                        <>⏳ Uploading to Cloudinary...</>
                      ) : (
                        <>☁️ Choose & Upload Image</>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleCloudinaryUpload} 
                        disabled={uploadingImage}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  {equipmentForm.imageUrl ? (
                    <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <img 
                        src={equipmentForm.imageUrl} 
                        alt="Uploaded Preview" 
                        style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-subtle)' }} 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#4ade80' }}>✓ Image Ready</div>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '11px', color: 'var(--text-muted)' }}>
                          {equipmentForm.imageUrl}
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setEquipmentForm(prev => ({ ...prev, imageUrl: '' }))}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', padding: '4px' }}
                        title="Remove Image"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic', marginTop: '2px' }}>
                      Select a photo file to upload directly to Cloudinary.
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Serial Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={equipmentForm.serialNumber}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, serialNumber: e.target.value })}
                    placeholder="e.g. SN-994812"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    className="form-control"
                    value={equipmentForm.category}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, category: e.target.value })}
                  >
                    <option value="Cardio">Cardio</option>
                    <option value="Strength">Strength</option>
                    <option value="Free Weights">Free Weights</option>
                    <option value="Functional">Functional</option>
                    <option value="Recovery">Recovery</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Location in Gym</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={equipmentForm.location}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, location: e.target.value })}
                    placeholder="e.g. Cardio Zone 2nd Floor"
                  />
                </div>
                <div className="form-group">
                  <label>Operational Status</label>
                  <select 
                    className="form-control"
                    value={equipmentForm.status}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, status: e.target.value })}
                  >
                    <option value="Operational">Operational</option>
                    <option value="Maintenance Needed">Service Due (Maintenance Needed)</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Last Serviced</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={equipmentForm.lastServiced}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, lastServiced: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Interval (Days)</label>
                  <input 
                    type="number" 
                    min="1"
                    className="form-control" 
                    value={equipmentForm.serviceIntervalDays}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, serviceIntervalDays: parseInt(e.target.value) || 90 })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEquipmentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEquipment ? 'Update Machine' : 'Save Machine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLoginSuccess={handleLoginSuccess} 
        API_BASE={API_BASE}
      />

      {/* Admin Settings Profile Modal */}
      <AdminProfileModal 
        isOpen={showAdminProfileModal} 
        onClose={() => setShowAdminProfileModal(false)} 
        adminUser={adminUser} 
        adminToken={adminToken} 
        onProfileUpdated={handleProfileUpdated} 
        API_BASE={API_BASE}
      />

      {/* Global Application Footer */}
      <Footer activeTab={activeTab} setActiveTab={handleTabChange} />
    </div>
  );
}