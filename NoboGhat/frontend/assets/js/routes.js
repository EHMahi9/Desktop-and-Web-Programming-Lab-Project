document.addEventListener("DOMContentLoaded", function() {
    var resultsContainer = document.getElementById("tripResults");
    var errorMessage = document.getElementById("routesError");
    var searchForm = document.getElementById("routeSearchForm");
    var resultsCount = document.getElementById("resultsCount");

    // Creates a trip card DOM element from data — no innerHTML with user content
    function createTripCard(trip) {
        var card = document.createElement("div");
        card.className = "trip-card";

        // Header
        var header = document.createElement("div");
        header.className = "trip-header";

        var boatName = document.createElement("span");
        boatName.className = "boat-name";
        boatName.innerHTML = '<i class="fa-solid fa-ship"></i> ' + (trip.boat.name || "Unknown");

        var badge = document.createElement("span");
        badge.className = "status-badge available";
        badge.textContent = "Available";

        header.appendChild(boatName);
        header.appendChild(badge);

        // Body
        var body = document.createElement("div");
        body.className = "trip-body";

        var routeInfo = document.createElement("div");
        routeInfo.className = "route-info";

        var src = document.createElement("h4");
        src.textContent = trip.route.source || "N/A";
        var arrow = document.createElement("i");
        arrow.className = "fa-solid fa-arrow-right";
        var dst = document.createElement("h4");
        dst.textContent = trip.route.destination || "N/A";

        routeInfo.appendChild(src);
        routeInfo.appendChild(arrow);
        routeInfo.appendChild(dst);

        var details = document.createElement("ul");
        details.className = "trip-details";

        var li1 = document.createElement("li");
        li1.innerHTML = '<i class="fa-regular fa-calendar"></i> Scheduled Departure';

        var li2 = document.createElement("li");
        li2.innerHTML = '<i class="fa-solid fa-weight-scale"></i> <strong>Available Capacity:</strong> ' + (trip.boat.capacity || "0") + ' kg';

        var li3 = document.createElement("li");
        li3.innerHTML = '<i class="fa-solid fa-user-check"></i> Verified Owner';

        details.appendChild(li1);
        details.appendChild(li2);
        details.appendChild(li3);

        body.appendChild(routeInfo);
        body.appendChild(details);

        // Footer
        var footer = document.createElement("div");
        footer.className = "trip-footer";

        var price = document.createElement("span");
        price.className = "price-estimate";
        price.textContent = "Est. Rate Applied";

        var bookLink = document.createElement("a");
        bookLink.href = "login.html";
        bookLink.className = "btn-book";
        bookLink.style.textDecoration = "none";
        bookLink.style.textAlign = "center";
        bookLink.textContent = "Book Space";

        footer.appendChild(price);
        footer.appendChild(bookLink);

        card.appendChild(header);
        card.appendChild(body);
        card.appendChild(footer);

        return card;
    }

    async function loadTrips(searchSource, searchDestination) {
        searchSource = searchSource || "";
        searchDestination = searchDestination || "";

        resultsContainer.innerHTML = '<p>Loading available trips...</p>';
        errorMessage.hidden = true;

        try {
            var response = await fetch(window.NoboGhatApi.url("/api/trips"));
            if (!response.ok) throw new Error("Trips could not be loaded from the server.");
            var trips = await response.json();

            var matches = trips.filter(function(trip) {
                var route = trip.route || {};
                var srcMatch = (route.source || "").toLowerCase().includes(searchSource.toLowerCase());
                var dstMatch = (route.destination || "").toLowerCase().includes(searchDestination.toLowerCase());
                return srcMatch && dstMatch;
            });

            resultsCount.textContent = "Showing " + matches.length + " available trip" + (matches.length !== 1 ? "s" : "");
            resultsContainer.innerHTML = "";

            if (matches.length === 0) {
                var noResults = document.createElement("p");
                noResults.style.cssText = "grid-column: 1 / -1; text-align: center; font-size: 1.2rem; padding: 2rem;";
                noResults.textContent = "No trips match this route yet. Please try different districts.";
                resultsContainer.appendChild(noResults);
            } else {
                for (var i = 0; i < matches.length; i++) {
                    resultsContainer.appendChild(createTripCard(matches[i]));
                }
            }
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.hidden = false;
            resultsContainer.innerHTML = "";
            resultsCount.textContent = "Error loading trips";
        }
    }

    if (searchForm) {
        searchForm.addEventListener("submit", function(event) {
            event.preventDefault();
            var sourceInput = document.getElementById("searchSource").value.trim();
            var destInput = document.getElementById("searchDestination").value.trim();
            loadTrips(sourceInput, destInput);
        });
    }

    var params = new URLSearchParams(window.location.search);
    var initialSource = params.get("source") || "";
    var initialDestination = params.get("destination") || "";

    if (initialSource) document.getElementById("searchSource").value = initialSource;
    if (initialDestination) document.getElementById("searchDestination").value = initialDestination;

    loadTrips(initialSource, initialDestination);
});
