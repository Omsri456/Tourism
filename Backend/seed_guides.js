const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const GuideProfile = require('./models/GuideProfile');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI);

const guidesData = [
  {
    name: 'Ramesh Oraon',
    location: 'Ranchi & Surrounding areas',
    languages: ['Hindi', 'English', 'Kurukh'],
    experience: '8', // Maps to yearsOfExperience
    expertise: ['Tribal Villages', 'Waterfalls', 'Local Cuisine'], // Maps to areasOfExpertise
    rating: 4.8,
    reviews: 124, // Maps to reviewsCount
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    verificationStatus: 'Verified'
  },
  {
    name: 'Priya Munda',
    location: 'Khunti & Saraikela',
    languages: ['Hindi', 'English', 'Mundari'],
    experience: '5',
    expertise: ['Art & Craft', 'Chhau Dance History', 'Homestays'],
    rating: 4.9,
    reviews: 86,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    verificationStatus: 'Verified'
  },
  {
    name: 'Sushil Hembrom',
    location: 'Dumka & Santhal Pargana',
    languages: ['Hindi', 'Santhali', 'Bengali'],
    experience: '12',
    expertise: ['Nature Trails', 'Maluti Temples', 'Photography'],
    rating: 4.7,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1542362567-baf03f8a0044?auto=format&fit=crop&q=80',
    verificationStatus: 'Verified'
  }
];

const seedGuides = async () => {
    try {
        await GuideProfile.deleteMany();
        
        let dummyUser = await User.findOne({ email: 'seeduser@example.com' });
        if (!dummyUser) {
            dummyUser = await User.create({
                name: 'Seed User',
                email: 'seeduser@example.com',
                password: 'password123',
                role: 'Guide'
            });
        }

        const guideProfilesToInsert = guidesData.map(guide => ({
            user: dummyUser._id,
            location: guide.location,
            languagesSpoken: guide.languages,
            yearsOfExperience: parseInt(guide.experience),
            areasOfExpertise: guide.expertise,
            rating: guide.rating,
            reviewsCount: guide.reviews,
            isVerified: guide.verificationStatus === 'Verified'
        }));

        await GuideProfile.insertMany(guideProfilesToInsert);
        console.log("Guides seeded successfully");
        process.exit();
    } catch(err) {
        console.error("Error seeding guides: ", err);
        process.exit(1);
    }
}

seedGuides();
