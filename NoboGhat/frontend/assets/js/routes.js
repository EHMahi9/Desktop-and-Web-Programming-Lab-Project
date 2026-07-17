document.addEventListener("DOMContentLoaded", () => {
    // Target the elements defined in our HTML
    const resultsContainer = document.getElementById("tripResults");
    const errorMessage = document.getElementById("routesError");
    const searchForm = document.getElementById("routeSearchForm");
    const resultsCount = document.getElementById("resultsCount");

    // XSS Prevention Helper (Kept from your original code)
    function escapeHtml(value) {
        const element = document.createElement("div");
        element.textContent = value ?? "";
        return element.innerHTML;
    }

    // Main Async Function to Load and Filter Trips
    async function loadTrips(searchSource = "", searchDestination = "") {
        // Show loading state
        resultsContainer.innerHTML = "<p>Loading available trips...</p>";
        errorMessage.hidden = true;

        try {
            // Fetch from your defined API utility
            const response = await fetch(window.NoboGhatApi.url("/api/trips"));
            
            if (!response.ok) throw new Error("Trips could not be loaded from the server.");
            
            const trips = await response.json();

            // Filter logic based on your code
            const matches = trips.filter((trip) => {
                const route = trip.route || {};
                const sourceMatch = route.source?.toLowerCase().includes(searchSource.toLowerCase());
                const destMatch = route.destination?.toLowerCase().includes(searchDestination.toLowerCase());
                return sourceMatch && destMatch;
            });

            // Update the results count text
            resultsCount.textContent = `Showing ${matches.length} available trip${matches.length !== 1 ? 's' : ''}`;

            // Inject the Modular HTML Template
            resultsContainer.innerHTML = matches.length
                ? matches.map((trip) => `
                    <div class="trip-card">
                        <div class="trip-header">
                            <span class="boat-name"><i class="fa-solid fa-ship"></i> ${escapeHtml(trip.boat.name)}</span>
                            <span class="status-badge available">Available</span>
                        </div>
                        <div class="trip-body">
                            <div class="route-info">
                                <h4>${escapeHtml(trip.route.source)}</h4>
                                <i class="fa-solid fa-arrow-right"></i>
                                <h4>${escapeHtml(trip.route.destination)}</h4>
                            </div>
                            <ul class="trip-details">
                                <!-- Using placeholder date since departureTime wasn't in your original JS -->
                                <li><i class="fa-regular fa-calendar"></i> Scheduled Departure</li>
                                <li><i class="fa-solid fa-weight-scale"></i> <strong>Available Capacity:</strong> ${escapeHtml(String(trip.boat.capacity))} kg</li>
                                <li><i class="fa-solid fa-user-check"></i> Verified Owner</li>
                            </ul>
                        </div>
                        <div class="trip-footer">
                            <span class="price-estimate">Est. Rate Applied</span>
                            <a href="login.html" class="btn-book" style="text-decoration:none; text-align:center;">Book Space</a>
                        </div>
                    </div>
                `).join("")
                : "<p style='grid-column: 1 / -1; text-align: center; font-size: 1.2rem; padding: 2rem;'>No trips match this route yet. Please try different districts.</p>";
                
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.hidden = false;
            resultsContainer.innerHTML = ""; // Clear loading text on error
            resultsCount.textContent = "Error loading trips";
        }
    }

    // --- Search Form Integration ---
    if (searchForm) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent page reload
            
            // Grab values from the input fields
            const sourceInput = document.getElementById("searchSource").value.trim();
            const destInput = document.getElementById("searchDestination").value.trim();
            
            // Trigger the API fetch with the new filters
            loadTrips(sourceInput, destInput);
        });
    }

    // --- Initial Load ---
    // Read URL parameters on first load as you originally intended
    const params = new URLSearchParams(window.location.search);
    const initialSource = params.get("source") || "";
    const initialDestination = params.get("destination") || "";
    
    // Populate form fields if URL params exist
    if(initialSource) document.getElementById("searchSource").value = initialSource;
    if(initialDestination) document.getElementById("searchDestination").value = initialDestination;

    // Load trips immediately
    loadTrips(initialSource, initialDestination);
});