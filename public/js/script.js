// const { EMRcontainers } = require("aws-sdk");

(function () {
console.log("sanity");

Vue.component("modal-component", {
    template: "#modal",
    props: ["imageId"],
    data: function() {
        return {
            image: {
                    id: '',
                    url: '',
                    username: '',
                    title: '',
                    description: '',
                    created_at: '',
            },
        };
    },
    mounted: function() {
        var self = this;

        axios.get(`/singleImage/` + this.imageId)
             .then(function(res){
                console.log("axios getImage");
                console.log("res.data",res.data)
                self.image.id = res.data[0].id;
                self.image.url = res.data[0].url;
                self.image.title = res.data[0].title;
                self.image.description = res.data[0].description;
                self.image.username = res.data[0].username;               
            })
            .catch((err) => {
                console.log("error in get singleImage", err);
                this.$emit("close");
            })
    },
    methods: {
        closeModal: function() {
            this.$emit("close");
        }
    }
});



new Vue({
    el: "#main", // for div id imagecontainer
    data: {
        title: "",
        description: "",
        username: "",
        image: null,
        images: [],
        imageId: null, // show up the modal set to null --> modal will disappear
        showMore: true,
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
                    if(res.data.success){
                        // console.log("response", res.data);
                        this.images.unshift(res.data);
                    }

                })
                .catch(err => {console.log("error axois upload", err);
                });
                                 
            },
            showComponent: function(id) {
                console.log("click show up modal");
                console.log("this.imageId", this.imageId); 
                this.imageId = id;

                console.log("this.imageId", this.imageId); 
       
            },
            closeComponent: function() {
                console.log('closeMe in the instance / parent is running! This was emitted from the component');
                this.imageId = null;
            },
            getMoreImages: function() {
                const lastId = this.images[this.images.length -1].id;
                console.log("lastId", lastId);
                var self = this;
                axios.get("/getMoreImages/" + lastId)
                    .then(function(res) {
                        self.images.push.apply(self.images, res.data);

                        if(res.data == 0) {
                            self.showMore = false;
                        }
                    })
                    .catch((err) => {
                        console.log("error getMoreImages", err);
                    })
            }
        },
});



})();