// Function to handle forgot password form submission
async function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.querySelector('input[name="email"]').value;
    console.log('Submitting email:', email); // Debug log

    try {
        // Check if email exists in database
        const response = await fetch(`http://localhost:5000/api/users/check-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            alert('Email not found in our database');
            return;
        }

        // Generate 5-digit code
        const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
        console.log('Generated code:', verificationCode); // Debug log
        
        // Store the code and email in localStorage for verification
        localStorage.setItem('verificationCode', verificationCode);
        localStorage.setItem('resetEmail', email);

        // Send verification code to email
        const sendCodeResponse = await fetch(`http://localhost:5000/api/users/send-verification-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email,
                code: verificationCode
            })
        });

        const responseData = await sendCodeResponse.json();
        console.log('Send code response:', responseData); // Debug log

        if (!sendCodeResponse.ok) {
            throw new Error(responseData.message || 'Failed to send verification code');
        }

        // Redirect to verification page
        window.location.href = 'verification-code.html';

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

// Add event listener to form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.forgotpassword-form');
    if (form) {
        form.addEventListener('submit', handleForgotPassword);
    }
});