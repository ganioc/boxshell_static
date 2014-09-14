// javascript for bs_main.html manipulation
teapot = {};

teapot.HOME ="";
teapot.csrf = $("#get_feed input").attr("value");

if(window.location.host === "127.0.0.1:8000"){
  teapot.HOME = "http://127.0.0.1:8000/";
}
else{
  teapot.HOME = "http://www.boxshell.com/";
}


$.fn.textWidth = function(){
  var html_org = $(this).html();
  var html_calc = '<span>' + html_org + '</span>';
  $(this).html(html_calc);
  var width = $(this).find('span:first').width();
  $(this).html(html_org);
  return width;
};

// recommended method to do animation
window.requestNextAnimationFrame = 
    (function(){
	return window.requestAnimationFrame ||
	    window.webkitRequestAnimationFrame ||
	    window.mozRequestAnimationFrame ||
	    window.msRequestAnimationFrame ||
	    function( callback, element){
		var self = this, start, finish;
		window.setTimeout( function(){
		    start = +new Date();
		    callback(start);
		    finish = +new Date();
		    self.timeout = 1000/60 - (finish - start);
		}, self.timeout);
	    };
    })();

// ajax function to interact with the server
teapot.get_data = function(myurl, mydata/* json data */, success_function,error_function){
    $.ajax({ type:"GET",
	     dataType:"json",
	     url:myurl,
	     data:mydata,
	     success:success_function,
	     error:error_function
	});
};

teapot.send_data = function(myurl, mydata/* json data */, success_function, error_function){
    var data1 = {};
    data1['csrfmiddlewaretoken']= teapot.csrf;
    $.extend(data1,mydata);

    $.ajax({ type:"POST",
	     dataType:"json",
	     url:myurl,
	     data:data1,
	     success:success_function,
	     error:error_function
	});

};
//this is a simple get data ajax call function
teapot.read_data = function(myurl, mydata, success_function){
  $.get(myurl,
        mydata,
        success_function,
        "json");
};

// end of ajax function

teapot.is_command_link = function(str){
    if(str.search('/command/')!== -1){
	return true;
    }
    else{
	return false;
    }
};
teapot.menu_activate = function(str){
    var link = teapot.HOME;
    console.log("into menu_activate");

    $("#nav_menu li").removeClass("active");

    if( teapot.is_command_link(str)){
	return false;
    }
    else if( str === link){
	$("#menu_home").addClass("active");
    }
    else if( str === link + "register/"){
	$("#menu_" + "signin").addClass("active");
    }
    else{
	var directory = str.replace(link,"");
	var key_word = directory.replace('/',"").toLowerCase();
	$("#menu_" + key_word).addClass("active");
    }
    console.log("out of menu_activate");
};

$(document).ready(function() {
    console.log("begin bs function");
    console.log(document.URL);

    // highlight active menu
    teapot.menu_activate(document.URL);

    $("#switch_english").click(function(){
    	console.log("switch english");
    	teapot.read_data("/switch_language/",
    			 {language:"english"},
    			 function(data, status){
    			     console.log(data);
    			     window.location.reload();
    			 });
    });

    $("#switch_chinese").click(function(){
    	console.log("switch chinese");
    	teapot.read_data("/switch_language/",
    			 {language:"chinese"},
    			 function(data, status){
    			     console.log(data);
    			     window.location.reload();
    			 });
    });
});




