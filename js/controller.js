//controller.js
/**
*
What is control logic? What does it do?
A:
controller 
Controller is a functional unit containing a bunch of Action Methods where each Action Method handles a functional requirement. Do NOT correlate action methods with control events like OnClick, OnChange, OnKeyPress. Rather consider them as what features are being provided by page to end user.
Only Controller has idea about how model, view and user gestures integrate.
*/
// this contains the control interface exposed to user 

teapot = teapot||{};

teapot.controller = (function(){
    var name = "";
    var bSidebarShow = false;

    var callback_default_button = function(){
	//console.log("default button clicked");
	if(bSidebarShow === false){
	    teapot.view.pub_show_sidebar();
	    bSidebarShow = true;
	}
	else{
	    teapot.view.pub_hide_sidebar();
	    bSidebarShow = false;
	}
    };
    return{
	init:function(arg, file){
	    // init view from controller
	    teapot.view.init(arg,file);

	},
	// public method and variable
	on_default_button:function(){
	    callback_default_button();
	}
    };
})();

