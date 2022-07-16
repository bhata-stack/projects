// Load Node modules
var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var {PythonShell} = require('python-shell');



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

const csvStringToArray = strData =>
{
    const objPattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\\,\\r\\n]*))"),"gi");
    let arrMatches = null, arrData = [[]];
    while (arrMatches = objPattern.exec(strData)){
        if (arrMatches[1].length && arrMatches[1] !== ",")arrData.push([]);
        arrData[arrData.length - 1].push(arrMatches[2] ? 
            arrMatches[2].replace(new RegExp( "\"\"", "g" ), "\"") :
            arrMatches[3]);
    }
    return arrData;
}

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
        data = data.toString();
        data = csvStringToArray(data)
        console.log(data)
        res.render('pages/index', {'scraped_data': data});
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
