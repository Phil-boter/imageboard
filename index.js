const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("public"));

// const cities = [
//             {
//                 name: "berlin",
//                 country: "germany"
//             },
//             {
//                 name: "london", 
//                 country: "england"
//             },
//             {
//                 name: "paris",
//                 country: "france"
//             }
//         ];

app.get("/imageboard", (req,res) => {
    // then i wan to sen d the cities back as a JSON response
    // we dont use RENDER for this project
    db.getImgages()
        .then(({rows})=> {
            console.log("rows", rows);
                res.json(rows);
        })
        .catch((err)=> {
            console.log("error",err);
        })

});

app.listen(8080, ()=> console.log("server is listening on 8080"));