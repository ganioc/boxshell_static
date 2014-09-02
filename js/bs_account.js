// javascript for bs_account.html manipulation

//display project
teapot = teapot||{};
teapot.get_account_data = function(){
    var data={};

    var temp = teapot.control_select_read("account_gender");
    data["gender"] = temp;

    temp = $("#account_avatar").val();
    if(temp){
	data["avatar"]=temp;
    }
    temp = $("#account_country").val();
    if(temp){
	data["country"]=temp;
     }   
    temp = $("#account_city").val();
    if(temp){
	data["city"]=temp;
     }   
    temp = $("#account_location").val();
    if(temp){
	data["location"]=temp;
     }
    temp = $("#account_website1").val();
    if(temp){
	data["website1"]=temp;
     }
    temp = $("#account_company").val();
    if(temp){
	data["company"]=temp;
     }
    temp = $("#account_occupation").val();
    if(temp){
	data["occupation"]=temp;
     }
    temp = $("#account_introduction").val();
    if(temp){
	data["introduction"]=temp;
     }    

    return JSON.stringify(data);
};
teapot.set_account_data = function(){
    var set_val = function( ctrl){
	var temp = $("#account_" + ctrl);
	temp.val(temp.attr("value"));

    };
    var gender = $("#account_gender").attr("value");
    if(!gender){
	gender = "unclear";
    }
    teapot.control_select_write("account_gender",gender);
    
    set_val("avatar");
    set_val("country");
    set_val("city");
    set_val("location");
    set_val("website1");
    set_val("company");
    set_val("occupation");
    set_val("introduction");

};
teapot.set_callback = function(){
    // if project in paragraph, 
    if($("#project_table")){
	$("#btn_add_project").click(function(){
	    console.log("add project");
	    
	});
	$("#btn_add_project").tooltip();

    }

    // if account in paragraph,
    if($("#form_account")){
	$("#account_leave").click(function(e){
	    teapot.load_project();
	});
	$("#account_save").click(function(e){
	    // use ajax to update user account
	    var myurl = "/command/set/";
	    var mydata = {};
	    mydata["name"]="account";
	    mydata["content"]= teapot.get_account_data();
	    teapot.send_data(
		myurl,
		mydata,
		function(responseTxt/* JSON object*/,statusText,xhr){
		    //teapot.load_account();
		    console.log(responseTxt);
		    
		},
		function(xhr,status,error){
		    console.log(error);
		}
	    );	    
	});	
    }
};
teapot.validate = function(){
    return true;
};
teapot.control_select_write = function(ctrl,option){
    $("#" + ctrl + " option" ).filter(function(){
	return $(this).text().toLowerCase() === option;
    }).prop('selected',true);

};
teapot.control_select_read = function(ctrl){
    return $("#" + ctrl ).val().toLowerCase();

};
teapot.clear_paragraph = function(){
    $("#paragraph-content").empty();
    $("#paragraph-content").hide();
    window.scrollTo(0,0);
};

teapot.set_paragraph = function(str){
    $("#paragraph-content").append(str);
    teapot.set_callback();
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
	    //console.log(responseTxt);
	    //console.log(responseTxt.content);
	    teapot.set_paragraph(responseTxt.content);
	    //teapot.set_account_feedback();
	    // set select control according to embedded value
	    teapot.set_account_data();
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

    // load project info automatically, default behavior
    teapot.load_project();

    $("#btn-edit-account").click(function(){
	//bring out account edit form, using ajax
	console.log("edit pressed");
	teapot.load_account();

    });
    
});




