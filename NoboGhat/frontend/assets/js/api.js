(() => {
    // 1. Environment Setup
    const localHosts = new Set(["localhost", "127.0.0.1"]);
    const apiBaseUrl = localHosts.has(window.location.hostname) ? "http://localhost:8080" : "";

    window.NoboGhatApi = {
        url(path) {
            return `${apiBaseUrl}${path}`;
        },
        
        // 2. Mock Data Array (Simulating Database Joins for Phase 3 MVP)
        // This matches the schema relationships defined in the System Design Document
        mockTrips: [
            {
                tripId: "T1001",
                departureTime: "2026-10-24T08:00:00",
                boat: { 
                    boatId: "B001", 
                    name: "JolTori Express", 
                    capacity: 1200 
                },
                route: { 
                    routeId: "R001", 
                    source: "Sadarghat", 
                    destination: "Khulna" 
                }
            },
            {
                tripId: "T1002",
                departureTime: "2026-10-25T06:00:00",
                boat: { 
                    boatId: "B002", 
                    name: "Padma Voyager", 
                    capacity: 250 
                },
                route: { 
                    routeId: "R002", 
                    source: "Barisal", 
                    destination: "Dhaka" 
                }
            },
            {
                tripId: "T1003",
                departureTime: "2026-10-26T10:00:00",
                boat: { 
                    boatId: "B003", 
                    name: "Meghna Carrier", 
                    capacity: 5000 
                },
                route: { 
                    routeId: "R003", 
                    source: "Sadarghat", 
                    destination: "Chandpur" 
                }
            }
        ]
    };

    // 3. Fetch Interceptor (The Core Logic)
    // We explicitly override the browser's native fetch function to catch API calls.
    const originalFetch = window.fetch;
    
    window.fetch = async function(resource, config) {
        // Check if the request string contains our target REST endpoint
        if (typeof resource === 'string' && resource.includes("/api/trips")) {
            console.log("[Mock API] Intercepted request to:", resource);
            
            // Simulate network latency (500ms delay) so you can test loading states
            await new Promise(resolve => setTimeout(resolve, 500));

            // Return a valid Response object containing our stringified JSON data
            return new Response(JSON.stringify(window.NoboGhatApi.mockTrips), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // If the fetch isn't for our mock API, pass it through to the real native fetch
        return originalFetch(resource, config);
    };
})();