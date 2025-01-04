const router = require("express").Router();
const multer = require('multer');

const photoModel = require("../Models/photo");

const weights = require("../Constants/constants");
const axios = require("axios");


const {calculatePriorityScore,normalizeScore,calculateDistance} = require('../Utils/helper');


const getAllPhotos = async (req, res) => {
    try {
        const { userId } = req.query; // Optional filter by userId

        // Build query object
        const query = userId ? { userId } : {};

        // Fetch photos
        const photos = await photoModel.find(query);

        res.status(200).json({
            message: "Photos retrieved successfully.",
            photos,
        });
    } catch (error) {
        console.error("Error fetching photos:", error);
        res.status(500).json({
            error: "Internal server error.",
            details: error.message,
        });
    }
};

module.exports =    getAllPhotos;

const fetchOverpassData = async (query) => {
    try {
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
        const response = await axios.get(url);
        return response.data.elements;
    } catch (error) {
        console.error('Overpass API error:', error.response?.data || error.message);
        throw error;
    }
};


const getPriorityScore = async (req, res) => {
    const {latitude,longitude} = req.body
    const maxRadius = 500; // meters

    console.log('Request received:', latitude, longitude);

    const queries = {
        hospital: `[out:json];(node["amenity"="hospital"](around:${maxRadius}, ${latitude}, ${longitude});
            way["amenity"="hospital"](around:${maxRadius}, ${latitude}, ${longitude});
            relation["amenity"="hospital"](around:${maxRadius}, ${latitude}, ${longitude});
        );out center;`,

        highway: `[out:json];way["highway"](around:${maxRadius}, ${latitude}, ${longitude});out geom;`,

        school: `[out:json];(
            node["amenity"="school"](around:${maxRadius}, ${latitude}, ${longitude});
            way["amenity"="school"](around:${maxRadius}, ${latitude}, ${longitude});
            relation["amenity"="school"](around:${maxRadius}, ${latitude}, ${longitude});
        );out center;`,
    };
    const weights = {
        hospital: 5,
        school: 4,
        primary: 5,
        secondary: 3,
        tertiary: 1,
        residential: 2
    };

    

    try {
        const [hospitals, highways, schools] = await Promise.all([
            fetchOverpassData(queries.hospital),
            fetchOverpassData(queries.highway),
            fetchOverpassData(queries.school),
        ]);

        const features = [];
        hospitals.forEach(hospital => {
            if (hospital.center) {
                const distance = calculateDistance(latitude, longitude, hospital.center.lat, hospital.center.lon);
                features.push({
                    type: 'hospital',
                    distance
                });
            }
        });

        // Process highways
        highways.forEach(highway => {
            if (highway.center) {
                const highwayType = highway.tags.highway;
                const distance = calculateDistance(latitude, longitude, highway.center.lat, highway.center.lon);
                features.push({
                    type: highwayType,
                    distance
                });
            }
        });

        // Process schools
        schools.forEach(school => {
            if (school.center) {
                const distance = calculateDistance(latitude, longitude, school.center.lat, school.center.lon);
                features.push({
                    type: 'school',
                    distance
                });
            }
        });

        const priorityScore = calculatePriorityScore(features, weights, maxRadius);
        console.log('Priority score:', priorityScore);
        const minScore = 0;
        const maxScore = 50;
        const normalizedScore = normalizeScore(priorityScore, minScore, maxScore);

        res.json({
            normalizedScore
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data or calculate score' });
    }
};


module.exports = {   getAllPhotos, getPriorityScore};
