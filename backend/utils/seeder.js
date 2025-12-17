const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('../models/Service');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const services = [
  {
    category: "Plumbing",
    title: "Plumbing Services",
    description: "Professional plumbing solutions for residential and commercial properties. Our licensed plumbers provide reliable service for all your plumbing needs.",
    detailedDescription: "Our comprehensive plumbing services cover everything from minor repairs to major installations. Whether you're dealing with a dripping faucet, a burst pipe, or need a new water heater, our team of licensed professionals is equipped to handle any plumbing challenge. We prioritize quality workmanship, timely service, and customer satisfaction.",
    image: "https://images.unsplash.com/photo-1605158937441-6d2b3b8c4d7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
    icon: "fa fa-faucet",
    price: "$89 starting",
    duration: "1-3 hours",
    features: [
      "Leak detection and repair",
      "Pipe installation and replacement",
      "Water heater services",
      "Drain cleaning and unclogging",
      "Fixture installation",
      "Garbage disposal repair",
      "Sewer line repair",
      "Backflow prevention"
    ],
    benefits: [
      "Prevent costly water damage",
      "Improve water efficiency",
      "Ensure compliance with local codes",
      "Extend the life of your plumbing system",
      "Increase property value"
    ],
    faqs: [
      {
        question: "How quickly can you respond to a plumbing emergency?",
        answer: "We offer 24/7 emergency services and typically respond within 60 minutes for urgent situations."
      },
      {
        question: "Do you offer warranties on your work?",
        answer: "Yes, we provide a 1-year warranty on all labor and a manufacturer's warranty on parts."
      },
      {
        question: "Are your plumbers licensed and insured?",
        answer: "Absolutely. All our plumbers are fully licensed, bonded, and insured for your protection."
      }
    ]
  },
  {
    category: "Electrical",
    title: "Electrical Services",
    description: "Expert electrical work for homes and businesses. Our certified electricians ensure safety and compliance with all electrical codes.",
    detailedDescription: "Safety is our top priority when it comes to electrical work. Our certified electricians handle everything from simple outlet replacements to complex electrical system installations. We stay current with the latest National Electrical Code requirements and industry best practices to ensure your property is safe and compliant.",
    image: "https://images.unsplash.com/photo-1604014421542-86ae2c7dec49?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
    icon: "fa fa-bolt",
    price: "$99 starting",
    duration: "1-4 hours",
    features: [
      "Wiring installation and repair",
      "Lighting fixture installation",
      "Outlet and switch replacement",
      "Electrical panel upgrades",
      "Safety inspections",
      "Generator installation",
      "Smart home integration",
      "Surge protection"
    ],
    benefits: [
      "Ensure electrical safety",
      "Reduce energy costs",
      "Prevent electrical fires",
      "Modernize outdated systems",
      "Increase home value"
    ],
    faqs: [
      {
        question: "When should I upgrade my electrical panel?",
        answer: "If you're experiencing frequent breaker trips, flickering lights, or you're upgrading your home's electrical needs, it's time for an upgrade."
      },
      {
        question: "Can you help with smart home installations?",
        answer: "Yes, we specialize in integrating smart home technology with your existing electrical system."
      },
      {
        question: "Do you handle commercial electrical work?",
        answer: "Yes, we serve both residential and commercial clients with the same commitment to quality and safety."
      }
    ]
  },
  {
    category: "Cleaning",
    title: "Cleaning Services",
    description: "Thorough cleaning services tailored to your needs. Professional cleaners for homes, offices, and specialized deep cleaning.",
    detailedDescription: "Our professional cleaning services are designed to exceed your expectations. We use eco-friendly products and proven techniques to deliver spotless results. Whether you need regular maintenance cleaning, a deep clean before moving, or specialized services, our trained team delivers consistent quality.",
    image: "https://images.unsplash.com/photo-1581578021424-ebdc495a712e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
    icon: "fa fa-broom",
    price: "$79 starting",
    duration: "2-6 hours",
    features: [
      "Regular home cleaning",
      "Deep cleaning services",
      "Move-in/move-out cleaning",
      "Office and commercial cleaning",
      "Specialized carpet and upholstery cleaning",
      "Window cleaning",
      "Organizational services",
      "Post-construction cleanup"
    ],
    benefits: [
      "Save time and effort",
      "Create a healthier living environment",
      "Extend the life of your furnishings",
      "Prepare for special occasions",
      "Maintain property value"
    ],
    faqs: [
      {
        question: "What cleaning products do you use?",
        answer: "We use eco-friendly, non-toxic cleaning products that are safe for your family and pets."
      },
      {
        question: "Do I need to be home during the cleaning?",
        answer: "Not necessarily. Many clients provide us with access instructions and prefer to return to a clean home."
      },
      {
        question: "How often should I schedule cleaning services?",
        answer: "Most clients prefer weekly, bi-weekly, or monthly cleaning schedules based on their needs."
      }
    ]
  },
  {
    category: "AC Repair",
    title: "AC Repair & HVAC",
    description: "Complete HVAC services including installation, maintenance, and repair. Keep your home comfortable year-round with our expert technicians.",
    detailedDescription: "Our HVAC experts ensure your heating and cooling systems operate efficiently year-round. From routine maintenance to emergency repairs, we have the knowledge and equipment to keep your indoor climate comfortable. We work with all major brands and offer honest recommendations for your specific needs.",
    image: "https://images.unsplash.com/photo-1603302576837-37564b2edb06?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
    icon: "fa fa-snowflake",
    price: "$129 starting",
    duration: "1-5 hours",
    features: [
      "Air conditioner repair",
      "Heating system maintenance",
      "Ductwork installation",
      "Thermostat installation",
      "Energy efficiency assessments",
      "System installation",
      "Indoor air quality solutions",
      "Emergency repair services"
    ],
    benefits: [
      "Improve energy efficiency",
      "Extend equipment lifespan",
      "Ensure consistent comfort",
      "Reduce utility bills",
      "Prevent unexpected breakdowns"
    ],
    faqs: [
      {
        question: "How often should I service my HVAC system?",
        answer: "We recommend twice-yearly maintenance - once before cooling season and once before heating season."
      },
      {
        question: "What's the ideal thermostat setting?",
        answer: "78°F in summer and 68°F in winter for optimal comfort and energy savings."
      },
      {
        question: "When should I consider replacing my system?",
        answer: "Systems over 10-15 years old that require frequent repairs are often candidates for replacement."
      }
    ]
  }
];

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "123456",
    isAdmin: true
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "123456",
    phone: "(123) 456-7890",
    address: "123 Main Street, City, State 12345"
  }
];

const importData = async () => {
  try {
    await Service.deleteMany();
    await User.deleteMany();

    await Service.insertMany(services);
    
    // Hash passwords before inserting users
    for (let user of users) {
      const newUser = new User(user);
      await newUser.save();
    }

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Service.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}