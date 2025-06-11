document.addEventListener('DOMContentLoaded', () => {
    // Get stored email and code
    const storedEmail = localStorage.getItem('resetEmail');
    const storedCode = localStorage.getItem('verificationCode');

    // Update email display
    const emailDisplay = document.querySelector('.email-highlight');
    if (emailDisplay && storedEmail) {
        emailDisplay.textContent = storedEmail;
    }

    // Handle code input
    const codeInputs = document.querySelectorAll('.code-input');
    codeInputs.forEach((input, index) => {
        // Auto-focus next input
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1) {
                if (index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
            }
        });

        // Handle backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                codeInputs[index - 1].focus();
            }
        });
    });
    
    // Handle form submission
    const form = document.getElementById('verification-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get entered code
        const enteredCode = Array.from(codeInputs)
            .map(input => input.value)
            .join('');

        // Verify code
        if (enteredCode === storedCode) {
            // Clear verification code from localStorage
            localStorage.removeItem('verificationCode');
            
            // Redirect to reset password page
            window.location.href = 'reset-password.html';
        } else {
            alert('Invalid verification code. Please try again.');
        }
    });
});