// Load Node modules
var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var {PythonShell} = require('python-shell');
const { parse } = require('path');



// Initialise Express
var app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Render static files
app.use(express.static(__dirname + '/public'));
/*app.use(
    helmet()
  );
app.use(bodyParser.urlencoded({ extended: true })); 
*/
// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 8080));

// *** GET Routes - display pages ***
// Root Route

app.get('/', function (req, res) {
    res.render('pages/index', {'scraped_data': null});
});

app.get('/index', function (req, res) {
    res.render('pages/index', {'scraped_data': null});
});

app.get('/index.html', function (req, res) {
    res.render('pages/index', {'scraped_data': null});
});

function call_scraper(req, res) {
    var options = {
        args:
        [
            req.body.symbol,
            req.body.statistic,
            req.body.format
        ]
    }

    PythonShell.run('./python/scraper.py', options, function (err, data) {
        if (err) res.send(err);
        for (var i = 0; i < data.length; i++) {
            data[i] = data[i].replace("\r", "");
        }
        scraped_data = data.slice(1);
        title_data = data[0];
        scraped_data.forEach(function (point, index) {
            scraped_data[index] = parseFloat(point);
        })
        console.log(scraped_data, title_data)
        res.render('pages/index', {'symbol': req.body.symbol, 'title_data': title_data, 'scraped_data': scraped_data});
    });
}

app.post('/get-data', call_scraper);

/*
app.get('/imposter.pdf', function (req, res) {
    var data = fs.readFileSync(__dirname + '/public/assets/colloquiums/imposter.pdf');
    res.contentType('application/pdf')
    res.send(data);
});
*/

app.listen(process.env.PORT || 8080, function () { 
    console.log("Server is running on", (process.env.PORT || 8080))
});
