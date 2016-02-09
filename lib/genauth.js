var ref = new Firebase("https://brilliant-torch-8379.firebaseio.com"), gravatar;
/// LOGOUT
//////////////////////////////////////
function logout() {
  ref.unauth();
}
/// AUTH CHECK
/////////////////////////////////////
// Create a callback which logs the current auth state
function authDataCallback(authData) {
  if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
    console.log(JSON.stringify(authData))
    gravatar = authData.password.profileImageURL;
  } else {
    console.log("User is logged out");
    window.location = "login.html";
  }
}
// Register the callback to be fired every time auth state changes
ref.onAuth(authDataCallback);

window.onload = function() {
  document.getElementById("logout").addEventListener("click", logout);
  document.getElementById("dLabel").innerHTML = "<img src=\"" + gravatar + "\"/>&#160;<span class=\"glyphicon glyphicon-triangle-bottom\"></span>";
}
