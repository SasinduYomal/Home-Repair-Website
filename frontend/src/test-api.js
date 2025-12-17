// Simple test to check if API calls work
import { bookingsAPI } from './services/api';

// Test function to create a booking
const testCreateBooking = async () => {
  try {
    console.log('Testing booking creation...');
    
    // Sample booking data
    const bookingData = {
      service: '694242320b8310ed33e00e42', // Replace with actual service ID
      technician: '69412e81c0029a1286e21cb3', // Replace with actual technician ID
      date: new Date().toISOString(),
      time: '10:00',
      totalPrice: 100.00,
      paymentMethod: 'card',
      transactionId: 'TEST-TXN-123456',
      customerInfo: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '123-456-7890',
        address: {
          street: '123 Test St',
          city: 'Test City',
          zipCode: '12345'
        }
      }
    };
    
    console.log('Sending booking data:', bookingData);
    
    // Try to create booking
    const response = await bookingsAPI.createBooking(bookingData);
    console.log('Booking created successfully:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw error;
  }
};

// Run the test
testCreateBooking()
  .then(result => {
    console.log('Test completed successfully');
  })
  .catch(error => {
    console.error('Test failed:', error);
  });

export default testCreateBooking;