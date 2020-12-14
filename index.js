const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("public"));


app.get("/imageboard", (req,res) => {
    // then i wan to send the cities back as a JSON response
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

app.listen(8080, ()=> console.log("server is listening on 8080"));