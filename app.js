const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title:String,
    content:String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get((req,res)=>{
        Article.find({}).then(result=>{
            res.send(result);
        }).catch(err=>{
            res.send(err);
        });
    })
    .post((req,res)=>{
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save().then(res.send("Article Saved.")).catch(err=>{
            res.send(err)
        });
    })
    .delete((req,res)=>{
        Article.deleteMany().then(res.send("All records were deleted")).catch(err=>{
            res.send(err)
        });
    });

app.route("/articles/:articleTitles")
    .get((req,res)=>{
        Article.findOne({title: req.params.articleTitles}).then(result=>{
            res.send(result);
        });
    })
    .put((req,res)=>{
        Article.findOneAndReplace(
            {title: req.params.articleTitles},
            {title: req.body.title, content: req.body.content},
        ).then(res.send("SUCCED!!"));
    })
    .patch((req,res)=>{
        Article.findOneAndUpdate(
            {title: req.params.articleTitles},
            {title: req.body.title, content: req.body.content},
        ).then(res.send("SUCCED!!"));
    })
    .delete((req,res)=>{
        Article.deleteOne({title: req.params.articleTitles}).then(res.send("Record deleted!!"));
    });

app.listen(3000, function(){
    console.log("Server started on port 3000");
});
