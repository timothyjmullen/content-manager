
  var uname = document.getElementById('txtName'),
      em = document.getElementById('txtEmail'),
      cpw = document.getElementById('txtPassUp'),
      members = {},
      userteams = [];

// UPDATE PROFILE VALUES
//*********************************
function updateProfile() {
  var user = auth.currentUser;
  if (uname.value != name) {
    user.updateProfile({
      displayName: uname.value,
    }).then(function() {
      // Update successful.
      firebase.database().ref("users/" + uid).update({name: uname.value});
      document.getElementById("alert").innerHTML = '<span class=\"glyphicon glyphicon-ok-circle\" aria-hidden=\"true\"></span> Your profile information has updated successfully.';
      document.getElementById("alert").className = "alert alert-success";
      document.getElementById("uname").innerHTML = '&#160;&#160;' + uname.value + '&#160;';
      name = uname.value;
    }, function(error) {
      if (error) {
        document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> Error updating profile information. Please let us know this happened and we will investigate the incident.";
        document.getElementById("alert").className = "alert alert-warning";
      }
    });
  }
  if (em.value != email) {
    user.updateEmail(em.value).then(function() {
      // Update successful.
      firebase.database().ref("users/email-map/" + btoa(email)).remove();
      firebase.database().ref("users/" + uid).update({email: em.value});
      firebase.database().ref("users/email-map/" + btoa(em.value)).set(uid);
      document.getElementById("alert").innerHTML = '<span class=\"glyphicon glyphicon-ok-circle\" aria-hidden=\"true\"></span> Your profile information has updated successfully.';
      document.getElementById("alert").className = "alert alert-success";
      email = em.value;
    }, function(error) {
      // An error happened.
      document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> Error updating profile information. Please let us know this happened and we will investigate the incident.";
      document.getElementById("alert").className = "alert alert-warning";
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

// GET TEAM NAMES FOR SELECT ELEMENT
function teamList(teams) {
  var tSel = document.getElementById("teamSelect"),
      x = "", optEl = {};
  for (x in teams) {
    // GET TEAM NAME
    userteams.push(x);
    ref.child("teams/" + x).once("value", function(data) {
      optEl = document.createElement('option');
      console.log(JSON.stringify(data.val()));
      optEl.innerHTML = data.val().name + ' (' + userteams[tSel.childNodes.length] + ')';
      optEl.setAttribute("team", userteams[tSel.childNodes.length]);
      tSel.appendChild(optEl);
      getMemberList();
    });
  }
}

// GET TEAM LIST FOR USER
function teamInit() {
  var tSel = document.getElementById("teamSelect");
  // CLEAR FORMS
  tSel.innerHTML = '';
  // GET USER TEAM DATA
  ref.child("users/" + btoa(email) + "/teams").once("value", function(x) {
    if (x.val()) {
      teamList(x.val());
    } else {
      document.getElementById("loading-team").className = 'loading hide';
      document.getElementById("alertteam").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> You are not currently a member of any account teams.";
      document.getElementById("alertteam").className = "alert alert-warning";
    }
  });
}

// GET TEAM USER LIST
function getMemberList() {
  var t = document.getElementById("teamSelect").value.replace(/.*?\(([^\)]*)\).*/i, '$1') || userteams[0];
  ref.child('teams/' + t + '/members').on("value", function(snapshot) {
    members = snapshot.val();
    if (members[btoa(email)] !== 'admin') {
      document.getElementById('add-member').className = 'hide';
    } else {
      document.getElementById('add-member').className = '';
    }
    buildTable();
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

// BUILD TEAM TABLE
function buildTable() {
  var teamTable = document.getElementById('teamtable'), i = 1, x = "", row, col0, col1, col2,col3;
  // Clear table
  while (teamTable.children.length > 0) {
      teamTable.removeChild(teamTable.children[teamTable.children.length - 1]);
  }
  // Build user table
  for (x in members) {
    row = document.createElement('tr');
    col0 = document.createElement('td');
    col1 = document.createElement('td');
    col2 = document.createElement('td');
    col3 = document.createElement('td');
    // Set cell content
    col0.innerHTML = i; /* Index */
    col1.innerHTML = atob(x); /* Member Email */
    col2.innerHTML = members[x]; /* Permission */
    col3.innerHTML = (atob(x) !== email && members[btoa(email)] == 'admin') ? '<a title="Remove Member" data-toggle="modal" data-target=".conf-modal-sm" data-mem="' + x + '"><i class="glyphicon glyphicon-remove"></i></a>' : ''; /* Removal */
    // Append cells to row
    row.appendChild(col0);
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    // Append table row
    teamTable.appendChild(row);
    // Increase index
    i++;
  }

  document.getElementById("loading-team").className = 'loading hide';
  document.getElementById("team-load-control").className = '';
}

// REMOVE TEAM MEMBER
function removeMember(mem) {
  var teamID = $("#teamSelect").find(':selected').attr('team');
  var onComplete = function (err) {
    if (err) {
      console.log(err);
    } else {
      buildTable();
      document.getElementById("alertteam").innerHTML = '<span class=\"glyphicon glyphicon-ok-circle\" aria-hidden=\"true\"></span> ' + atob(mem) + ' was removed successfully.';
      document.getElementById("alertteam").className = "alert alert-success";
    }
  }
  ref.child('teams/' + teamID + '/members/' + mem).remove(onComplete);
  ref.child('users/' + mem + '/teams/' + teamID).remove(onComplete);
}

// REMOVE MODAL
$('#myModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget),
      recipient = button.data('mem'),
      modal = $(this);
  modal.find('#modal-confirm').attr('onclick','removeMember(\'' + recipient + '\')');
})

// ADD TEAM MEMBER
function addMember() {
  var memEmail = document.getElementById("new-member").value,
      teamID = $("#teamSelect").find(':selected').attr('team'),
      permID = document.getElementById("permissionSelect").value;
  ref.child("users/" + btoa(memEmail)).once("value", function(x) {
    if (x.val()) {
      ref.child("users/" + btoa(memEmail) + "/teams/" + teamID).set(permID);
      ref.child("teams/" + teamID + "/members/" + btoa(memEmail)).set(permID);
      document.getElementById("alertteam").innerHTML = '<span class=\"glyphicon glyphicon-ok-circle\" aria-hidden=\"true\"></span> ' + memEmail + ' was added successfully.';
      document.getElementById("alertteam").className = "alert alert-success";
      buildTable();
    } else {
      document.getElementById("alertteam").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> This user does not exist (" + memEmail + ").";
      document.getElementById("alertteam").className = "alert alert-warning";
    }
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

// Init tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

// EVENT HANDLERS
//*********************************
$(function() {
  var hs = window.location.hash;
  if (hs == '#team') {
    $('#profile-nav a[href="#team"]').tab('show');
  } else if (hs == '#groups') {
      $('#profile-nav a[href="#groups"]').tab('show');
  }
});
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
document.getElementById("add-member").addEventListener("submit", function(e) {
  e.preventDefault();
  e.stopPropagation();
  addMember();
});
document.getElementById("teamSelect").addEventListener("change", getMemberList);
// 'TAB' LIST EVENTS
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  document.getElementById("alert").innerHTML = '';
  if (e.target.name == "team"){
    teamInit();
    window.location.hash = '#team';
  } else if (e.target.name == "groups") {
    window.location.hash = '#groups';
  }
});
