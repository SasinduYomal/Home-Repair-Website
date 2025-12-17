const connectDB = require('./config/db');
const Technician = require('./models/Technician');

const sampleTechnicians = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Plumbing',
    experience: 8,
    rating: 4.8,
    bio: 'John is a master plumber with over 8 years of experience in residential and commercial plumbing. He specializes in leak detection, pipe installation, and water heater services. John is known for his punctuality and attention to detail.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80',
    skills: ['Leak Detection', 'Pipe Installation', 'Water Heater Repair', 'Drain Cleaning', 'Fixture Installation'],
    certifications: [
      { name: 'Master Plumber License', issuer: 'State Plumbing Board', date: '2020-05-15' },
      { name: 'Gas Fitting Certification', issuer: 'National Gas Safety Association', date: '2019-03-22' }
    ],
    availability: 'Available'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 234-5678',
    specialization: 'Electrical',
    experience: 6,
    rating: 4.9,
    bio: 'Sarah is a licensed electrician with expertise in residential wiring, lighting installation, and electrical safety inspections. She has completed numerous projects ranging from simple outlet replacements to complete home rewiring. Sarah prioritizes safety and code compliance in all her work.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80',
    skills: ['Residential Wiring', 'Lighting Installation', 'Electrical Inspections', 'Panel Upgrades', 'Smart Home Integration'],
    certifications: [
      { name: 'Licensed Electrician', issuer: 'State Electrical Board', date: '2019-08-10' },
      { name: 'Solar Panel Installation', issuer: 'Renewable Energy Institute', date: '2021-11-05' }
    ],
    availability: 'Available'
  },
  {
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1 (555) 345-6789',
    specialization: 'HVAC',
    experience: 10,
    rating: 4.7,
    bio: 'Michael is an HVAC specialist with a decade of experience in heating, ventilation, and air conditioning systems. He excels in both installation and repair of various HVAC units. Michael is committed to energy efficiency and customer satisfaction.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80',
    skills: ['AC Repair', 'Heating Systems', 'Ventilation', 'Energy Efficiency', 'Ductwork Installation'],
    certifications: [
      { name: 'HVAC Technician Certification', issuer: 'National HVAC Association', date: '2018-04-12' },
      { name: 'EPA Certification', issuer: 'Environmental Protection Agency', date: '2017-09-30' }
    ],
    availability: 'Busy'
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '+1 (555) 456-7890',
    specialization: 'Painting',
    experience: 5,
    rating: 4.9,
    bio: 'Emily is a skilled painter with an eye for detail and color. She specializes in both interior and exterior painting, including decorative finishes and wallpaper removal. Emily uses high-quality materials and ensures clean, professional results.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800&q=80',
    skills: ['Interior Painting', 'Exterior Painting', 'Decorative Finishes', 'Wallpaper Removal', 'Color Consultation'],
    certifications: [
      { name: 'Professional Painter Certification', issuer: 'Painting Contractors Association', date: '2020-01-20' }
    ],
    availability: 'Available'
  }
];

const seedTechnicians = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing technicians
    await Technician.deleteMany({});
    console.log('Cleared existing technicians');
    
    // Insert sample technicians
    const insertedTechnicians = await Technician.insertMany(sampleTechnicians);
    console.log(`Inserted ${insertedTechnicians.length} technicians`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding technicians:', error);
    process.exit(1);
  }
};

seedTechnicians();