
const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        console.log('grtting some error here ....')
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
