const express = require("express");
const app = express();
const db = require("./db");
const path = require("path");
const multer = require("multer");
const uidSafe = require("uid-safe");
// const s3 = require("./s3");


// Multer configurations ------------------------------------------------------
// Specify file names and destinations
app.use(express.static("./public"));
app.use(express.static("./uploads"));

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



app.get("/imageboard", (req,res) => {
    // then i want to send the cities back as a JSON response
    // we dont use RENDER for this project
    db.getImgages()
        .then(({rows}) => {
            console.log("rows", rows);
                res.json(rows);
        })
        .catch((err)=> {
            console.log("error",err);
        })

});

// "/upload" POST route to handle the image upload ---------------------------- referes index.html Form action="/upload"
// TODO - Add multer as a middleware for the route below
app.post("/upload",upload.single("image"),  (req, res) => {  //s3.upload,
    console.log("post request is coming");
    console.log("FILE:", req.file);
    console.log("FILE:", req.file.path);

    // TODO - Send an appropriate response to signify success or failure
    if (req.file) {
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});



app.listen(8080, ()=> console.log("server is listening on 8080"));