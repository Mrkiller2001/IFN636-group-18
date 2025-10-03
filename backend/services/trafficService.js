class TrafficService {
        static instance = null


    constructor(mapProvider) {
        if (TrafficService.instance) {
            return TrafficService.instance
        }

        this.mapProvider = mapProvider;
        TrafficService.instance = this
    }
    async getTrafficInfo(points) {
        // This is a placeholder. In a real application, this would interact
        // with a map provider's traffic API. Mapbox's Directions API can
        // return traffic-aware routes.
        try {
            const route = await this.mapProvider.route(points);
            // The route object from MapboxAdapter already contains duration.
            // We can assume this duration is traffic-aware if the Mapbox API
            // is configured to provide it (e.g., by setting a traffic profile).
            return {
                durationMin: route.durationMin,
                distanceKm: route.distanceKm,
                // Additional traffic-specific info could be parsed here if available
                // e.g., congestion levels, alternative routes due to traffic.
            };
        } catch (error) {
            console.error("Error fetching traffic info from map provider:", error);
            throw new Error("Could not retrieve traffic information.");
        }
    }
}

module.exports = TrafficService;
