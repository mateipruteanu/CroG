const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

function showSignedInButtons() {

    const accountButton = document.createElement("button");
    accountButton.className = "topButton";
    accountButton.id = "leftButton";
    accountButton.textContent = "Account";
    accountButton.type = "submit";
    accountButton.formAction = "account";

    const logoutButton = document.createElement("button");
    logoutButton.className = "topButton";
    logoutButton.id = "rightButton";
    logoutButton.textContent = "Log Out";
    logoutButton.type = "submit";
    logoutButton.formAction = "logout";

    leftButton.replaceWith(accountButton);
    rightButton.replaceWith(logoutButton);

}

function showSignedOutButtons() {
    const loginButton = document.createElement("button");
    loginButton.className = "topButton";
    loginButton.id = "leftButton";
    loginButton.textContent = "Login";
    loginButton.type = "submit";
    loginButton.formAction = "login";

    const signupButton = document.createElement("button");
    signupButton.className = "topButton";
    signupButton.id = "rightButton";
    signupButton.textContent = "Sign Up";
    signupButton.type = "submit";
    signupButton.formAction = "signup";

    leftButton.replaceWith(loginButton);
    rightButton.replaceWith(signupButton);
}


export function topButtonManager() {
    console.log("[topButtonManager] cookie: " + document.cookie);
    if (document.cookie.includes("sessionId")) {
        showSignedInButtons();
    } else {
        showSignedOutButtons();
    }
}
