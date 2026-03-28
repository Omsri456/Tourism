require('dotenv').config({ override: true });
const mongoose = require('mongoose');
const Destination = require('./models/Destination');
const Accommodation = require('./models/Accommodation');
const CulturalExperience = require('./models/CulturalExperience');

const connectDB = require('./config/db');

const seedExtraData = async () => {
    try {
        await connectDB();
        console.log('Connected to DB for seeding extra data...');

        const destinations = [
            {
                name: 'Netarhat',
                description: 'Known as the Queen of Chotanagpur, famous for its glorious sunrises and sunsets.',
                category: 'Nature tourism',
                bestTimeToVisit: 'October to March',
                entryFee: 'Free',
                images: ['https://images.unsplash.com/photo-1469334031218-e382a71b716b'],
                rating: 4.8,
                reviewsCount: 156
            },
            {
                name: 'Betla National Park',
                description: 'One of the first national parks in India to become a tiger reserve under Project Tiger.',
                category: 'Wildlife and national parks',
                bestTimeToVisit: 'November to April',
                entryFee: '₹200',
                images: ['https://images.unsplash.com/photo-1549366021-9f761d450615'],
                rating: 4.6,
                reviewsCount: 320
            },
            {
                name: 'Patratu Valley',
                description: 'A mesmerizing valley with winding roads and a beautiful dam.',
                category: 'Nature tourism',
                bestTimeToVisit: 'Year-round',
                entryFee: 'Free',
                images: ['https://images.unsplash.com/photo-1506744626753-eda8151a747b'],
                rating: 4.7,
                reviewsCount: 200
            },
            {
                name: 'Hundru Falls',
                description: 'One of the highest waterfalls in Jharkhand, falling from a height of 98 meters.',
                category: 'Waterfalls',
                bestTimeToVisit: 'July to December',
                entryFee: '₹50',
                images: ['https://images.unsplash.com/photo-1433086966358-54859d0ed716'],
                rating: 4.5,
                reviewsCount: 410
            },
            {
                name: 'Santhal Pargana Villages',
                description: 'Experience the rich tribal culture and heritage of the Santhal tribe.',
                category: 'Tribal culture and heritage',
                bestTimeToVisit: 'Winter',
                entryFee: 'Free',
                images: ['https://images.unsplash.com/photo-1520607162513-77705c0f0d4a'],
                rating: 4.9,
                reviewsCount: 85
            }
        ];

        const insertedDestinations = await Destination.insertMany(destinations);
        console.log('Extra Destinations seeded!');

        const accommodations = [
            {
                name: 'Netarhat Eco Retreat',
                type: 'Eco-lodge',
                location: 'Netarhat, Latehar',
                pricePerNight: 2500,
                images: ['https://images.unsplash.com/photo-1542718610-a1d656d1884c'],
                facilities: ['Free WiFi', 'Campfire', 'Nature Walk'],
                rating: 4.6,
                reviewsCount: 45
            },
            {
                name: 'Betla Jungle Resort',
                type: 'Resort',
                location: 'Betla, Palamu',
                pricePerNight: 3500,
                images: ['https://images.unsplash.com/photo-1588667824177-336e47766b4d'],
                facilities: ['Pool', 'Safari Desk', 'Restaurant'],
                rating: 4.5,
                reviewsCount: 110
            },
            {
                name: 'Santhal Tribal Homestay',
                type: 'Tribal Homestay',
                location: 'Dumka',
                pricePerNight: 1200,
                images: ['https://images.unsplash.com/photo-1449844908441-8829872d2607'],
                facilities: ['Local Food', 'Cultural Tour'],
                rating: 4.8,
                reviewsCount: 65
            },
            {
                name: 'Patratu Lake View Guest House',
                type: 'Guest House',
                location: 'Patratu, Ramgarh',
                pricePerNight: 1800,
                images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
                facilities: ['Lake View', 'Boating', 'Parking'],
                rating: 4.4,
                reviewsCount: 88
            }
        ];

        await Accommodation.insertMany(accommodations);
        console.log('Extra Accommodations seeded!');

        const experiences = [
            {
                title: 'Sohrai Art Workshop',
                description: 'Learn the ancient tribal Sohrai mural painting technique from local artists in Hazaribagh.',
                category: 'Craft workshop',
                location: 'Hazaribagh',
                duration: '4 hours',
                price: 500,
                images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f'],
                rating: 4.9,
                reviewsCount: 120
            },
            {
                title: 'Chhau Dance Evening',
                description: 'Witness the vigorous martial tribal dance of Seraikela Chhau.',
                category: 'Traditional Dance',
                location: 'Seraikela',
                duration: '2 hours',
                price: 300,
                images: ['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7'],
                rating: 4.8,
                reviewsCount: 95
            },
            {
                title: 'Tribal Foraging & Cooking',
                description: 'Join locals in foraging seasonal woodland ingredients and cook a traditional meal.',
                category: 'Local food tour',
                location: 'Gumla',
                duration: '6 hours',
                price: 800,
                images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1'],
                rating: 4.7,
                reviewsCount: 40
            },
            {
                title: 'Netarhat Sunrise Hike',
                description: 'A guided early morning hike through pine forests to Magnolia point for a breathtaking sunrise.',
                category: 'Other',
                location: 'Netarhat',
                duration: '3 hours',
                price: 200,
                images: ['https://images.unsplash.com/photo-1501555088652-021faa106b9b'],
                rating: 4.9,
                reviewsCount: 200
            }
        ];

        await CulturalExperience.insertMany(experiences);
        console.log('Extra Cultural Experiences seeded!');

        console.log('Data successfully added! Exiting...');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedExtraData();
