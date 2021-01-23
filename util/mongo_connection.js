const mongoose = require('mongoose')

// Connection to MongoDB
const connection = mongoose.connect(process.env.DBCONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err, client) => {
    if(err)
        console.error(err)
    else
        console.log("Connected to MongoDB")
})

module.exports = {connection}