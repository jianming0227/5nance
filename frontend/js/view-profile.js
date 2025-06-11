async function populateViewProfile() {
  const userId = localStorage.getItem("userId");
  console.log("User ID:", userId); // DEBUG

  if (!userId) {
    console.error("No userId in localStorage");
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
    console.log("Fetch status:", res.status); // DEBUG

    if (!res.ok) throw new Error("Failed to fetch profile");

    const data = await res.json();
    console.log("Fetched profile data:", data); // DEBUG

    // Populate HTML
    document.querySelector(".readonly-name").textContent = data.name || "-";
    document.querySelector(".readonly-email").textContent = data.email || "-";
    document.querySelector(".readonly-phone").textContent = data.contact || "-";
    document.querySelector(".readonly-dob").textContent = data.dob || "-";
    document.querySelector(".readonly-address-1").textContent = data.address1 || "-";
    document.querySelector(".readonly-address-2").textContent = data.address2 || "-";
    document.querySelector(".readonly-postcode").textContent = data.postcode || "-";
    document.querySelector(".readonly-city").textContent = data.city || "-";
    document.querySelector(".readonly-state").textContent = data.state || "-";
    document.querySelector(".readonly-country").textContent = data.country || "-";
    document.getElementById("password").value = "********";
    document.getElementById("view-profile-img").src = data.avatar || "images/profile-pic.png";
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

window.onload = () => {
  console.log("Page loaded, populating profile..."); // DEBUG
  populateViewProfile();
}
