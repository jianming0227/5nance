function sendMail() {
    let params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        feedback: document.getElementById("feedback").value,
    };

    // Send to team using the first template
    emailjs.send("service_zyojtkc", "template_fdyhu63", params)
        .then(function(response) {
            console.log("Message sent to team:", response.status);
        }, function(error) {
            console.error("Failed to send to team:", error);
        });

    // Send confirmation email to user using the second template
    emailjs.send("service_zyojtkc", "template_zslpztg", params)
        .then(function(response) {
            console.log("Confirmation sent to user:", response.status);
        }, function(error) {
            console.error("Failed to send to user:", error);
        });

    // Reset form
    document.getElementById("contact-form").reset();
}
