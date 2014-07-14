// main.js
//This is the main entry point for the javascript program

args_for_view  = {
    wrapper_name: "wrapper",
    canvas_name:"mycanvas",
    menu_name : "menubar",
    sidebar_name : "sidebar",
    menu_caption : {
	name:"menu_caption",
        width:140,
	height:88,
	img:"/static/images/teapot/Green-Tea.jpg"
    },
    menu_items:[
	{name:"File",sub:[{name:"New"},{name:"Quit"}]}
	,
	{name:"View",sub:[{name:"Zoom Fit"}, {name:"Rotate"}]}
	,
	{name:"Edit"}
	,
	{name:"Tool"}
	,
	{name:"Library"}
	,
	{name:"Help",sub:[{name:"Q&A"},{name:"About"}]}
	],
    sidebar : {
	    
    },
    topbar:{
	name:"topbar",
	height:72
    },
    canvas:{
	name:'mycanvas',
	background_color: 'black'//'whitesmoke'
    }

};

// first function run when page loaded
$(document).ready(function() {
    // initialize view
    var args = args_for_view, file = {};
    teapot.controller.init(args);
    
});


