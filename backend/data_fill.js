const connectToDatabase = require('./mongodb_connect');
const userModel = require('./Models/user');
const photoModel = require('./Models/photo');

async function seedData() {
    try {
        await connectToDatabase();

        // Insert a user
        const user = await userModel.create({ userId: "user_123" });
        console.log("User created:", user);

        // Insert a photo
        const photo = await photoModel.create({
            userId: user._id,
            photoUrl: "https://example.com/photo.jpg",
            longitude: "77.1025",
            latitude: "28.7041",
        });
        console.log("Photo created:", photo);
    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        process.exit();
    }
}

seedData();
