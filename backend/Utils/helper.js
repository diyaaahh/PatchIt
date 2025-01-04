const calculateProximityFactor = (maxRadius, distance) => {
    return (maxRadius - distance) / maxRadius;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const R = 6371e3; // Radius of Earth in meters

    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};

const calculatePriorityScore = (features, weights, maxRadius) => {
    let priorityScore = 0;

    features.forEach(feature => {
        const { type, distance } = feature;
        const weight = weights[type] || 0; // Get weight for the feature type
        const proximityFactor = calculateProximityFactor(maxRadius, distance);
        priorityScore += weight * proximityFactor; // Add weighted proximity factor to score
    });

    return priorityScore;
};

const normalizeScore = (score, minScore, maxScore) => {
    return (score - minScore) / (maxScore - minScore);
};

module.exports = {
    calculatePriorityScore,calculateProximityFactor,normalizeScore,calculateDistance
}