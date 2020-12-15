console.log("sanity");

new Vue({
    el: "#main", // for div id imagecontainer
    data: {

        title: "",
        description: "",
        username: "",
        image: null,
        images: [], 
    },
    //mountes is a lifecycle method that we can access
    mounted: function(){
        // console.log("my vue componnet haas mounted");
        // console.log("this", this);

        var self = this; // value points to global this above
        axios.get("/imageboard").then(function(response){
            // console.log("self", self); // here we have reference to the global this
            // console.log("response.data", response.data);
            // console.log("this inside then", this);
            self.images = response.data; // import images here from data to self
            // console.log("self images", self.images); // now here it is a array of objects from the global this
        }).catch(function (error){
            console.log("error", error);
        });
    },
        methods: {
            handleFileChange: function (e) {
                // Set the data's "image" property to the newly uploaded file
                this.image = e.target.files[0];
            },
            upload: function (e) {
                // Prevent the default behavior (i.e navigating to a new page on submitting the form)
                e.preventDefault();
                console.log("click");

                var formData = new FormData();

                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("image", this.image);
                
                // 2. Post the form data to the "/upload" route with axios 
                axios.post("/upload", formData)
                .then(res => {
                    console.log("response", res);
                    this.images.unshift(res.data);
                })
                .catch(err => {console.log("error axois upload", err);
                });
                   
               
            },
        },
});