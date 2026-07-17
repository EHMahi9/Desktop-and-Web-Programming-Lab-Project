document.addEventListener("DOMContentLoaded", async function() {
  var errorMessage = document.getElementById("dashboardError");
  try {
    var response = await fetch("/api/admin/dashboard");
    if (!response.ok) throw new Error("Dashboard data could not be loaded.");
    var data = await response.json();
    document.getElementById("totalUsers").textContent = data.totalUsers;
    document.getElementById("totalBoats").textContent = data.totalBoats;
    document.getElementById("totalBookings").textContent = data.totalBookings;
    document.getElementById("totalCargoWeight").textContent = data.totalCargoWeight + " kg";
  } catch (error) {
    if (errorMessage) {
      errorMessage.textContent = error.message;
      errorMessage.hidden = false;
    }
  }
});
