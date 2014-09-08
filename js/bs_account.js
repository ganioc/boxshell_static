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
// this would be a modal dialog
teapot.get_project_name = function(){
    $("#dlg_project").modal("show");
    return false;
};
teapot.get_file_name = function(){
    $("#dlg_file").modal("show");
    return false;
};
teapot.set_callback = function(){
    $("#btn_edit_account").tooltip();

    if($("#file_table")){

	// add all callback functions
	$("#btn_add_file").tooltip().click(function(){
	    console.log("add file pressed");
	    teapot.get_file_name();
	});
	$("#file_list tr td a").click(function(){
	    console.log("file be clicked:" + $(this).html());
	    var filetype = $("#file_list tr td a").parent().next().next().html().trim();
	    var project = $('ol.breadcrumb li.active').html().trim();
	    // var temp = $(this).html();
	    // teapot.load_file(temp.trim());
	    window.open('/' + filetype  + "/" + project + "/" + $(this).html());
	});
    }

    // if project in paragraph, 
    if($("#project_table")){

	$("#btn_add_project").tooltip().click(function(){
	    console.log("add project");
	    teapot.get_project_name();

	});
	
	$("#btn_dlg_project").click(function(){
	    
	    console.log("leave dlg");
	    var name = $("#input_dlg_project").val().split(/[ ,]+/)[0];
	    if(name){
		$("#dlg_project").modal("toggle");
		// name is the project_name
		// use ajax to create a project
		var myurl = "/command/set/";
		var mydata = {};
		mydata["name"]="create_project";
		mydata["content"]= name;
		teapot.send_data(
		    myurl,
		    mydata,
		    function(responseTxt/* JSON object*/,statusText,xhr){
			//teapot.load_account();
			console.log(responseTxt);
			teapot.load_project();
		    },
		    function(xhr,status,error){
			console.log(error);
		    }
		);
	    }
	    else{
		console.log("invalid name");
		
	    }
	});

	$("#project_list tr td a").click(function(){
	    console.log("project be clicked:" + $(this).html());
	    var temp = $(this).html();
	    teapot.load_file(temp.trim());
	});
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
    $("#paragraph-content").slideDown(500);
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
teapot.load_file = function(project){
    teapot.clear_paragraph();
    var myurl = "/command/get/";
    var mydata = {};
    mydata["name"]= "file";
    mydata["content"] = project;

    teapot.send_data(
	myurl,
	mydata,
	function(responseTxt/* JSON object*/,statusText,xhr){
	    console.log(responseTxt);
	    console.log(responseTxt.content);
	    teapot.clear_paragraph();
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
    
    $("#btn_dlg_file").click(function(e){
	console.log("leave dlg pressed");
	var name = $("#input_dlg_file").val().split(/[ ,]+/)[0];
	var project = $('ol.breadcrumb li.active').html();
	$("#dlg_file").modal("hide");
	e.stopPropagation();
	if(name){
	    var myurl = "/command/set/";
	    var mydata = {};
	    var temp = {};
	    temp["name"] = name;
	    temp["type"] = $('input[name=radio_file_type]:checked').val();
	    temp["description"] = $("#input_dlg_file_description").val();
	    temp["project"] = project;
	    mydata["name"]="create_file";
	    mydata["content"]= JSON.stringify(temp);
	    teapot.send_data(
	        myurl,
	        mydata,
	        function(responseTxt/* JSON object*/,statusText,xhr){
	    	    //teapot.load_account();
	    	    console.log(responseTxt);
	    	    teapot.load_file(project);
	        },
	        function(xhr,status,error){
	    	    console.log(error);
	        }
	    );
	}
	else{
	    console.log("invalid name");
	}
    });

    // load project info automatically, default behavior
    teapot.load_project();

    $("#btn_edit_account").click(function(){
	//bring out account edit form, using ajax
	console.log("edit pressed");
	teapot.load_account();

    });


    
});




