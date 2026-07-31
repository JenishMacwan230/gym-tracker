import React, { useState, useEffect } from 'react';
import axios from 'axios';

import AboutHero from './about/AboutHero';
import AboutContactLocation from './about/AboutContactLocation';
import AboutPhotoGallery from './about/AboutPhotoGallery';
import AboutFounder from './about/AboutFounder';

import EditHeroModal from './about/EditHeroModal';
import EditLocationModal from './about/EditLocationModal';
import EditFounderModal from './about/EditFounderModal';
import EditPhotoModal from './about/EditPhotoModal';
import { ShieldIcon } from './Icons';
import { AboutUsSkeleton } from './SkeletonLoader';

const API_BASE = 'http://localhost:5000/api';

const defaultAboutData = {
  hero: {
    badge: '🏆 EST. 2018 • METRO CITY',
    title: 'About Titan Fitness & Gym',
    subtitle: 'Built for champions, dedicated to progress. Discover our world-class facility, meet our visionary founder, and experience fitness redefined.'
  },
  contactSection: {
    heading: 'Contact Owner & Schedule a Tour',
    subheading: 'Have questions about membership, personal coaching, or facility visits? Send a message directly to Marcus Sterling.'
  },
  location: {
    gymName: 'Titan Fitness Headquarters',
    streetAddress: '742 Apex Heights Boulevard, West Wing Building',
    suiteCity: 'Suite 100 • Metro City, NY 10001',
    landmark: 'Opposite Metro Central Station (Free Member Parking in Rear)',
    phoneFrontDesk: '+1 (555) 019-2831',
    phoneWhatsapp: '+1 (555) 019-2839',
    email: 'info@titanfitness.com',
    googleMapsUrl: 'https://maps.google.com',
    hours: {
      weekday: '5:00 AM – 11:00 PM',
      saturday: '6:00 AM – 10:00 PM',
      sunday: '7:00 AM – 8:00 PM',
      vipNote: '24/7 Access Enabled'
    }
  },
  founder: {
    name: 'Marcus Sterling',
    role: 'FOUNDER & HEAD PERFORMANCE COACH',
    bio: '"I founded Titan Fitness with a singular mission: to eliminate generic workout culture and build an elite environment where individuals of all athletic levels feel inspired to push beyond their limits. Fitness transformed my life, and creating this sanctuary is my contribution to our community."',
    experienceYears: '15+',
    imageUrl: '/about/owner.png',
    email: 'marcus@titanfitness.com',
    phone: '+1 (555) 892-4410',
    credentials: [
      'CSCS® - Certified Strength & Conditioning Specialist',
      'NASM® Master Personal Trainer & Bio-mechanics Specialist',
      'Precision Nutrition® Level 2 Certified Coach',
      'Former IFBB Pro & Collegiate Track Athlete'
    ]
  },
  photos: [
    {
      id: '1',
      title: 'Heavy Strength & Weight Floor',
      category: 'weights',
      src: '/about/gym_main.png',
      desc: 'Equipped with custom Rogue power racks, competition benches, dumbbell racks up to 150 lbs, and rubberized impact flooring.'
    },
    {
      id: '2',
      title: 'High-Performance Cardio Deck',
      category: 'cardio',
      src: '/about/gym_cardio.png',
      desc: 'Top-of-the-line Technogym treadmills, Woodway curved runners, stairmasters, and assault bikes with built-in workout analytics.'
    },
    {
      id: '3',
      title: 'Functional Turf & CrossFit Arena',
      category: 'turf',
      src: '/about/gym_functional.png',
      desc: '30-meter sprint turf, battle ropes, plyo boxes, sled push tracks, and kettlebell arrays for high-intensity hybrid conditioning.'
    },
    {
      id: '4',
      title: 'Personal Training & Mobility Studio',
      category: 'weights',
      src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop',
      desc: 'Private 1-on-1 coaching zone equipped with cable towers, mobility stations, and bio-mechanical posture assessment gear.'
    },
    {
      id: '5',
      title: 'Recovery Lounge & Infrared Sauna',
      category: 'amenities',
      src: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop',
      desc: 'Full recovery suite featuring cedarwood infrared saunas, cold plunge tubs, and Normatec compression sleeve lounge.'
    },
    {
      id: '6',
      title: 'Executive Locker Rooms & Showers',
      category: 'amenities',
      src: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1200&auto=format&fit=crop',
      desc: 'Luxury marble keycard lockers, rain showers, complimentary towel service, premium grooming essentials, and blow dryers.'
    }
  ]
};

