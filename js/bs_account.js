// javascript for bs_account.html manipulation

//display project
teapot = teapot||{};
teapot.clear_paragraph = function(){
    $("#paragraph-content").empty();
    $("#paragraph-content").hide();
    window.scrollTo(0,0);
};
teapot.set_paragraph = function(str){
    $("#paragraph-content").append(str);
    $("#paragraph-content").slideDown(1000);
};
teapot.load_account = function(){
    teapot.clear_paragraph();
    var myurl = "/command/get/";
    var mydata = {};
    mydata["name"]= "account";

    teapot.send_data(
	myurl,
	mydata,
	function(responseTxt/* JSON object*/,statusText,xhr){
	    console.log(responseTxt);
	    console.log(responseTxt.content);
	    teapot.set_paragraph(responseTxt.content);
	},
	function(xhr,status,error){
	    console.log(error);
	}
    );    
};
teapot.load_project = function(){
    teapot.clear_paragraph();
    var myurl = "/command/get/";
    var mydata = {};
    mydata["name"]= "project";

    teapot.send_data(
	myurl,
	mydata,
	function(responseTxt/* JSON object*/,statusText,xhr){
	    console.log(responseTxt);
	    console.log(responseTxt.content);
	    teapot.set_paragraph(responseTxt.content);
	},
	function(xhr,status,error){
	    console.log(error);
	}
    );
};

//display account info


// hide project

//hide account info



$(document).ready(function() {
    console.log("begin bs_account function");
    //console.log(document.URL);

    // load project info automatically
    teapot.load_project();

    $("#btn-edit-account").click(function(){
	//bring out account edit form, using ajax
	console.log("edit pressed");
	teapot.load_account();

    });
    
});




