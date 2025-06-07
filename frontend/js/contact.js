function sendMail(){
    let params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        feedback: document.getElementById("feedback").value,
    }

    emailjs.send("service_zyojtkc", "template_fdyhu63", params);
    this.reset(); // reset form fields
}

