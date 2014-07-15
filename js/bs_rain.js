// javascript for bs_main.html manipulation
teapot = teapot||{};

teapot.rain = function(){
  var no = 50;
  var speed = 15;
  var s, x, y, sn, cs;
  var a, r, cx, cy;
  var i, doc_width, doc_height;

  var init = function(){
    console.log("init rain()");
    doc_width = $(window).width();
    doc_height = $(window).height();
    x = [];//最终的位置
    y = [];
    r = [];
    cx = [];// 起始的位置，position x,y
    cy = [];
    s = 8;//每次改变的距离
    // init rain
    for( i = 0; i< no ; i++){
      a = 0.22;
      r[i] = 1;
      sn = Math.sin(a);// angle to fall, same angle
      cs = Math.cos(a);
      cx[i] = Math.random() * doc_width + 1;
      cy[i] = Math.random() * doc_height + 1;
      x[i] = r[i] * sn + cx[i];
      y[i] = cy[i];
      $(".home").append("<div id=\"dot" + i + "\" style =\"POSITION:absolute; Z-INDEX: " + i +"; VISIBILITY:visible; TOP: 15px; LEFT: 15px;\"><font color=\"white\">l</font></div>");

    }//end of for
  };
  var update_rain = function(){
    var random_seg_len = Math.random();
    if(random_seg_len < 0.5){
      s = 8;
    }
    else{
      s = 4;
    }
    
    r[i] += s;
    x[i] = r[i] * sn + cx[i];
    y[i] = r[i] * cs + cy[i];
  };
  var make_rain = function(){
    r[i] = 1;
    cx[i] = Math.random() * doc_width + 1;
    cy[i] = 1;
    x[i] = r[i] * sn + cx[i];
    y[i] = r[i] * cs + cy[i];
  };
  var rain_drops = function(){
    //console.log("rain.");
    for( i =0; i<no; i++){
      update_rain();
      if((x[i]<=1)||(x[i]>=(doc_width -20))||(y[i]>=(doc_height -20))){
	make_rain();
	doc_width = $(window).width();
	doc_height = $(window).height();
      }
      $("#dot" + i).css('top', y[i]);
      $("#dot" + i).css('left', x[i]);
    }
    setTimeout(rain_drops, speed);
  };
  return function(){
    init();
    rain_drops();
  };
};

$(document).ready(function() {
  console.log("begin rain function");
  
  teapot.rain()();

});




