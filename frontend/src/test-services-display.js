// Test script to verify services are being fetched and displayed correctly
import { servicesAPI } from './services/api';

const testServicesDisplay = async () => {
  try {
    console.log('Fetching services...');
    const response = await servicesAPI.getAllServices();
    console.log('Services fetched successfully:', response.data);
    
    // Check if services have the required fields
    if (response.data && response.data.length > 0) {
      const firstService = response.data[0];
      console.log('First service structure:', {
        id: firstService._id,
        category: firstService.category,
        title: firstService.title,
        description: firstService.description,
        image: firstService.image,
        icon: firstService.icon,
        price: firstService.price
      });
    } else {
      console.log('No services found in the database');
    }
  } catch (error) {
    console.error('Error fetching services:', error);
  }
};

// Run the test
testServicesDisplay();