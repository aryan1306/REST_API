const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);
//////////////////Route targeting all the articles///////////////////////////////
app.route("/articles")

.get(function(req, res){
    Article.find({}, function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        }
        else{
            res.send(err);
        }
    });
})

.post(function(req,res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Sucessfully added new article");
            console.log("Added article to database");
            
        }else{
            console.log(err);
        }
    });
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Sucessfully deleted the article");
        }
        else{
            res.send(err);
        }
    });
});

////////////////////////Route targeting a specific article///////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
    const articleTitle = req.params.articleTitle;
    Article.findOne({title: articleTitle}, function(err, foundArticle){
    if(!err){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("Found no articles with that title")
        }
    }
});
})

.put(function(req,res){
    const articleTitle = req.params.articleTitle;
    Article.update(
        {title: articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err, updatedArticle){
            if(!err){
                res.send("Article sucessfully updated!")
            }
        }
    )
})

.patch(function(req,res){
    const articleTitle = req.params.articleTitle;
    Article.update(
        {title: articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Sucuessfully updated article");
            }else{
                res.send(err);
            }
        }
    )
})

.delete(function(req,res){
    const articleTitle = req.params.articleTitle;
    Article.deleteOne(
        {title: articleTitle},
        function(err){
            if(!err){
                res.send("Sucessfully deleted article");
            }else{
                res.send(err);
            }
        }
    )
});

app.listen(3001, function () {
    console.log("Server started on port 3001");
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to Database");
});