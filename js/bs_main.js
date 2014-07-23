// javascript for bs_main.html manipulation

// moving direction:
// from left to right
// move up or down
// from right to left
var h_percent = 0;
var v_percent = 0;
var moving_direction_h = 1;
var moving_direction_v = 1;
var moving_direction_h_speed = 0.15;
var moving_direction_v_speed = 0.05;
//var moving_time_delta = 40;

function change_background(){
    var moving_background_directory = "url(/static/images/xxx)";
    // no-repeat";
    var moving_background_pics=[
	"grassland_1920.jpg",
	"blue_sky.jpg",
	"city_bridge_1920_600.jpg",
	"city_1920.jpg"
    ];
    function get_index(){
	var num = moving_background_pics.length;
	var index =  Math.floor(num*Math.random());
	return index;
    }
    var index = get_index();
    $("#head").css("background",moving_background_directory.replace(/xxx/,moving_background_pics[index]));

}

function move_image_position(){
    h_percent = h_percent + moving_direction_h * moving_direction_h_speed;
    v_percent = v_percent + moving_direction_v * moving_direction_v_speed;
    //var w = window.innerWidth;

    if(h_percent > 100){
	h_percent = 100;
	moving_direction_h = -moving_direction_h;
	change_background();
    }
    else if(h_percent < 0){
	h_percent = 0;
	moving_direction_h = -moving_direction_h;
	change_background();
    }
    else if(v_percent > 100){
	v_percent = 100;
	moving_direction_v = -moving_direction_v;
    }
    else if(v_percent < 0){
	v_percent = 0;
	moving_direction_v = -moving_direction_v;
    }
    $("#head").css("background-position", h_percent + "% " + v_percent + "%");
    window.requestNextAnimationFrame(move_image_position);
}
$(document).ready(function() {
    console.log("begin bs_main function");

    // play some animation by change background image's position
    change_background();
    //setTimeout(move_image_position, moving_time_delta);
    window.requestNextAnimationFrame(move_image_position);
});






