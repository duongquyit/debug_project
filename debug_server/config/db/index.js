const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('Connect to database successfully!');
    } catch (error) {
        console.log('Connect to database failures!');
    }
}


module.exports = { connect };