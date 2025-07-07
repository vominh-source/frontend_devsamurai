// Test script to check backend connectivity
// Run this in browser console or as a standalone script

const testBackend = async () => {
  const API_BASE_URL = 'http://localhost:3000';
  
  try {
    // Test basic connectivity
    const response = await fetch(`${API_BASE_URL}/`);
    console.log('Backend status:', response.status);
    
    // Test signup endpoint (just to see if it exists)
    const signupTest = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    console.log('Signup endpoint status:', signupTest.status);
    
    if (signupTest.ok) {
      const data = await signupTest.json();
      console.log('Signup response:', data);
    } else {
      const error = await signupTest.text();
      console.log('Signup error:', error);
    }
    
  } catch (error) {
    console.error('Backend connection failed:', error);
    console.log('Make sure your backend is running on http://localhost:3000');
  }
};

// Uncomment to run test
// testBackend();
