// javascript for bs_signin.html manipulation
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
function validate_emailaddress(){
    var address = $("#email_signin").val();
    if(address.length > 60){
	return false;
    }
    else
	return validate_pattern(address,/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

}

function validate_password(){
    var pwd = $("#pwd_signin").val();
    if(pwd.length <3 || pwd.length > 40){
	return false;
    }
    else
	return true;
}

function check_warning(name){
    if( name === "checkbox_terms"){
	return !$("#checkbox_terms").prop('checked');
    }
    //else
    if( $("#"+name).next().next().css("display") === "block")
	return true;
    else
	return false;
}
// this function is for submit button checking
function validate(){
    if(check_warning("email_signin") === false &&
       check_warning("pwd_signin") === false ){
	return true;
    }
    return false;
}
function keyup_callback(){
    var validate_input = {
	'email_signin':validate_emailaddress,
	'pwd_signin':validate_password
    };
    return function(e){
	if(validate_input[e.target.id]()===true){
	    if(check_warning(e.target.id) === true){
		clear_error(e.target.id);
		mark_success(e.target.id);
	    }
	    else 
		mark_success(e.target.id);
	}
	else{
	    if( check_warning(e.target.id) === false){
		clear_error(e.target.id);
		mark_error(e.target.id);
	    }
	    else
		mark_error(e.target.id);
	}
    };
}
$(document).ready(function() {
    // console.log("begin bs_register function");
    // console.log(document.URL);
    //check
    $("#email_signin").keyup(keyup_callback()).bind('paste',keyup_callback());
    $("#pwd_signin").keyup(keyup_callback()).bind('paste',keyup_callback());

    keyup_callback()({target:{id:"email_signin"}});
    keyup_callback()({target:{id:"pwd_signin"}});
    $("#email_signin").focus();
});



