const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

require("dotenv").config();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.SERVER_URL);

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("post", postSchema);

const post1 = new Post({
  title: "New Post",
  content:
    "To add a New Post, Send 'compose' as parameter. You will be redirected to Compose Page.",
});

const defaultItems = [post1];

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.get("/", function (req, res) {
  Post.find({})
    .then(function (foundList) {
      if (foundList.length === 0) {
        Post.create(defaultItems)
          .then(function () {
            console.log("Successfully Inserted");
          })
          .catch(function (err) {
            console.log(err);
          });
        res.redirect("/");
      } else {
        res.render("home", {
          homeStartingContent: homeStartingContent,
          posts: foundList,
        });
      }
    })
    .catch(function (err) {
      console.log("Error! Please try again");
    });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  // console.log(req.body.composeTitle);
  const post = new Post({
    title: req.body.composeTitle,
    content: req.body.composeText,
  });

  post.save();
  res.redirect("/");

  //   const post = {
  //     title: req.body.composeTitle,
  //     content: req.body.composeText,
  //   };
  //   posts.push(post);
  //   res.redirect("/");
});

app.get("/posts/:postId", function (req, res) {
  // console.log(req.params.postName);
  // const requestedTitle = req.params.postName;
  // console.log(req.params.postId);
  const requestedId = req.params.postId;
  // console.log(requestedId);
  Post.findById(requestedId).then(function (foundList) {
    // console.log(foundList);
    res.render("post", {
      postTitle: foundList.title,
      postContent: foundList.content,
      postId: foundList._id,
    });
  });

  // forEach(function (post) {
  //   const storedTitle = post.title;
  //   const storedContent = post.content;
  //   const storedId = post._id;

  //   if (requestedId === storedId) {
  //     // console.log("Match Found");
  //     res.render("post", {
  //       postTitle: storedTitle,
  //       postContent: storedContent,
  //     });
  //   }
  // });
});

app.post("/delete", function (req, res) {
  const postId = req.body.buttonId;
  // console.log(postId);

  Post.findByIdAndRemove(postId)
    .then(function () {
      // console.log("Successfully Deleted");
      res.redirect("/");
    })
    .catch(function (err) {
      console.log("Error! Please try again");
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
