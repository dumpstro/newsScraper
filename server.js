var express = require("express");
var exphbs = require("express-handlebars");
//var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
var logger = require("morgan");
var mongoose = require("mongoose");

var PORT = process.env.PORT || 3000;

var Article = require("./articleModel.js")

//Initialize express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

//Database config
// var databaseUrl = "observer";
// var collections = ["scrapedData"];

// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//      console.log("Database Error: ", error);
// });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/observer";

mongoose.connect(MONGODB_URI);

//Routes
app.get("/all", function(req, res) {
    Article.find({}, function(error, found) {
        if (error) {
            console.log(error);
        } else {
            res.json(found);
        }
    })
});

//Retrieve all scrapedData
app.get("/scrape", function(req, res) {
    axios.get("https://www.charlotteobserver.com/news/local").then(function(response) {
    //load the html body from axios into cheerio
        var $ = cheerio.load(response.data);
        //each child element of figure tag
        $("figure").each(function(i, element) {
            var result = {};
            
            // result.title = $(element).children("img").attr("alt");
            result.url = $(element).children("a").attr("href");
            result.blurb = $(element).children("a").attr("title");
            
            Article.create(result).then(function(data) {
                console.log(data);
            }).catch(function(err){
                console.log(err);
            })

            // if (result.title && result.url && result.blurb) {
            //     MONGODB_URI.insert({
            //         title: title,
            //         url: url,
            //         blurb: blurb
            //     },
            //     function(err, inserted) {
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             console.log(inserted);
            //         }
            //     })
            
        
        }) 
    })
    res.send("Scrape Complete");
});

app.listen(PORT, function() {
    console.log("App running on port 3000!")
});

