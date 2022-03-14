const mongoose = require('mongoose'); // Create and connect DB
class MongoDBService {
    constructor() {}

    startConnection(hostURL) {
        mongoose.connect(hostURL, this.getDatabaseOptions())

        const db = mongoose.connection
        db.once('open', () => {
            console.log('MongoDB initialised')
        })

        db.once('error', () => {
            console.log('MongoDB could not be initialised')
        })
    }

    getDatabaseOptions() {
        const databasesProperties = {
            useNewUrlParser: true
        }
        return {
            ...databasesProperties,
            useUnifiedTopology: true
        }
    }
}

const mongoService = new MongoDBService();

// export {
//     mongoService
// }
module.exports = {mongoService}