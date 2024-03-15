const express = require('express');
const dotenv = require('dotenv');
const { isWeekend, isMonday, isFriday, previousMonday, nextFriday, previousFriday, addWeeks, format } = require('date-fns')
dotenv.config();
let app = express();

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

app.listen(process.env.PORT, (error) => {
    error 
        ? console.log(error)
        : console.log('Server running on ' + process.env.PORT);
})
const target = process.env.URL + '?start_date=' + startDate + '&end_date=' + endDate + '&api_key=' + process.env.API_KEY;

app.get('/meteors', async (req, res) => {

    let resp = await fetch(target);
    const data = await resp.json();

    let datum = "Asteroids: " + data["element_count"];
    res.send(datum);
});
