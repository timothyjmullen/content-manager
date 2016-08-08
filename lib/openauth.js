var ref = firebase, auth = firebase.auth(), gravatar, name, email,uid;
/// LOGOUT
//////////////////////////////////////
function logout() {
  auth().signOut().then(function() {
    // Sign-out successful.
    console.log("User is logged out");
    window.location = "login";
  }, function(error) {
    // An error happened.
    console.log('Something went wrong with the logout procedure...');
  });
}
/// AUTH CHECK
/////////////////////////////////////
// Create a callback which logs the current auth state
function initApp() {

  // Register the callback to be fired every time auth state changes
  auth.onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in
      console.log('authstatechange');
      email = user.email;
      uid = user.uid;
      gravatar = user.photoURL || 'https://www.gravatar.com/avatar/' + calcMD5(email.replace(/^[\s]*|[\s]*$/g, '').toLowerCase()) + '?d=retro';
      name = user.displayName || email;
      document.getElementById("dLabel").innerHTML = "<img src=\"" + gravatar
       + "\"/><span class=\"hidden-xs\" id=\"uname\">&#160;&#160;" + name + "&#160;</span><span class=\"caret\"></span>";
      if(uid) {
          firebase.database().ref('users/' + uid ).on('value', function(snapshot) {
          snap = snapshot.val();
          uteams = snap.teams;
          if (snap.role == 'a') {
            $("#dList").prepend('<li><a href="admin">Admin Tools</a></li>');
          }
        });
      }
    } else {
      // User logged out
      console.log("User is logged out");
      document.getElementById("navProf").innerHTML = "<a href=\"login\" style=\"line-height:45px;\">Login</a>";
    }
  });
}



window.onload = function() {
initApp();
}
