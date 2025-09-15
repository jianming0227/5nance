function sendMail(event) {
    event.preventDefault();

    const submitBtn = document.getElementById("submit-btn");
    const submitText = document.getElementById("submit-text");
    const spinner = document.getElementById("loading-spinner");

    // Show loading spinner
    submitBtn.disabled = true;
    spinner.classList.remove("d-none");
    submitText.textContent = "Sending...";

    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        feedback: document.getElementById("feedback").value,
    };

    fetch('http://localhost:5000/send-feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            const thankYouModal = new bootstrap.Modal(document.getElementById("thankYouModal"));
            thankYouModal.show();
            document.getElementById("contact-form").reset();
        } else {
            alert("Something went wrong. Please try again later.");
        }
    })
    .catch(error => {
        console.error("Error sending message:", error);
        alert("Failed to send message.");
    })
    .finally(() => {
        // Restore button state
        submitBtn.disabled = false;
        spinner.classList.add("d-none");
        submitText.textContent = "Submit";
    });
}