export default function AboutUs({ adminUser, adminToken, showNotification }) {
  const [content, setContent] = useState(defaultAboutData);
  const [loading, setLoading] = useState(true);

  // Pop-up Modals State
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showFounderModal, setShowFounderModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [activePhotoToEdit, setActivePhotoToEdit] = useState(null);

  // Fetch About Page Content from DB
  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/about`);
      if (res.data && res.data.hero) {
        setContent(res.data);
      }
    } catch (err) {
      console.warn('Using default about content fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutContent();
  }, []);

  // Generic Save to DB Helper
  const saveContentToDb = async (updatedContent, successMsg) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'x-admin-token': adminToken
        }
      };
      const res = await axios.put(`${API_BASE}/about`, updatedContent, config);
      if (res.data) {
        setContent(res.data);
        if (showNotification) showNotification(successMsg || '✅ Changes saved to Database!');
      }
    } catch (err) {
      console.error('Failed to save content:', err);
      alert('Failed to save changes: ' + (err.response?.data?.error || err.message));
    }
  };

  // Section Save Handlers
  const handleSaveHero = (heroFormData) => {
    const updated = {
      ...content,
      hero: { ...content.hero, ...heroFormData }
    };
    saveContentToDb(updated, '✅ Hero section updated!');
    setShowHeroModal(false);
  };

  const handleSaveLocation = (locationFormData) => {
    const updated = {
      ...content,
      location: { ...content.location, ...locationFormData }
    };
    saveContentToDb(updated, '✅ Location & Operating Hours updated!');
    setShowLocationModal(false);
  };

  const handleSaveFounder = (founderFormData) => {
    const updated = {
      ...content,
      founder: { ...content.founder, ...founderFormData }
    };
    saveContentToDb(updated, '✅ Founder profile updated!');
    setShowFounderModal(false);
  };

  const handleSavePhoto = (photoFormData) => {
    const existingPhotos = content.photos || [];
    let updatedPhotos;

    if (activePhotoToEdit) {
      // Edit Existing
      updatedPhotos = existingPhotos.map(p => 
        p.id === photoFormData.id ? photoFormData : p
      );
    } else {
      // Add New
      updatedPhotos = [...existingPhotos, photoFormData];
    }

    const updated = {
      ...content,
      photos: updatedPhotos
    };

    saveContentToDb(updated, activePhotoToEdit ? '✅ Photo details updated!' : '📸 New photo added to gallery!');
    setShowPhotoModal(false);
    setActivePhotoToEdit(null);
  };

  const handleDeletePhoto = (photoId) => {
    if (window.confirm('Are you sure you want to delete this photo from the gallery?')) {
      const updatedPhotos = (content.photos || []).filter(p => p.id !== photoId);
      const updated = {
        ...content,
        photos: updatedPhotos
      };
      saveContentToDb(updated, '🗑️ Photo removed from gallery');
    }
  };

  if (loading) {
    return <AboutUsSkeleton />;
  }

  return (
    <div className="about-us-container">

      {/* 1. Hero Section */}
      <AboutHero 
        heroData={content.hero}
        adminUser={adminUser}
        onEdit={() => setShowHeroModal(true)}
      />

      {/* 2. Top Contact & Location Section */}
      <AboutContactLocation 
        locationData={content.location}
        contactData={content.contactSection}
        adminUser={adminUser}
        onEditLocation={() => setShowLocationModal(true)}
      />

      {/* 3. Facility Photo Gallery Section */}
      <AboutPhotoGallery 
        photos={content.photos || []}
        adminUser={adminUser}
        onAddPhoto={() => {
          setActivePhotoToEdit(null);
          setShowPhotoModal(true);
        }}
        onEditPhoto={(photo) => {
          setActivePhotoToEdit(photo);
          setShowPhotoModal(true);
        }}
        onDeletePhoto={handleDeletePhoto}
      />

      {/* 4. Founder Profile Section (Positioned at the very end/bottom) */}
      <AboutFounder 
        founderData={content.founder}
        adminUser={adminUser}
        onEditFounder={() => setShowFounderModal(true)}
      />

      {/* Section-Specific Pop-up Modals */}
      <EditHeroModal 
        isOpen={showHeroModal}
        onClose={() => setShowHeroModal(false)}
        heroData={content.hero}
        onSave={handleSaveHero}
      />

      <EditLocationModal 
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        locationData={content.location}
        onSave={handleSaveLocation}
      />

      <EditFounderModal 
        isOpen={showFounderModal}
        onClose={() => setShowFounderModal(false)}
        founderData={content.founder}
        onSave={handleSaveFounder}
      />

      <EditPhotoModal 
        isOpen={showPhotoModal}
        onClose={() => {
          setShowPhotoModal(false);
          setActivePhotoToEdit(null);
        }}
        photoToEdit={activePhotoToEdit}
        onSave={handleSavePhoto}
      />
    </div>
  );
}
