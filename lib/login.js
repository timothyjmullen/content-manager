var ref = new Firebase("https://brilliant-torch-8379.firebaseio.com");

/// REGISTER
/////////////////////////////////////////////
// Create New User
function newUser() {
  var em = document.getElementById("txtEmail").value,
      pw = document.getElementById("txtPass").value,
      pw2 = document.getElementById("txtPass2").value,
      name = document.getElementById("txtName").value;
  if (pw != pw2) {
    document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> Password fields must match.";
    document.getElementById("alert").className = "alert alert-warning";
    return;
  }
  ref.createUser({
    email    : em,
    password : pw
  }, function(error, userData) {
    if (error) {
      switch (error.code) {
        case "EMAIL_TAKEN":
          document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> This email address is already in use.";
          document.getElementById("alert").className = "alert alert-warning";
          break;
        case "INVALID_EMAIL":
          document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> The specified email is invalid.";
          document.getElementById("alert").className = "alert alert-warning";
          break;
        default:
          document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> Error creating user:" + error;
          document.getElementById("alert").className = "alert alert-warning";
      }
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
       // save the user's profile into the database so we can list users,
       // use them in Security and Firebase Rules, and show profiles
       ref.child("users").child(userData.uid).set({
         name: name || em.replace(/@.*/, '')
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
        document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> The specified user account does not exist.";
        document.getElementById("alert").className = "alert alert-warning";
        break;
      case "INVALID_PASSWORD":
        document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> The specified password is incorrect.";
        document.getElementById("alert").className = "alert alert-warning";
        break;
      default:
        document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> Login failed! " + error;
        document.getElementById("alert").className = "alert alert-warning";
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
        document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> The specified user account does not exist for this email address.";
        document.getElementById("alert").className = "alert alert-warning";
        break;
      default:
        document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> Error resetting password:" + error;
        document.getElementById("alert").className = "alert alert-warning";
    }
  } else {
    document.getElementById("alert").innerHTML = '<span class=\"glyphicon glyphicon-ok-circle\" aria-hidden=\"true\"></span> We just sent you a new password! It should arrive in your inbox at'+ email + ' shortly.';
    document.getElementById("alert").className = "alert alert-success";
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

/// TOGGLE REGISTRATION/LOGIN
/////////////////////////////////////////
function regorlogSwap() {
  var log = document.getElementById('frmLogin'),
      reg = document.getElementById('frmRegister'),
      btn = document.getElementById('regorlog');
  if (/Register/.test(btn.innerHTML)) {
    btn.innerHTML = 'Login';
    log.className = 'hide';
    reg.className = '';
    document.getElementById("alert").innerHTML = 'All fields required.';
    document.getElementById("alert").className = "alert";
  } else {
    btn.innerHTML = 'Register';
    reg.className = 'hide';
    log.className  = '';
    document.getElementById("alert").innerHTML = '';
    document.getElementById("alert").className = "alert";
  }
}

/// EVENT INIT
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
document.getElementById("regorlog").addEventListener("click", regorlogSwap);
