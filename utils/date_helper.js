const date = require('date-and-time');

const dateHelper = {
    // Get Current date in GMT+1
    getCurrentDate: function () {
        const now = new Date();
        const gmtPlusOneDate = date.addHours(now, 1);
        return date.format(gmtPlusOneDate, 'YYYY-MM-DDTHH:mm:ssZ');
    } 
}

module.exports = dateHelper;
