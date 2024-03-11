const https = require('https');
const dotenv = require('dotenv');
const { isWeekend, isMonday, isFriday, previousMonday, nextFriday, previousFriday, addWeeks, format } = require('date-fns')
dotenv.config();

const now = new Date();
const weekend = isWeekend(now);
const formatDate = 'yyyy-MM-dd';
let start;
let end;

if (weekend) {
    start = previousMonday(now);
    end = previousFriday(now);
} else {
    const previousWeekDay = addWeeks(now, -1);
    start = isMonday(now) ? previousWeekDay : previousMonday(previousWeekDay);
    end = isFriday(now) ? previousWeekDay : nextFriday(previousWeekDay);
}

const startDate = format(start.toLocaleDateString(), formatDate);
const endDate = format(end.toLocaleDateString(), formatDate);

https.get(process.env.URL +'?start_date=' + startDate + '&end_date=' + endDate + '&api_key=' + process.env.API_KEY,
    (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            let parsedJson = JSON.parse(data);
            console.log(parsedJson["element_count"]);
        });
    });
