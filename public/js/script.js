console.log("sanity");

new Vue({
    el: ".imagecontainer", // for div id imagecontainer
    data: {
        images: []
    },
    //mountes is a lifecycle method that we can access
    mounted: function(){
        // console.log("my vue componnet haas mounted");
        console.log("this", this);

        var self = this; // value points to global this above
        axios.get("/imageboard").then(function(response){
            console.log("self", self); // here we have reference to the global this
            console.log("response.data", response.data);
            console.log("this inside then", this);
            // this.cities = response.data;
            self.images = response.data; // import images here from data to self
            console.log("self images", self.images); // now here it is a array of objects from the global this
        }).catch(function (error){
            console.log("error", error);
        });
    }
})
