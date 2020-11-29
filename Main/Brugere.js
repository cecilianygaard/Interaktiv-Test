//opret bruger kode:
function add_user(){ 
  alert ("gurli");
  var name = document.getElementById('user_name_textfield').value;
  var login = document.getElementById('user_login_textfield').value;
  var email = document.getElementById('user_email_textfield').value;
  var password = document.getElementById('user_password_textfield').value;
  var hashedpw = await asyncHash(password);
    
  var request = db.transaction(["user"], "readwrite")
    .objectStore("user")
    .add( { brugerid: STUDENT, login: login, password: hashedpw, email: email, name: name});

  request.onsuccess = function(event) {
    alert("user has been added to your database.");
  };

  request.onerror = function(event) {
    alert("Unable to add data\r\n user already exists in your database ");
  };  
}

//Dette stykke kode er lavet til hvis det er et krav at man opretter sig med et hold fra start
//function add_teamUser() {
//  var team = document.getElementById('team_name_textfield').value;
  
//  //Check if team exists
//  var teamObjectStore = db.transaction(["team"], "readonly")
//  .objectStore("team");
//  var teamRequest = teamObjectStore.get(team);
  
//  teamRequest.onerror = function(event) {
//      alert("Team " + team + " eksisterer ikke");
//  }
  
//  teamRequest.onsuccess = async function(event) {
//    if (teamRequest.result==null) {
//      alert("Team " + team + " eksisterer ikke");
//      return;
//    }
  
//    //The team did exist
//    var name = document.getElementById('user_name_textfield').value;
//    var login = document.getElementById('user_login_textfield').value;
//    var email = document.getElementById('user_email_textfield').value;
//    var password = document.getElementById('user_password_textfield').value;
//    var hashedpw = await asyncHash(password);
    
//    var request = db.transaction(["user"], "readwrite")
//      .objectStore("user")
//      .add( { brugerid: STUDENT, login: login, password: hashedpw, email: email, name: name, team: team });

//    request.onsuccess = function(event) {
//      alert("user has been added to your database.");
//    };

//    request.onerror = function(event) {
//      alert("User already exists in your database.");
//    };  
//  }
//}

function add_team() {
  var name = document.getElementById("team_name_textfield").value;
  var schoolClass = document.getElementById("team_schoolClass_textfield").value;
  var subject = document.getElementById("team_subject_textfield").value;
         
  var request = db.transaction(["team"], "readwrite")
    .objectStore("team")
    .add({ name: name, schoolClass: schoolClass, subject: subject });
          
  request.onsuccess = function(event) {
    alert("Hold er oprettet!");
  };
          
  request.onerror = function(event) {
    alert("Hold kunne ikke blive oprettet. Prøv igen.");
  }
}
 
function upload_users(evt) {
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

    var files = evt.target.files; // FileList object
      
    var reader = new FileReader();

    reader.onload = function(e) {  
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach(async function(sheetName) {
      // Here is your object
      var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName],{range: "B3:G100"});
            
      for (var i=0 ; i<XL_row_object.length; i++) {
        if (XL_row_object[i].Type=="Elev") {
          var brugernavn = XL_row_object[i].Fornavn + XL_row_object[i].Efternavn;
          var navn = XL_row_object[i].Fornavn;
          var email = "";
          var pw = XL_row_object[i].Efternavn + "1234";

          var hashedpw = await asyncHash(pw);    

          var request = db.transaction(["user"], "readwrite")
            .objectStore("user")
            .add({ brugerid: STUDENT, login: brugernavn, password: hashedpw, email: email, name: navn, team: team });
            
          request.onsuccess = function(event) {
            document.getElementById('message').innerHTML="Brugerne blev oprettet i databasen.";
          };
            
          request.onerror = function(event) {
            document.getElementById('message').innerHTML="Fejl. Brugerne kunne ikke oprettes i databasen. Prøv igen.";
          };
        }        
      }
    });
   
    console.log("success: " + reader);
  };

  reader.onerror = function(ex) {
    console.log(ex);
  };

  reader.readAsBinaryString(files[0]);
  };
}
