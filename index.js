const express = require("express");
const app = express();
const db = require("./db");
const path = require("path");
const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");
const { s3Url } = require("./config.json");


// Multer configurations ------------------------------------------------------
// Specify file names and destinations

// app.use(express.static("./uploads"));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then((uid) => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const upload = multer({
    storage: diskStorage,
    limits: {
        // Set a file size limit to prevent users from uploading huge files and to protect against DOS attacks
        fileSize: 2097152,
    },
});


app.use(express.json({extended: false}));


app.get("/imageboard", (req,res) => {
    console.log("get imageBoard");
    // then i want to send the cities back as a JSON response
    db.getImgages()
        .then(({rows}) => {
            // console.log("rows", rows);
                res.json(rows);
        })
        .catch((err)=> {
            console.log("error",err);
        })

});

// "/upload" POST route to handle the image upload ----------------------------

app.post("/upload",upload.single("image"),s3.upload,  (req, res) => { 
    console.log("post request is coming");
    console.log("FILE:", req.file);
    console.log("FILE:", req.file.filename);

    if (req.file) {
        let uploadedImage = {
            url: "https://s3.amazonaws.com/spicedling/" + req.file.filename,
            title: req.body.title,
            username: req.body.username,
            description: req.body.description,
        }


        db.uploadImage(
            uploadedImage.url,
            uploadedImage.username,
            uploadedImage.title,
            uploadedImage.description
        )
        .then(res.json({
                uploadedImage,
                success: true,
            })
        )
        .catch((err) => {
            console.log("Error in uploadImage", err);
        })
    } else {
        res.json({
            success: false
        });
    }
});



app.get("/singleImage/:id", (req, res) => {
    console.log("get singleImage");
    // console.log("get singleImage", req.params.id);

    const id = req.params.id;
    db.getSingleImage(id)
        .then(({rows}) => {
            // console.log("rows:",rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in GET/getSingsImage ", err);
        });
});
app.get("/getMoreImages/:id", (req,res) => {
    console.log("GET getMoreImages");
    const lastId = req.params.id;
    db.getMoreImages(lastId)
        .then(({rows})=> {
            // console.log("rows", rows);
            res.json(rows);
        })
        .catch((err)=> {
            console.log("error in getMoreImages", err);
        })
});

app.get("/comments/:imageId", (req,res)=> {
    console.log("GET comments");
    console.log("req.params GET/comments",req.params);
    db.getComments(req.params.imageId)
        .then(({rows}) => {
            console.log("rows get", rows);
            res.json(rows)
    })
    .catch((err)=> {
            console.log("error in getComments", err);
        });
});

app.post("/sendComment", (req,res)=> {
    console.log("POST sendComment");
    console.log("req.body sendcomment",req.body);
    const {  comment, username, imageId } = req.body;
    console.log("user", username);
      console.log("comment", comment);
        console.log("imageId", imageId);
    db.saveComment(comment, username, imageId)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((err) => {
            console.error("error on db.sendComment: ", err);
        });
})

app.use(express.static("./public"));

app.listen(8080, ()=> console.log("server is listening on 8080"));