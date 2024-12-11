const { admin, db } = require('./config');
const jwt = require('jsonwebtoken'); // Install this package: npm install jsonwebtoken

const SECRET_KEY = "your_jwt_secret_key"; // Use a strong secret key and store it securely (e.g., in environment variables).

const isValidDate = (dateString) => {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // Matches DD-MM-YYYY
    if (!dateRegex.test(dateString)) {
        return false; // Invalid format
    }

    // Additional check for valid day, month, and year
    const [day, month, year] = dateString.split("-").map(Number);
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) {
        return false;
    }

    return true;
};

const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number); // Split and convert to numbers
    return new Date(year, month - 1, day); // Month is zero-indexed
};

class Controller {

    // Register Function with Password Hashing
    async register(req, res) {
        const { name, email, phone, password } = req.body;
    
        try {
            // Check if email already exists
            const emailSnapshot = await db.collection('user').where('email', '==', email).get();
            if (!emailSnapshot.empty) {
                return res.status(400).send({ error: "Email already exists" });
            }
    
            // Generate a document reference for the new user
            const docRef = db.collection('user').doc();
    
            // Save user details
            await docRef.set({
                name,
                email,
                phone,
                password, // NOTE: Consider hashing the password before saving
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
    
            res.status(200).send({ message: "User registered successfully!", userId: docRef.id });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
    

    async login(req, res) {
        const { email, password } = req.body;
        try {
            // Check if the user exists
            const snapshot = await db.collection('user').where('email', '==', email).get();
            if (snapshot.empty) {
                return res.status(401).send({ error: "Invalid email or password" });
            }
    
            // Get user data (assuming email is unique, so only one doc will match)
            const userDoc = snapshot.docs[0];
            const user = userDoc.data();
    
            // Verify the password (compare plain-text)
            if (user.password !== password) {
                return res.status(401).send({ error: "Invalid email or password" });
            }
    
            // Generate JWT token
            const token = jwt.sign(
                { userId: userDoc.id, email: user.email }, // Payload
                SECRET_KEY, // Secret key
                { expiresIn: "1d" } // Token expiration
            );
    
            res.status(200).send({
                message: "Login successful",
                token: token
            });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
    
    

    async getUserDetails(req, res) {
        try {
            const user = req.user; // Access user details from the token
            res.status(200).send({
                message: "User details fetched successfully.",
                user
            });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    async addPlant(req, res) {
        const { name, type, wateringSchedule, fertilizingSchedule, sunlightRequirement, specialCare, purchaseDate, reminderTime } = req.body;
    
        try {
            // Validate reminderTime (time format: HH:mm or HH:mm:ss)
            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
            if (!timeRegex.test(reminderTime)) {
                return res.status(400).send({ error: "Invalid reminderTime format. Must be in HH:mm or HH:mm:ss format." });
            }
    
            // Validate and parse purchaseDate
            if (!isValidDate(purchaseDate)) {
                return res.status(400).send({ error: "Invalid purchaseDate format. Must be in DD-MM-YYYY." });
            }
            const purchaseDateObj = parseDate(purchaseDate);
    
            // Get userId from the verified token
            const createdBy = req.user.userId;
    
            // Save plant details to Firestore
            const plantRef = db.collection('plants').doc();
            await plantRef.set({
                name,
                type,
                wateringSchedule,
                fertilizingSchedule,
                sunlightRequirement,
                specialCare,
                purchaseDate: admin.firestore.Timestamp.fromDate(purchaseDateObj),
                reminderTime, // Store time as a string
                createdBy, // Add createdBy field
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
    
            // Create reminders in Firestore
            const reminders = [
                {
                    heading: 'Water Reminder',
                    text: `${name} needs to be watered at ${reminderTime}`,
                    createdBy,
                    plantId: plantRef.id,
                },
                {
                    heading: 'Special Care Reminder',
                    text: specialCare ? specialCare : `No special care provided for ${name}.`,
                    createdBy,
                    plantId: plantRef.id,
                },
                {
                    heading: 'Sunlight Requirement Reminder',
                    text: `${name} requires ${sunlightRequirement}`,
                    createdBy,
                    plantId: plantRef.id,
                },
            ];
    
            const reminderBatch = db.batch();
            const remindersCollection = db.collection('reminders');
            reminders.forEach((reminder) => {
                const reminderRef = remindersCollection.doc();
                reminderBatch.set(reminderRef, {
                    ...reminder,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                });
            });
    
            await reminderBatch.commit();
    
            res.status(200).send({ message: "Plant and reminders added successfully!", plantId: plantRef.id });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
    

    async getReminders(req, res) {
        try {
            // Get userId from the token (set by verifyToken middleware)
            const userId = req.user.userId;
    
            console.log("Fetching reminders for user ID:", userId);
    
            // Query Firestore for reminders where createdBy matches userId
            const snapshot = await db.collection('reminders').where('createdBy', '==', userId).get();
    
            // Map over documents and return data
            const reminders = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
    
            // Send reminders as response
            res.status(200).send({ reminders });
        } catch (err) {
            console.error("Error fetching reminders:", err);
            res.status(500).send({ error: err.message });
        }
    }
    

    
    
    
    async getUserProducts(req, res) {
        try {
            // Get userId from the token (set by verifyToken middleware)
            const userId = req.user.userId;
    
            // Query Firestore for products where createdBy matches userId
            const snapshot = await db.collection('plants').where('createdBy', '==', userId).get();
    
            // if (snapshot.empty) {
            //     return res.status(200).send({ message: "No products found for this user." });
            // }
    
            // Map over documents and return data
            const products = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
    
            res.status(200).send({ products });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    async getAllRemainders(req, res) {
        const user = req.user;
    
        try {
            // Check if the user has added any plants
            const plantsSnapshot = await db
                .collection('plants')
                .where('createdBy', '==', user.id)
                .get();
    
            if (plantsSnapshot.empty) {
                // If no plants are found for the user
                return res.status(200).send({ message: "No plants added yet. No reminders to show." });
            }
    
            // If the user has plants, fetch reminders
            const remaindersSnapshot = await db.collection('allReminders').get();
    
            const remainders = remaindersSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
    
            res.status(200).send({ remainders });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
    
    
    
}

module.exports = new Controller();
