import { CampusNode } from '../types';

export const CAMPUS_NODES: CampusNode[] = [
  {
    id: 'stu_union',
    name: 'Student Union & Dining Plaza',
    zone: 'Central Hub',
    x: 48,
    y: 46,
    iconName: 'Coffee',
    description: 'Central cafeteria, bookstore, coffee bar, and lounge.'
  },
  {
    id: 'lib_central',
    name: 'Main Campus Library',
    zone: 'Central Hub',
    x: 52,
    y: 35,
    iconName: 'BookOpen',
    description: 'Quiet study floors, 24/7 printing lab, and research archives.'
  },
  {
    id: 'sci_eng_quad',
    name: 'Turing Engineering & CS Quad',
    zone: 'Science & Tech Quad',
    x: 75,
    y: 30,
    iconName: 'Cpu',
    description: 'Maker space, 3D printing lab, robotics arena, and lecture halls.'
  },
  {
    id: 'biotech_lab',
    name: 'Franklin Life Sciences Complex',
    zone: 'Science & Tech Quad',
    x: 82,
    y: 48,
    iconName: 'FlaskConical',
    description: 'Biochemistry labs, greenhouses, and clinical test rooms.'
  },
  {
    id: 'north_dorm_a',
    name: 'Pinnacle Residential Towers',
    zone: 'North Campus',
    x: 45,
    y: 15,
    iconName: 'Home',
    description: 'Freshman and sophomore high-rise dormitories with package lockers.'
  },
  {
    id: 'north_quad',
    name: 'North Quad Commons & Cafe',
    zone: 'North Campus',
    x: 62,
    y: 18,
    iconName: 'Utensils',
    description: 'Study pavilion, specialty coffee roasters, and lawn.'
  },
  {
    id: 'south_dorm_b',
    name: 'Heritage Quad Dorms',
    zone: 'South Residential',
    x: 35,
    y: 75,
    iconName: 'Building',
    description: 'Upperclassmen suites and courtyard apartments.'
  },
  {
    id: 'camp_market',
    name: 'South Mail Center & Campus Market',
    zone: 'South Residential',
    x: 55,
    y: 82,
    iconName: 'Package',
    description: 'Central parcel pickup depot, late-night convenience store.'
  },
  {
    id: 'rec_center',
    name: 'Aquatic & Fitness Pavilion',
    zone: 'West Athletics',
    x: 18,
    y: 42,
    iconName: 'Dumbbell',
    description: 'Gymnasium, Olympic pool, indoor track, and locker rooms.'
  },
  {
    id: 'arts_center',
    name: 'Fine Arts & Media Studios',
    zone: 'Central Hub',
    x: 32,
    y: 50,
    iconName: 'Palette',
    description: 'Sound studios, film editing suites, and sculpture terrace.'
  }
];

// Realistic walking distances (in meters) and walking times (in minutes at 80m/min)
// Derived from 2D coordinates on the campus grid (scale: 1 unit ~ 20 meters)
export function getDistanceMeters(locAId: string, locBId: string): number {
  if (locAId === locBId) return 0;
  const a = CAMPUS_NODES.find(n => n.id === locAId);
  const b = CAMPUS_NODES.find(n => n.id === locBId);
  if (!a || !b) return 400; // default average campus walk

  const dx = (a.x - b.x) * 18; // calibrated meters
  const dy = (a.y - b.y) * 18;
  const euclidean = Math.round(Math.sqrt(dx * dx + dy * dy));
  // Manhattan path factor on university pathways is ~1.22
  return Math.max(120, Math.round(euclidean * 1.22));
}

export function getTransitTimeMinutes(
  locAId: string,
  locBId: string,
  mode: 'walking' | 'bicycle' | 'scooter' = 'walking'
): number {
  if (locAId === locBId) return 1;
  const meters = getDistanceMeters(locAId, locBId);

  let speedMetersPerMinute = 80; // ~4.8 km/h walking
  if (mode === 'bicycle') speedMetersPerMinute = 220; // ~13.2 km/h
  if (mode === 'scooter') speedMetersPerMinute = 260; // ~15.6 km/h

  const minutes = Math.ceil(meters / speedMetersPerMinute) + 1; // +1 min building entry/transit buffer
  return Math.max(2, minutes);
}

export function getLocationById(id: string): CampusNode {
  return CAMPUS_NODES.find(n => n.id === id) || CAMPUS_NODES[0];
}
