export const destinations = [
  {
    id: 'd1',
    name: 'Hundru Falls',
    category: 'Waterfalls',
    description: 'One of the most famous waterfalls in Jharkhand, offering a spectacular view as the Subarnarekha River falls from a height of 320 feet.',
    image: 'https://images.unsplash.com/photo-1543085698-500e2bcaa8e3?auto=format&fit=crop&q=80',
    bestTime: 'July to November',
    entryFee: '₹10 per person',
    location: 'Ranchi, Jharkhand',
    coordinates: { lat: 23.4475, lng: 85.6425 },
    nearby: ['Jonha Falls', 'Sita Falls']
  },
  {
    id: 'd2',
    name: 'Betla National Park',
    category: 'Wildlife',
    description: 'A beautiful national park situated in the Chota Nagpur Plateau of the Latehar district of Jharkhand, India, featuring diverse flora and fauna, including elephants, tigers, and leopards.',
    image: 'https://images.unsplash.com/photo-1582559936853-a7905d4fa355?auto=format&fit=crop&q=80',
    bestTime: 'October to April',
    entryFee: '₹50 per person (Indians), ₹200 (Foreigners)',
    location: 'Latehar, Jharkhand',
    coordinates: { lat: 23.8821, lng: 84.1951 },
    nearby: ['Lodha Falls', 'Palamau Tiger Reserve']
  },
  {
    id: 'd3',
    name: 'Netarhat',
    category: 'Nature',
    description: 'Known as the "Queen of Chotanagpur," Netarhat is a picturesque hill station famous for its breathtaking sunrises and sunsets.',
    image: 'https://images.unsplash.com/photo-1506744626753-1fa44df31c78?auto=format&fit=crop&q=80',
    bestTime: 'Throughout the year',
    entryFee: 'Free',
    location: 'Latehar, Jharkhand',
    coordinates: { lat: 23.4729, lng: 84.2691 },
    nearby: ['Magnolia Point', 'Upper Ghaghri Falls']
  },
  {
    id: 'd4',
    name: 'Baidyanath Jyotirlinga Temple',
    category: 'Cultural Heritage',
    description: 'Also known as Baba Baidyanath Dham, it is one of the twelve Jyotirlingas, the most sacred abodes of Shiva.',
    image: 'https://images.unsplash.com/photo-1588630650906-8809088cc524?auto=format&fit=crop&q=80', // generic temple placeholder
    bestTime: 'Shravan month (July-August) and Mahashivratri',
    entryFee: 'Free (VIP Darshan ₹250)',
    location: 'Deoghar, Jharkhand',
    coordinates: { lat: 24.4922, lng: 86.6997 },
    nearby: ['Basukinath Temple', 'Naulakha Mandir']
  },
  {
    id: 'd5',
    name: 'Dalma Wildlife Sanctuary',
    category: 'Adventure',
    description: 'Famous for Indian Elephants, Dalma Wildlife Sanctuary offers excellent trekking opportunities and a chance to immerse in dense forests.',
    image: 'https://images.unsplash.com/photo-1565153920973-e8ee1c1e089d?auto=format&fit=crop&q=80',
    bestTime: 'October to March',
    entryFee: '₹5 per head, ₹150 for cars',
    location: 'Jamshedpur, Jharkhand',
    coordinates: { lat: 22.9099, lng: 86.2201 },
    nearby: ['Jubilee Park', 'Dimna Lake']
  }
];

export const transportRoutes = [
  {
    id: 't1',
    from: 'Ranchi',
    to: 'Hundru Falls',
    mode: 'Taxi',
    time: '1 hour 15 mins',
    cost: '₹1200 - ₹1500 (one way)',
    details: 'Direct taxi available from Ranchi railway station or airport. Route usually takes NH20 and then local roads.'
  },
  {
    id: 't2',
    from: 'Ranchi',
    to: 'Betla National Park',
    mode: 'Bus + Taxi',
    time: '4 hours',
    cost: '₹400 (Bus) + ₹300 (Taxi)',
    details: 'Volve buses ply from Ranchi to Daltonganj. From Daltonganj, taxis or auto-rickshaws are available to Betla.'
  },
  {
    id: 't3',
    from: 'Jamshedpur',
    to: 'Dalma Wildlife Sanctuary',
    mode: 'Auto-Rickshaw / Cab',
    time: '45 mins',
    cost: '₹300 - ₹600',
    details: 'Easily accessible from Jamshedpur city center via Makdampur road.'
  }
];

