const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CNN ); 

        console.log('Data base on line');

    } catch (error) {
        console.log(error);
        throw new Error("Couldn't initialize data base");
    }
};

module.exports = {
    dbConnection
}