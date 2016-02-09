var ref = new Firebase("https://brilliant-torch-8379.firebaseio.com");

/// REGISTER
/////////////////////////////////////////////
// Create New User
function newUser() {
  var em = document.getElementById("txtEmail").value,
      pw = document.getElementById("txtPass").value;
  ref.createUser({
    email    : em,
    password : pw
  }, function(error, userData) {
    if (error) {
      switch (error.code) {
        case "EMAIL_TAKEN":
          document.getElementById("alert-detail").innerHTML = "This email address is already in use.";
          break;
        case "INVALID_EMAIL":
          document.getElementById("alert-detail").innerHTML = "The specified email is invalid.";
          break;
        default:
          document.getElementById("alert-detail").innerHTML = "Error creating user:" + error;
      }
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
       // save the user's profile into the database so we can list users,
       // use them in Security and Firebase Rules, and show profiles
       ref.child("users").child(userData.uid).set({
         name: em.replace(/@.*/, '')
       });
       login(em,pw);
    }
  });
}

/// LOGIN
/////////////////////////////////////////////////
// Create a callback to handle the result of the authentication
function authHandler(error, authData) {
  if (error) {
    switch (error.code) {
      case "INVALID_USER":
        document.getElementById("alert-detail").innerHTML = "The specified user account does not exist.";
        break;
      case "INVALID_PASSWORD":
        document.getElementById("alert-detail").innerHTML = "The specified password is incorrect.";
        break;
      default:
        document.getElementById("alert-detail").innerHTML = "Login failed! " + error;
    }
  } else {
    console.log("Authenticated successfully with payload:", authData);
    window.location = "profile.html";
  }
}
// Try to login with email and pass when called
function login(email, pass) {
  var em = document.getElementById("txtLogEmail").value,
      pw = document.getElementById("txtLogPass").value;
  ref.authWithPassword({
    email    : email || em,
    password : pass || pw
  }, authHandler);
}
/// LOGOUT
//////////////////////////////////////
function logout() {
  ref.unauth();
}
/// RESET PASSWORD
/////////////////////////////////////
function iForgot() {
  ref.resetPassword({
  email: document.getElementById("txtLogEmail").value
}, function(error) {
  if (error) {
    switch (error.code) {
      case "INVALID_USER":
        document.getElementById("alert-detail").innerHTML = "The specified user account does not exist for this email address.";
        break;
      default:
        document.getElementById("alert-detail").innerHTML = "Error resetting password:" + error;
    }
  } else {
    document.getElementById("alert-detail").innerHTML = "Password reset email sent successfully! Please check your email for the new password.";
  }
});
}
/// AUTH CHECK
/////////////////////////////////////
// Create a callback which logs the current auth state
function authDataCallback(authData) {
  if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
    window.location = "profile.html";
  } else {
    console.log("User is logged out");
  }
}
// Register the callback to be fired every time auth state changes
ref.onAuth(authDataCallback);

/// Event Initialization
/////////////////////////////////////////
document.getElementById("frmRegister").addEventListener("submit", function(e) {
  e.preventDefault();
  e.stopPropagation();
  newUser();
});
document.getElementById("frmLogin").addEventListener("submit", function(e) {
  e.preventDefault();
  e.stopPropagation();
  login();
});
document.getElementById("iforgot").addEventListener("click", iForgot);
