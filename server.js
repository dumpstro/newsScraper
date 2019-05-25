var express = require("express");
var exphbs = require("express-handlebars");
//var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
var logger = require("morgan");
var mongoose = require("mongoose");


var PORT = 3000;

var db = require("./models");

//Initialize express
var app = express();

//Configure Handlebars
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/observer";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

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

//Scrape Charlotte Observer
app.get("/scrape", function(req, res) {
    axios.get("https://www.charlotteobserver.com/news/local").then(function(response) {
    //load the html body from axios into cheerio
        var $ = cheerio.load(response.data);
        //each child element of figure tag
        $("figure").each(function(i, element) {
            var result = {};
            
            //result.img = $(element).children("a").children("img").attr("src");
            result.img = $(element).find("img").attr("src");
            result.url = $(element).children("a").attr("href");
            result.blurb = $(element).children("a").attr("title");
            
           db.Article.create(result).then(function(data) {
                location.reload("/")
                console.log(data)
            }).catch(function(err){
                console.log(err);
            })
        }) 
    })
    res.send("Scrape Complete");
});

//get all articles
app.get("/", function(req, res) {
    db.Article.find({ saved: false }).then(function(dbArticle) {
        var allObject = {
            articles: dbArticle
        }
        res.render("index", allObject)
    }).catch(function(err) {
        console.log(err);
    });
});

//Render saved articles
app.get("/saved", function(req, res) {
    db.Article.find({ saved: true }).then(function(dbArticle) {
        var allObject = {
            articles: dbArticle
        }
        res.render("saved", allObject)
    }).catch(function(err) {
        console.log(err);
    });
});

//Route to save Article
app.put("/articles/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
        .then(function() {
            console.log("Article Saved!")
        }).catch(function(err) {
            res.json(err)
        })
})

//Route to remove Article from Saved
app.put("/removeArticles/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
        .then(function() {
            console.log("Article removed from saved!")
        }).catch(function(err) {
            res.json(err)
        })
})


//Route for grabbing a specific article by id and populate it with it's note
app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function(data) {
            res.json(data);
        }).catch(function(err) {
            res.json(err);
        });
});

//Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        }).catch(function(err) {
            res.json(err);
        });
});

//Route for deleting all articles
app.delete("/deleteArticles", function(req, res) {
    db.Article.deleteMany({ saved: false })
        .then(function() {
            console.log("Articles Deleted")
        }).catch(function(err) {
            res.json(err)
        })
})

//HTML Home
//app.get("/", function(req, res) {
//    res.render("index");
//})

//HTML Saved
app.get("/saved", function(req, res){
    res.render("saved");
})

app.listen(PORT, function() {
    console.log("App running on port 3000!")
});

