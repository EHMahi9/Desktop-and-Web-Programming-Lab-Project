(function() {
    // 1. Environment Setup
    var localHosts = new Set(["localhost", "127.0.0.1"]);
    var apiBaseUrl = localHosts.has(window.location.hostname) ? "http://localhost:8080" : "";

    // 2. Mock Data Arrays
    var mockTrips = [
        {
            tripId: "T1001",
            departureTime: "2026-10-24T08:00:00",
            boat: { boatId: "B001", name: "JolTori Express", capacity: 1200 },
            route: { routeId: "R001", source: "Sadarghat", destination: "Khulna" }
        },
        {
            tripId: "T1002",
            departureTime: "2026-10-25T06:00:00",
            boat: { boatId: "B002", name: "Padma Voyager", capacity: 250 },
            route: { routeId: "R002", source: "Barisal", destination: "Dhaka" }
        },
        {
            tripId: "T1003",
            departureTime: "2026-10-26T10:00:00",
            boat: { boatId: "B003", name: "Meghna Carrier", capacity: 5000 },
            route: { routeId: "R003", source: "Sadarghat", destination: "Chandpur" }
        }
    ];

    var mockDashboard = {
        totalUsers: 150,
        totalBoats: 25,
        totalBookings: 340,
        totalCargoWeight: 42500
    };

    // 3. Mock response generator for auth endpoints
    function mockAuthResponse(url, body) {
        if (url.includes("/api/auth/register")) {
            var parsed;
            try { parsed = JSON.parse(body); } catch(e) { parsed = {}; }
            return {
                userId: Math.floor(Math.random() * 10000) + 1,
                name: parsed.name || "User",
                phone: parsed.phone || "01700000000",
                role: parsed.role || "farmer",
                message: "Registration successful."
            };
        }
        if (url.includes("/api/auth/login")) {
            return {
                message: "Login successful. JWT token will be generated here in Phase 6.",
                userId: 1,
                name: "Demo User"
            };
        }
        return null;
    }

    // 4. Public API
    window.NoboGhatApi = {
        url: function(path) {
            return apiBaseUrl + path;
        },

        mockTrips: mockTrips,

        // Try real fetch first, fall back to mock data on network failure
        fetchWithFallback: async function(endpoint, options) {
            var url = this.url(endpoint);
            try {
                var response = await fetch(url, options);
                if (!response.ok) {
                    // If server returned an error, throw so we can check mock
                    var text = await response.text();
                    var err = new Error("Server returned " + response.status);
                    err.response = response;
                    err.body = text;
                    throw err;
                }
                return await response.json();
            } catch (err) {
                // Network failure or server error — use mock data if available
                if (endpoint === "/api/trips") {
                    console.warn("[Fallback] Using mock trip data.");
                    return mockTrips;
                }
                if (endpoint === "/api/admin/dashboard") {
                    console.warn("[Fallback] Using mock dashboard data.");
                    return mockDashboard;
                }
                if (endpoint.includes("/api/auth/")) {
                    var mock = mockAuthResponse(endpoint, options ? options.body : null);
                    if (mock) {
                        console.warn("[Fallback] Using mock auth response.");
                        return mock;
                    }
                }
                throw err; // No fallback available — propagate
            }
        }
    };

    // 5. Fetch Interceptor — overrides native fetch to seamless mock when backend is down
    var originalFetch = window.fetch;

    window.fetch = async function(resource, config) {
        var urlStr = typeof resource === "string" ? resource : resource.url;

        // Intercept /api/trips
        if (urlStr.includes("/api/trips")) {
            console.log("[Mock API] Intercepted request to:", urlStr);
            await new Promise(function(resolve) { setTimeout(resolve, 500); });
            return new Response(JSON.stringify(mockTrips), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Intercept /api/admin/dashboard
        if (urlStr.includes("/api/admin/dashboard")) {
            console.log("[Mock API] Intercepted dashboard request.");
            await new Promise(function(resolve) { setTimeout(resolve, 300); });
            return new Response(JSON.stringify(mockDashboard), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Intercept /api/auth/* — respond with mock when backend unreachable
        if (urlStr.includes("/api/auth/")) {
            console.log("[Mock API] Intercepted auth request to:", urlStr);
            try {
                // Try the real backend first with a short timeout
                var controller = new AbortController();
                var timeoutId = setTimeout(function() { controller.abort(); }, 3000);
                var realResponse = await originalFetch(resource, Object.assign({}, config, { signal: controller.signal }));
                clearTimeout(timeoutId);
                return realResponse;
            } catch (e) {
                // Backend unreachable or timeout — use mock
                console.warn("[Mock API] Backend unreachable, using mock auth.");
                await new Promise(function(resolve) { setTimeout(resolve, 500); });
                var body = config ? config.body : null;
                var mockData = mockAuthResponse(urlStr, body);
                if (mockData) {
                    return new Response(JSON.stringify(mockData), {
                        status: 200,
                        headers: { "Content-Type": "application/json" }
                    });
                }
                return new Response(JSON.stringify({ message: "Service unavailable" }), {
                    status: 503,
                    headers: { "Content-Type": "application/json" }
                });
            }
        }

        // Pass through for everything else
        return originalFetch(resource, config);
    };
})();
