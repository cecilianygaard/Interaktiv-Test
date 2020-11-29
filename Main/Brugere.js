//opret bruger kode:

function add_user() {
  var team = document.getElementById('team_name_textfield').value;
  
  //Check if team exists
  var teamObjectStore = db.transaction(["team"], "readonly")
  .objectStore("team");
  var teamRequest = teamObjectStore.get(team);
  
  teamRequest.onerror = function(event) {
      alert("Team " + team + " eksisterer ikke");
  }
  
  teamRequest.onsuccess = async function(event) {
    if (teamRequest.result==null) {
      alert("Team " + team + " eksisterer ikke");
      return;
    }
  
    //The team did exist
    var name = document.getElementById('user_name_textfield').value;
    var login = document.getElementById('user_login_textfield').value;
    var email = document.getElementById('user_email_textfield').value;
    var password = document.getElementById('user_password_textfield').value;
    var hashedpw = await asyncHash(password);
    
    var request = db.transaction(["user"], "readwrite")
      .objectStore("user")
      .add( { brugerid: STUDENT, login: login, password: hashedpw, email: email, name: name, team: team });

    request.onsuccess = function(event) {
      alert("user has been added to your database.");
    };

    request.onerror = function(event) {
      alert("User already exists in your database.");
    };  
  }
}
