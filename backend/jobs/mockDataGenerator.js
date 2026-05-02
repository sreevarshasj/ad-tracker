// FILE: backend/jobs/mockDataGenerator.js
// Generates realistic mock data for development/demo when APIs are not configured
import { detectInstitutionCategory } from '../utils/classifier.js';

const INSTITUTIONS = [
  { name: 'Sri Ramakrishna College of Arts & Science', state: 'Tamil Nadu', city: 'Coimbatore' },
  { name: 'PSG College of Technology', state: 'Tamil Nadu', city: 'Coimbatore' },
  { name: 'Kumaraguru College of Technology', state: 'Tamil Nadu', city: 'Coimbatore' },
  { name: 'Amrita Vishwa Vidyapeetham', state: 'Tamil Nadu', city: 'Coimbatore' },
  { name: 'SASTRA Deemed University', state: 'Tamil Nadu', city: 'Thanjavur' },
  { name: 'VIT University', state: 'Tamil Nadu', city: 'Vellore' },
  { name: 'SRM Institute of Science and Technology', state: 'Tamil Nadu', city: 'Chennai' },
  { name: 'Loyola College', state: 'Tamil Nadu', city: 'Chennai' },
  { name: 'Madras Christian College', state: 'Tamil Nadu', city: 'Chennai' },
  { name: 'St. Joseph School CBSE', state: 'Tamil Nadu', city: 'Madurai' },
  { name: 'DAV Matriculation School', state: 'Tamil Nadu', city: 'Chennai' },
  { name: 'Kendriya Vidyalaya No. 1', state: 'Tamil Nadu', city: 'Coimbatore' },
  { name: 'Delhi Public School', state: 'Karnataka', city: 'Bangalore' },
  { name: 'Manipal Academy of Higher Education', state: 'Karnataka', city: 'Manipal' },
  { name: 'Christ University', state: 'Karnataka', city: 'Bangalore' },
  { name: 'Jain University', state: 'Karnataka', city: 'Bangalore' },
  { name: 'BITS Pilani', state: 'Rajasthan', city: 'Pilani' },
  { name: 'IIT Madras', state: 'Tamil Nadu', city: 'Chennai' },
  { name: 'NIT Trichy', state: 'Tamil Nadu', city: 'Tiruchirappalli' },
  { name: 'Anna University', state: 'Tamil Nadu', city: 'Chennai' },
  { name: 'Ethiraj College for Women', state: 'Tamil Nadu', city: 'Chennai' },
  { name: 'Stella Maris College', state: 'Tamil Nadu', city: 'Chennai' },
  { name: 'Government College of Technology', state: 'Tamil Nadu', city: 'Coimbatore' },
  { name: 'Madurai Kamaraj University', state: 'Tamil Nadu', city: 'Madurai' },
  { name: 'Thiagarajar College of Engineering', state: 'Tamil Nadu', city: 'Madurai' },
  { name: 'Bishop Heber College', state: 'Tamil Nadu', city: 'Tiruchirappalli' },
  { name: 'St. Xavier\'s College', state: 'Tamil Nadu', city: 'Palayamkottai' },
  { name: 'Scott Christian College', state: 'Tamil Nadu', city: 'Nagercoil' },
  { name: 'Kongu Engineering College', state: 'Tamil Nadu', city: 'Erode' },
  { name: 'Mepco Schlenk Engineering College', state: 'Tamil Nadu', city: 'Sivakasi' },
];

const MOCK_AD_COPIES = [
  "Admissions Open 2024! Join the leader in technical education. Apply now for Engineering and MBA programs.",
  "Unlock your potential at Tamil Nadu's top-ranked college. 100% placement record for last 5 years.",
  "Shape your future with world-class infrastructure and expert faculty. Visit our campus today!",
  "Enroll in our Arts & Science programs. Scholarships available for merit students. Last date to apply: 31st May.",
  "Excellence in education since 1985. We build leaders for tomorrow. New batch starting soon.",
  "Experience a diverse campus life and global exposure. Join our prestigious institution today.",
];

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=800&q=80",
  "https://images.unsplash.com/photo-1523050853023-8c2d27443efb?w=800&q=80",
  "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const generateMockData = (platform, count = 10) => {
  return Array.from({ length: count }, (_, i) => {
    const institution = randomFrom(INSTITUTIONS);
    const daysAgo = randomInt(5, 90);
    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const isActive = Math.random() > 0.3;
    const spend = randomFloat(500, 15000);
    const impressions = randomInt(10000, 500000);
    const clicks = randomInt(100, 10000);
    const ctr = parseFloat(((clicks / impressions) * 100).toFixed(2));

    return {
      externalId: `${platform}_MOCK_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
      platform,
      institutionName: institution.name,
      category: detectInstitutionCategory(institution.name),
      status: isActive ? 'ACTIVE' : 'ENDED',
      startDate,
      endDate: isActive ? null : new Date(Date.now() - randomInt(1, 10) * 24 * 60 * 60 * 1000),
      estimatedSpend: spend,
      country: 'India',
      state: institution.state,
      city: institution.city,
      tags: "",
      performance: {
        impressions,
        clicks,
        spend,
        ctr,
        date: new Date(),
      },
      creatives: Array.from({ length: randomInt(1, 2) }, () => ({
        mediaUrl: randomFrom(MOCK_IMAGES),
        adCopy: randomFrom(MOCK_AD_COPIES),
        cta: randomFrom(['Learn More', 'Apply Now', 'Visit Site', 'Contact Us']),
        format: Math.random() > 0.2 ? 'IMAGE' : 'VIDEO',
        platform,
      })),
    };
  });
};
