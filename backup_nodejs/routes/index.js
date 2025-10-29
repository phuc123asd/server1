const chatRoute = require('./chat.route');

module.exports = (app) => {
    app.use('/api', chatRoute);
};
