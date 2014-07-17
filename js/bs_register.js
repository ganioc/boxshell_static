// javascript for bs_register.html manipulation
function mark_error(name){
  $("#"+name).parent().addClass("has-error");
  $("#"+name).next().addClass("glyphicon-remove");
  $("#"+name).next().next().fadeIn();
  
}
function clear_error(name){
  $("#"+name).parent().removeClass("has-error has-success");
  $("#"+name).next().removeClass("glyphicon-remove glyphicon-ok");
  $("#"+name).next().next().fadeOut();


}
function mark_success(name){
  $("#"+name).parent().addClass("has-success");
  $("#"+name).next().addClass("glyphicon-ok");
  $("#"+name).next().next().fadeOut();


}
function validate_pattern(name,pattern){
  //var pattern = /^[A-Za-z]+[A-Za-z0-9-_]*$/;
  if(name.search(pattern) === 0){
    return true;
  }
  else{
    return false;
  }
}
function validate_username(){
  var name = $("#name_register").val();
  return validate_pattern(name,/^[A-Za-z]+[A-Za-z0-9-_]*$/);
}
function validate_emailaddress(){
  var address = $("#email_register").val();
  return validate_pattern(address,/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

}
function validate_password(){
  var pwd = $("#pwd_register").val();
  
}
function validate_password2(){
  var pwd = $("#pwd2_register");
  
}

function validate(){
  
  console.log($("#name_register").val());
  // check name大小写字母和下划线数字,长度小于29,无空格
  if(validate_username() === false){
    mark_error("name_register");
  }
  
  console.log($("#email_register").val());
  // check mail address

  console.log($("#pwd_register").val());
  // check password

  console.log($("#pwd2_register").val());
  // check if equal password

  console.log($("#checkbox_terms").prop("checked"));

  return false;

}

$(document).ready(function() {
    // console.log("begin bs_register function");
    // console.log(document.URL);
  //check
  $("#name_register").keyup(function(e){
    console.log(e.target.id);
    if(validate_username()===true){
      clear_error("name_register");
      mark_success("name_register");
    }
    else{
      clear_error("name_register");
      mark_error("name_register");
    }
  });
  

});




