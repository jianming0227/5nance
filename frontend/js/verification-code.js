document.addEventListener('DOMContentLoaded', function() {
    // Get all code input elements
    const codeInputs = document.querySelectorAll('.code-input');
    
    // Get the verification form
    const verificationForm = document.getElementById('verification-form');
    
    // Focus the first input when the page loads
    setTimeout(() => {
        codeInputs[0].focus();
    }, 300);
    
    // Add event listeners to each input for auto-focus and validation
    codeInputs.forEach((input, index) => {
        // Handle input events for auto-focus
        input.addEventListener('keyup', function(e) {
            // Skip if the key pressed is an arrow key
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                return;
            }
            
            // Allow only numbers
            const numericValue = this.value.replace(/[^0-9]/g, '');
            this.value = numericValue;
            
            // Auto-focus next input when a digit is entered
            if (this.value.length === 1 && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
        });
        
        // Handle click to select all text
        input.addEventListener('click', function() {
            this.select();
        });
        
        // Handle keydown events for navigation and deletion
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace') {
                e.preventDefault(); // Stop default delete

                if (this.value !== '') {
                    this.value = ''; // Clear current value
                } else if (index > 0) {
                    // Move to previous and clear that
                    codeInputs[index - 1].focus();
                    codeInputs[index - 1].value = '';
                    codeInputs[index - 1].select();
                }
            }

            // Navigation
            if (e.key === 'ArrowLeft' && index > 0) {
                codeInputs[index - 1].focus();
                codeInputs[index - 1].select();
                e.preventDefault();
            }

            if (e.key === 'ArrowRight' && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
                codeInputs[index + 1].select();
                e.preventDefault();
            }
        });

    input.addEventListener('input', function() {
        // If one digit entered, move to next
        if (this.value.length === 1 && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
        }
    });

    // Optional: Update active class on focus for styling
    input.addEventListener('focus', () => {
        codeInputs.forEach(i => i.classList.remove('active-input'));
        input.classList.add('active-input');
    });

        
        // Handle paste event to distribute digits across inputs
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            
            // Get pasted data
            const pastedData = (e.clipboardData || window.clipboardData).getData('text');
            
            // Filter out non-numeric characters
            const numericData = pastedData.replace(/[^0-9]/g, '');
            
            // Distribute digits across inputs
            for (let i = 0; i < codeInputs.length; i++) {
                if (i < numericData.length) {
                    codeInputs[i].value = numericData[i];
                }
            }
            
            // Focus the next empty input or the last input
            const nextEmptyIndex = Array.from(codeInputs).findIndex(input => !input.value);
            if (nextEmptyIndex !== -1 && nextEmptyIndex < codeInputs.length) {
                codeInputs[nextEmptyIndex].focus();
            } else {
                codeInputs[codeInputs.length - 1].focus();
            }
        });
    });
    
    // Handle form submission
    verificationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect the verification code
        let verificationCode = '';
        codeInputs.forEach(input => {
            verificationCode += input.value;
        });
        
        // Check if all digits are entered
        if (verificationCode.length === 5) {
            // Here you would typically make an API call to verify the code
            console.log('Verification code submitted:', verificationCode);
            
            // For demo purposes, show an alert
            alert('Verification code submitted: ' + verificationCode);
            
            // Redirect to the reset password page (in a real application)
            // window.location.href = 'reset-password.html';
        } else {
            alert('Please enter all 5 digits of the verification code.');
        }
    });
});