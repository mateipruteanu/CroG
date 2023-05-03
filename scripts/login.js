var attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.
function validate(){
    var username = document.getElementById("username_id").value;
    var password = document.getElementById("password_id").value;
    if ( username == "123" && password == "123"){

        window.location = "/"; // Redirecting to other page.
        return false;
    }
  
}