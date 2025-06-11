// Add this at the beginning of the file
document.addEventListener('DOMContentLoaded', () => {
    // Check if accessed from forgot password flow
    const resetEmail = localStorage.getItem('resetEmail');
    const currentPasswordGroup = document.getElementById('current-password-group');
    const currentPasswordInput = document.getElementById('current-password');
    
    if (resetEmail) {
        // Hide current password field and remove required attribute
        if (currentPasswordGroup) {
            currentPasswordGroup.style.display = 'none';
        }
        if (currentPasswordInput) {
            currentPasswordInput.removeAttribute('required');
        }
    }
});

// Get userId from localStorage
const USER_ID = localStorage.getItem("userId");

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;

// Function to toggle password visibility
function togglePasswordVisibility(inputId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = passwordInput.nextElementSibling.querySelector('.eye-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
    } else {
        passwordInput.type = 'password';
        eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
}

// Make the function available globally
window.togglePasswordVisibility = togglePasswordVisibility;

// Function to validate password requirements
function validatePassword(password) {
    return PASSWORD_REGEX.test(password);
}

// Function to show error message
function showError(message) {
    alert(message);
}

// Function to show success message
function showSuccess(message) {
    alert(message);
}

// Function to handle password reset
async function handlePasswordReset(e) {
    e.preventDefault();

    const resetEmail = localStorage.getItem('resetEmail');
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    try {
        // If coming from forgot password flow
        if (resetEmail) {
            // Find user by email
            const userResponse = await fetch(`http://localhost:5000/api/users/find-by-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: resetEmail })
            });

            if (!userResponse.ok) {
                throw new Error('User not found');
            }

            const userData = await userResponse.json();
            const userId = userData.userId;

            // Update password
            const updateResponse = await fetch(`http://localhost:5000/api/users/${userId}/reset-password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPassword })
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to update password');
            }

            // Clear reset data from localStorage
            localStorage.removeItem('resetEmail');
            localStorage.removeItem('verificationCode');

            showSuccess("Password successfully updated!");
            window.location.href = "log-in-page.html";
            return;
        }

        // If coming from profile page (requires current password)
        if (!USER_ID) {
            showError("Please log in to reset your password");
            window.location.href = "log-in-page.html";
            return;
        }

        const currentPassword = document.getElementById("current-password").value;

        // Validate current password
        const response = await fetch(`http://localhost:5000/api/users/${USER_ID}/verify-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: currentPassword })
        });

        if (!response.ok) {
            showError("Current password is incorrect");
            return;
        }

        // Validate new password
        if (!validatePassword(newPassword)) {
            showError("Password must be at least 6 characters, include one uppercase letter, one number, and one symbol");
            return;
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            showError("New password and confirm password do not match");
            return;
        }

        // Update password in database
        const updateResponse = await fetch(`http://localhost:5000/api/users/${USER_ID}/reset-password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newPassword })
        });

        if (!updateResponse.ok) {
            throw new Error('Failed to update password');
        }

        showSuccess("Password successfully updated!");
        window.location.href = "view-profile.html";

    } catch (error) {
        console.error('Error resetting password:', error);
        showError("Failed to reset password. Please try again.");
    }
}

// Add event listener to form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector(".reset-password-form");
    if (form) {
        form.addEventListener("submit", handlePasswordReset);
    }
});