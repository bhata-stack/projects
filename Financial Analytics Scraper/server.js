// Load Node modules
var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');



// Initialise Express
var app = express();


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
    res.render('pages/index');
});

app.get('/index', function (req, res) {
    res.render('pages/index');
});

app.get('/index.html', function (req, res) {
    res.render('pages/index');
});

app.post('/get-data', function (req, res) {
    var spawn = require('child_process').spawn;
    var process = spawn('python', ['./python/scraper.py',
    req.body.symbol,
    req.body.statistic,
    req.body.format
    ]  
    );
    process.stdout.on('data', function (data) {
        res.send(data.toString());
    });
});

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
