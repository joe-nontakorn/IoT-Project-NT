const testing = require('../routers/testing');
const getdata = require('../routers/getdata');

exports.routes = ({ app }) => {

    // Importing all routes
    app.use('/api/v1', testing);
    app.use('/api/v1', getdata);
    
}