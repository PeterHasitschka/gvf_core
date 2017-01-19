

class GvfApi{



    constructor(){

        console.log("GVF API created");

        window.addEventListener("initready", function(data){
            console.log("API: Graphworkspace loaded!");
        }, false);
    }

}