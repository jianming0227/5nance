function saveSignUpData() {
  const userData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    contact: `${document.getElementById("country-code").value}${document.getElementById("phone").value}`,
    dob: document.getElementById("dob").value,
    country: document.getElementById("country").value,
    state: document.getElementById("state").value,
    city: document.getElementById("city").value,
    password: sha256(document.getElementById("password").value),
    address1: "",
    address2: "",
    postcode: "",
    avatar: "images/profile-pic.png" // Default avatar
  };

  localStorage.setItem("profileData", JSON.stringify(userData));
  window.location.href = "view-profile.html";
}
