function validate(){
    var username = document.getElementById("username_id").value;
    var password = document.getElementById("password_id").value;
    var repeat_password = document.getElementById("repeat_password_id").value;
    var email = document.getElementById("email_id").value;

  
    if ( username == "" || password == "" || repeat_password == "" || email == ""){
        alert ("Please fill all the fields");
        return false;
    }
    else if (password != repeat_password){
        
        alert ("Passwords do not match");
        return false;
    }
    else{
        // redirect to pages/index.html 
        window.location.href = "/";
        return true;

    }
}
