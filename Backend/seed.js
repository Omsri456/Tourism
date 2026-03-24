const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const Destination = require('./models/Destination');
const Transport = require('./models/Transport');
const Accommodation = require('./models/Accommodation');
const CulturalExperience = require('./models/CulturalExperience');
const GuideProfile = require('./models/GuideProfile');
const User = require('./models/User');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const destinations = [
  {
    name: 'Hundru Falls',
    category: 'Waterfalls',
    description: 'One of the most famous waterfalls in Jharkhand, offering a spectacular view as the Subarnarekha River falls from a height of 320 feet.',
    images: ['/uploads/hundru_falls.png'],
    bestTimeToVisit: 'July to November',
    entryFee: '₹10 per person',
    locationCoords: { lat: 23.4475, lng: 85.6425 }
  },
  {
    name: 'Betla National Park',
    category: 'Wildlife and national parks',
    description: 'A beautiful national park situated in the Chota Nagpur Plateau of the Latehar district of Jharkhand, India, featuring diverse flora and fauna, including elephants, tigers, and leopards.',
    images: ['/uploads/betla.png'],
    bestTimeToVisit: 'October to April',
    entryFee: '₹50 per person (Indians), ₹200 (Foreigners)',
    locationCoords: { lat: 23.8821, lng: 84.1951 }
  },
  {
    name: 'Netarhat',
    category: 'Nature tourism',
    description: 'Known as the "Queen of Chotanagpur," Netarhat is a picturesque hill station famous for its breathtaking sunrises and sunsets.',
    images: ['/uploads/netarhat.png'],
    bestTimeToVisit: 'Throughout the year',
    entryFee: 'Free',
    locationCoords: { lat: 23.4729, lng: 84.2691 }
  },
  {
    name: 'Baidyanath Jyotirlinga Temple',
    category: 'Tribal culture and heritage',
    description: 'Also known as Baba Baidyanath Dham, it is one of the twelve Jyotirlingas, the most sacred abodes of Shiva.',
    images: ['/uploads/baidyanath.png'],
    bestTimeToVisit: 'Shravan month (July-August) and Mahashivratri',
    entryFee: 'Free (VIP Darshan ₹250)',
    locationCoords: { lat: 24.4922, lng: 86.6997 }
  },
  {
    name: 'Dalma Wildlife Sanctuary',
    category: 'Adventure tourism',
    description: 'Famous for Indian Elephants, Dalma Wildlife Sanctuary offers excellent trekking opportunities and a chance to immerse in dense forests.',
    images: ['/uploads/dalma.png'],
    bestTimeToVisit: 'October to March',
    entryFee: '₹5 per head, ₹150 for cars',
    locationCoords: { lat: 22.9099, lng: 86.2201 }
  }
];

const transports = [
  {
    origin: 'Ranchi',
    destination: 'Hundru Falls',
    modeOfTransport: 'Taxi/Cab',
    estimatedTime: '1 hour 15 mins',
    approximateCost: 1200,
    suggestedRoute: 'Direct taxi available from Ranchi railway station or airport. Route usually takes NH20 and then local roads.'
  },
  {
    origin: 'Ranchi',
    destination: 'Betla National Park',
    modeOfTransport: 'Bus',
    estimatedTime: '4 hours',
    approximateCost: 700,
    suggestedRoute: 'Volvo buses ply from Ranchi to Daltonganj. From Daltonganj, taxis or auto-rickshaws are available to Betla.'
  },
  {
    origin: 'Jamshedpur',
    destination: 'Dalma Wildlife Sanctuary',
    modeOfTransport: 'Auto-rickshaw',
    estimatedTime: '45 mins',
    approximateCost: 450,
    suggestedRoute: 'Easily accessible from Jamshedpur city center via Makdampur road.'
  }
];

const accommodations = [
  {
    name: 'Eco Lodge Betla',
    type: 'Eco-lodge',
    location: 'Betla, Latehar',
    pricePerNight: 2500,
    rating: 4.5,
    reviewsCount: 120,
    facilities: ['Guided Tours', 'Local Food', 'Campfire', 'Parking'],
    images: ['/uploads/eco_lodge.png']
  },
  {
    name: 'Santhal Village Homestay',
    type: 'Tribal Homestay',
    location: 'Dumka',
    pricePerNight: 1200,
    rating: 4.8,
    reviewsCount: 85,
    facilities: ['Authentic Meals', 'Cultural Performance', 'Handicraft Tour'],
    images: ['/uploads/santhal_homestay.png']
  },
  {
    name: 'Ranchi Premium Hotel',
    type: 'Hotel',
    location: 'Ranchi Center',
    pricePerNight: 4000,
    rating: 4.2,
    reviewsCount: 300,
    facilities: ['AC', 'WiFi', 'Pool', 'Restaurant'],
    images: ['/uploads/premium_hotel.png']
  }
];

const experiences = [
  {
    title: 'Chhau Dance Performance',
    description: 'Witness the vibrant and energetic Chhau dance, a semi-classical Indian dance with martial, tribal, and folk origins.',
    category: 'Tribal dance',
    location: 'Saraikela Kharsawan',
    duration: '2 Hours',
    price: 500,
    organizerInfo: {
        name: 'Saraikela Cultural Troupe',
        contact: '9876543210'
    },
    images: ['/uploads/chhau.png']
  },
  {
    title: 'Sohrai Art Workshop',
    description: 'Learn the ancient mural art of Sohrai, practiced by tribal women of Hazaribagh, and create your own canvas.',
    category: 'Craft workshop',
    location: 'Hazaribagh Village',
    duration: 'Half Day',
    price: 800,
    organizerInfo: {
        name: 'Hazaribagh Art Cooperative',
        contact: '9876543211'
    },
    images: ['/uploads/sohrai.png']
  },
  {
    title: 'Tribal Food Tasting Tour',
    description: 'Savor traditional dishes like Dhuska, Chilka Roti, and Arsa along with local rice beer (Handia).',
    category: 'Local food tour',
    location: 'Ranchi Outer Circle',
    duration: '3 Hours',
    price: 600,
    organizerInfo: {
        name: 'Ranchi Local Guides',
        contact: '9876543212'
    },
    images: ['/uploads/food.png']
  }
];

const importData = async () => {
  try {
    await Destination.deleteMany();
    await Transport.deleteMany();
    await Accommodation.deleteMany();
    await CulturalExperience.deleteMany();
    await GuideProfile.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed...');

    // Add generic admin user and guide user to associate later if needed
    const createdDestinations = await Destination.insertMany(destinations);
    const createdTransports = await Transport.insertMany(transports);
    
    // For accommodations, randomly assign a destination
    const updatedAccommodations = accommodations.map(acc => {
       return { ...acc, nearbyDestinations: [createdDestinations[Math.floor(Math.random() * createdDestinations.length)]._id] }
    });
    await Accommodation.insertMany(updatedAccommodations);
    
    await CulturalExperience.insertMany(experiences);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
