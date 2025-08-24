// Test script to verify AI service is working
const testQuizGeneration = async () => {
  try {
    console.log('Testing quiz generation...');
    
    const response = await fetch('https://quizcraft-p7qu.onrender.com/api/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // This will fail auth but we can see the response
      },
      body: JSON.stringify({
        difficulty_level: 'Easy',
        pdf_text: 'This is a test PDF text about artificial intelligence and machine learning.',
        mcq_count: 2,
        true_false_count: 1,
        include_mcq: true,
        include_true_false: true
      })
    });

    if (response.status === 401) {
      console.log('✅ Server is responding (auth failed as expected)');
      console.log('This means your server is working and ready for AI service');
    } else {
      const data = await response.json();
      console.log('Response:', data);
    }
  } catch (error) {
    console.error('❌ Error testing server:', error.message);
  }
};

// Run the test
testQuizGeneration();
