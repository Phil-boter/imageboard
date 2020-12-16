const express = require("express");
const app = express();
const db = require("./db");
const path = require("path");
const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");


// Multer configurations ------------------------------------------------------
// Specify file names and destinations
app.use(express.static("./public"));
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



app.get("/imageboard", (req,res) => {
    // then i want to send the cities back as a JSON response
    db.getImgages()
        .then(({rows}) => {
            console.log("rows", rows);
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



app.listen(8080, ()=> console.log("server is listening on 8080"));