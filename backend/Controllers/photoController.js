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

const getPendingReports = async(req, res) =>{
    try {
        // Fetch all reports with status "pending"
        const pendingReports = await photoModel.find({ status: "reported" });

        if (pendingReports.length === 0) {
            return res.status(404).json({
                message: "No pending reports found.",
            });
        }

        // Return the pending reports
        res.status(200).json({
            message: "Pending reports retrieved successfully.",
            reports: pendingReports,
        });
    } catch (error) {
        console.error("Error fetching pending reports:", error);
        res.status(500).json({
            error: "Internal server error.",
            details: error.message,
        });
    }
}

const getResolvedReports = async(req,res) =>{
    try {
        // Fetch all reports with status "pending"
        const pendingReports = await photoModel.find({ status: "resolved" });

        if (pendingReports.length === 0) {
            return res.status(404).json({
                message: "No resolved reports found.",
            });
        }

        // Return the pending reports
        res.status(200).json({
            message: "Resolved reports retrieved successfully.",
            reports: pendingReports,
        });
    } catch (error) {
        console.error("Error fetching pending reports:", error);
        res.status(500).json({
            error: "Internal server error.",
            details: error.message,
        });
    }
}

const getInProgressReports = async(req,res) =>{
    try {
        // Fetch all reports with status "pending"
        const pendingReports = await photoModel.find({ status: "in-progress" });

        if (pendingReports.length === 0) {
            return res.status(404).json({
                message: "No in-progress reports found.",
            });
        }

        // Return the pending reports
        res.status(200).json({
            message: "In progress reports retrieved successfully.",
            reports: pendingReports,
        });
    } catch (error) {
        console.error("Error fetching in-progress reports:", error);
        res.status(500).json({
            error: "Internal server error.",
            details: error.message,
        });
    }
}


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


const calculatePriorityScoreInternal = async (latitude, longitude) => {
    const maxRadius = 500; // meters
    
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
        );out center;`
    };

    const weights = {
        hospital: 5,
        school: 4,
        primary: 5,
        secondary: 3,
        tertiary: 1,
        residential: 2
    };

    const [hospitals, highways, schools] = await Promise.all([
        fetchOverpassData(queries.hospital),
        fetchOverpassData(queries.highway),
        fetchOverpassData(queries.school),
    ]);

    const features = [];
    hospitals.forEach(hospital => {
        if (hospital.center) {
            const distance = calculateDistance(latitude, longitude, hospital.center.lat, hospital.center.lon);
            features.push({ type: 'hospital', distance });
        }
    });

    highways.forEach(highway => {
        if (highway.center) {
            const highwayType = highway.tags.highway;
            const distance = calculateDistance(latitude, longitude, highway.center.lat, highway.center.lon);
            features.push({ type: highwayType, distance });
        }
    });

    schools.forEach(school => {
        if (school.center) {
            const distance = calculateDistance(latitude, longitude, school.center.lat, school.center.lon);
            features.push({ type: 'school', distance });
        }
    });

    const priorityScore = calculatePriorityScore(features, weights, maxRadius);
    const minScore = 0;
    const maxScore = 50;
    const normalizedScore = normalizeScore(priorityScore, minScore, maxScore);
    
    return normalizedScore;
};

const getPriorityScore = async (req, res) => {
    try {
        const {latitude, longitude} = req.body;
        console.log('Request received:', latitude, longitude);
        
        const normalizedScore = await calculatePriorityScoreInternal(latitude, longitude);
        console.log('Normalized score:', normalizedScore);
        
        res.status(200).json({
            message: 'Priority score calculated successfully.',
            severity: normalizedScore
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data or calculate score' });
    }
};

const updateToInProgress = async (req, res) => {
    try {
      const {_id } = req.body; // Extract ID from the request body
        console.log("the id found is", _id)
      // Find the photo by ID and update the status to 'in-progress'
      const updatedPhoto = await photoModel.findByIdAndUpdate(
        _id,
        { status: "in-progress" ,
        $push: { timeStamp: new Date() },},
         // Hardcoded status update
        { new: true } // Return the updated document
      );
  
      if (!updatedPhoto) {
        return res.status(404).json({ error: "Photo not found." });
      }
  
      res.status(200).json({
        message: "Photo status updated successfully.",
        photo: updatedPhoto,
      });
    } catch (error) {
      console.error("Error updating photo status:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };

  const updateToResolved = async (req, res) => {
    try {
      const {_id } = req.body; // Extract ID from the request body
        console.log("the id found is", _id)
      // Find the photo by ID and update the status to 'in-progress'
      const updatedPhoto = await photoModel.findByIdAndUpdate(
        _id,
        { status: "resolved" ,
        $push: { timeStamp: new Date() }}, // Hardcoded status update
        { new: true } // Return the updated document
      );
  
      if (!updatedPhoto) {
        return res.status(404).json({ error: "Photo not found." });
      }
  
      res.status(200).json({
        message: "Photo status updated successfully.",
        photo: updatedPhoto,
      });
    } catch (error) {
      console.error("Error updating photo status:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };

  
  // Function to fetch address using OpenCage API
const getAddressFromCoordinates = async (latitude, longitude) => {
    const apiKey = 'e16d386bc84948ff9852f8fbf4bd67db';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
  
    try {
      const response = await axios.get(url);
      const address = response.data.results?.[0]?.formatted || 'Address not found';
      return address;
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Address not found';
    }
  };
  
  // Controller function to handle address retrieval
  const getAddress = async (req, res) => {
    const { latitude, longitude } = req.query;
  
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }
    console.log(latitude, longitude);
  
    try {
      const address = await getAddressFromCoordinates(latitude, longitude);
      console.log('Address lookup result:', { latitude, longitude, address });
      res.json({ address });
    } catch (error) {
      console.error('Error in getAddress:', error);
      res.status(500).json({ error: 'Failed to fetch address', details: error.message });
    }
  };
  


module.exports = { getAllPhotos, getPriorityScore, getPendingReports, getResolvedReports,getInProgressReports, updateToInProgress, updateToResolved, getAddress};