export const accommodations = [
  {
    id: 'a1',
    name: 'Eco Lodge Betla',
    type: 'Eco-lodge',
    location: 'Betla, Latehar',
    distanceToAttraction: '0.5 km from Betla National Park Gate',
    price: '₹2500 / night',
    rating: 4.5,
    facilities: ['Guided Tours', 'Local Food', 'Campfire', 'Parking'],
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80'
  },
  {
    id: 'a2',
    name: 'Santhal Village Homestay',
    type: 'Tribal Homestay',
    location: 'Dumka',
    distanceToAttraction: 'Nearby Masanjore Dam',
    price: '₹1200 / night',
    rating: 4.8,
    facilities: ['Authentic Meals', 'Cultural Performance', 'Handicraft Tour'],
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80'
  },
  {
    id: 'a3',
    name: 'Ranchi Premium Hotel',
    type: 'Hotel',
    location: 'Ranchi Center',
    distanceToAttraction: '45km from Hundru Falls',
    price: '₹4000 / night',
    rating: 4.2,
    facilities: ['AC', 'WiFi', 'Pool', 'Restaurant'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'
  }
];

export const experiences = [
  {
    id: 'e1',
    name: 'Chhau Dance Performance',
    description: 'Witness the vibrant and energetic Chhau dance, a semi-classical Indian dance with martial, tribal, and folk origins.',
    duration: '2 Hours',
    price: '₹500',
    organizer: 'Saraikela Cultural Troupe',
    location: 'Saraikela Kharsawan',
    image: 'https://images.unsplash.com/photo-1533038590840-1c7989eb20da?auto=format&fit=crop&q=80'
  },
  {
    id: 'e2',
    name: 'Sohrai Art Workshop',
    description: 'Learn the ancient mural art of Sohrai, practiced by tribal women of Hazaribagh, and create your own canvas.',
    duration: 'Half Day',
    price: '₹800',
    organizer: 'Hazaribagh Art Cooperative',
    location: 'Hazaribagh Village',
    image: 'https://images.unsplash.com/photo-1544604555-52fb9cc7d14e?auto=format&fit=crop&q=80'
  },
  {
    id: 'e3',
    name: 'Tribal Food Tasting Tour',
    description: 'Savor traditional dishes like Dhuska, Chilka Roti, and Arsa along with local rice beer (Handia).',
    duration: '3 Hours',
    price: '₹600',
    organizer: 'Ranchi Local Guides',
    location: 'Ranchi Outer Circle',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80'
  }
];

export const guides = [
  {
    id: 'g1',
    name: 'Ramesh Munda',
    location: 'Ranchi & Surrounds',
    languages: ['Hindi', 'English', 'Mundari'],
    experience: '8 Years',
    expertise: ['Waterfalls', 'Tribal Culture', 'Flora & Fauna'],
    rating: 4.9,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'
  },
  {
    id: 'g2',
    name: 'Sita Soren',
    location: 'Dumka / Santhal Pargana',
    languages: ['Hindi', 'Santhali', 'Bengali'],
    experience: '5 Years',
    expertise: ['Village Tourism', 'Handicrafts', 'Pilgrimage'],
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80'
  },
  {
    id: 'g3',
    name: 'Vikash Singh',
    location: 'Latehar (Betla & Netarhat)',
    languages: ['Hindi', 'English'],
    experience: '12 Years',
    expertise: ['Wildlife Tracking', 'Trekking', 'Photography Tours'],
    rating: 4.8,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80'
  }
];
