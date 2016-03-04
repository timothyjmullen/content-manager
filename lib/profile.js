
  var uname = document.getElementById('txtName'),
      em = document.getElementById('txtEmail'),
      cpw = document.getElementById('txtPassUp');

// UPDATE PROFILE VALUES
//*********************************
function updateProfile() {
  if (uname.value != name) {
    ref.child("users").child(btoa(email)).update({
      name: uname.value
    }, function(error) {
      if (error) {
        document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> Error updating profile information. Please let us know this happened and we will investigate the incident.";
        document.getElementById("alert").className = "alert alert-warning";
      } else {
        document.getElementById("alert").innerHTML = '<span class=\"glyphicon glyphicon-ok-circle\" aria-hidden=\"true\"></span> Your profile information has updated successfully.';
        document.getElementById("alert").className = "alert alert-success";
        document.getElementById("uname").innerHTML = uname.value;
        name = uname.value;
      }
    });
  }
  if (em.value != email) {
    ref.changeEmail({
      oldEmail: email,
      newEmail: em.value,
      password: cpw.value
      }, function(error) {
        if (error) {
          document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> Error updating profile information. Please let us know this happened and we will investigate the incident.";
          document.getElementById("alert").className = "alert alert-warning";
        } else {
          document.getElementById("alert").innerHTML = '<span class=\"glyphicon glyphicon-ok-circle\" aria-hidden=\"true\"></span> Your profile information has updated successfully.';
          document.getElementById("alert").className = "alert alert-success";
      }
    });
  }
}

// UPDATE USER PASS
//*********************************
function updatePass() {
  var pw = document.getElementById("txtPass").value,
      pw2 = document.getElementById("txtPass2").value,
      pw3 = document.getElementById("txtPass3").value;
  if (pw2 != pw3) {
    document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> New password fields must match.";
    document.getElementById("alert").className = "alert alert-warning";
    return;
  }
  ref.changePassword({
    email: email,
    oldPassword: pw,
    newPassword: pw3
  }, function(error) {
    if (error) {
      switch (error.code) {
        case "INVALID_PASSWORD":
          document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> The specified user account password is incorrect.";
          document.getElementById("alert").className = "alert alert-warning";
          break;
        default:
          document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> Error updating profile information. Please let us know this happened and we will investigate the incident.";
          document.getElementById("alert").className = "alert alert-warning";
      }
    } else {
      document.getElementById("alert").innerHTML = '<span class=\"glyphicon glyphicon-ok-circle\" aria-hidden=\"true\"></span> Your password has updated successfully.';
      document.getElementById("alert").className = "alert alert-success";
      pw = '';
      pw2 = '';
      pw3 = '';
    }
  });
}

function teamList(teams) {
  var tSel = document.getElementById("teamSelect"),
      x = "", optEl = {};
  for (x in teams) {
    // GET TEAM NAME
    ref.child("teams/" + x).once("value", function(data) {
      optEl = document.createElement('option');
      optEl.innerHTML = data.val().name;
      tSel.appendChild(optEl);
    });
  }
}

function teamInit() {
  var tSel = document.getElementById("teamSelect");
  // CLEAR FORMS
  tSel.innerHTML = '';
  // GET USER TEAM DATA
  ref.child("users/" + btoa(email) + "/teams").once("value", function(x) {
    teamList(x.val());
  });
}

ref.child("users").child(btoa(email)).child("name").once("value", function(x) {
    name = x.val();
    uname.value = name;
    document.getElementById("grav").innerHTML = "<img src=\"" + gravatar + "\"/>";
    document.getElementById("loading").className = 'loading hide';
    document.getElementById("load-control").className = '';
});

em.value = email;

// Init tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

// EVENT HANDLERS
//*********************************
document.getElementById("profile").addEventListener("submit", function(e) {
  e.preventDefault();
  e.stopPropagation();
  updateProfile();
});
document.getElementById("profile-pass").addEventListener("submit", function(e) {
  e.preventDefault();
  e.stopPropagation();
  updatePass();
});
// 'TAB' LIST EVENTS
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  document.getElementById("alert").innerHTML = '';
  if (e.target.name == "team"){
    teamInit();
  } else if (e.target.name == "groups") {

  }
});
