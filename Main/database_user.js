/* indexedDB path for Chrome
 C:\Users\"user name"\AppData\Local\Google\Chrome\User Data\Default\IndexedDB */

/* indexedDB databases are unique per webpage and pc user
 As processing changes URL everytime it's reloaded, a new db is created when that happens.
 An existing db can be renamed to match another URL */

/* Find indexedDB in Chrome dev tools this way:
 1) Click options
 2) Click more tools
 3) Click developer tools
 4) Find indexeddB tab */

//Note: If anything in the db format changes, the db must be cleared and rebuild. Either delete database file or delete in dev tools.

const ADMIN   = "0";
const TEACHER = "1";
const STUDENT = "2";

//prefixes of implementation that we want to test
         window.indexedDB = window.indexedDB || window.mozIndexedDB || 
         window.webkitIndexedDB || window.msIndexedDB;
         
         //prefixes of window.IDB objects
         window.IDBTransaction = window.IDBTransaction || 
         window.webkitIDBTransaction || window.msIDBTransaction;
         window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
         
         if (!window.indexedDB) {
            window.alert("Your browser doesn't support a stable version of IndexedDB.");
         }     
         
         //dette er 2 testbrugere
         const userData = [
            { brugerid: TEACHER, login: "p", password: "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=", email: "abc@def.com", name: "Pernille", Hold:""},
            { brugerid: STUDENT, login: "dude", password: "qCHGLoEE+FGdY5tMCUiuzmQbFD9mAfoUWZO7LixymdQ=", email: "du@de.com", name: "Nilleper", Hold:""}
            //hardcode more users here
         ];
                
          const dummyanswerData = [
            {text: "Answer"}
         ];
           
            const dummyQuestionData = [
            {text: "Spørgsmål", answers:"", correctAnswers: "" }
         ];
         
             const dummyTestData = [
            {testname: "Testxxx", questions:"", username: "" }
         ];
         
             const dummyTeamData = [
            {name: "Teamxxx", schoolClass:"", subject: "" }
         ];
         
          const dummyResultsData = [
          {login: "userxxx", testkey:"10", answers: "1|2" }
          ];
         
     
         var db;
         var request = window.indexedDB.open("newDatabase", 1);
         
         request.onerror = function(event) {
            console.log("error: ");
         };
         
         request.onsuccess = function(event) {
            db = request.result;
            console.log("success: " + db);
         };
         
         //this function will create the database if it doesn't exist
         request.onupgradeneeded = function(event) {
            var db = event.target.result; 
            
            /* Generate user table in database */      
            
            //create user table and tell database that key is username (unique)
            var objectStore = db.createObjectStore("user", {keyPath: "login"});
            
            //needed for index based searching by username
            objectStore.createIndex("login", "login", { unique: true });
            
            //populate database with hardcoded entries
            for (var i in userData) {
               objectStore.add(userData[i]);
            }
            
            /* Generate question table */            
            var objectStoreQuestions = db.createObjectStore("questions", { autoIncrement : true, keyPath: "key"});
                
            //populate database with hardcoded entries
            for (var k in dummyQuestionData) {
               objectStoreQuestions.add(dummyQuestionData[k]);
            }
            
            /* Generate test table */
            var objectStoreTest = db.createObjectStore("test", { autoIncrement : true, keyPath: "key"});
            
            /* Generate teams table */
            var objectStoreTeams = db.createObjectStore("team", { keyPath: "name"});
            
             //populate database with hardcoded entries
            for (var t in dummyTeamData) {
               objectStoreTeams.add(dummyTeamData[t]);
            }
            
            /* Generate Results table */
            //This creates an objecstore for test results  
            var objectStoreResults = db.createObjectStore("Results", {autoIncrement : true, keyPath: "key"}); 
           
         }; 
          
async function check_password() {
  //retrieve username and password from login page
      var brugernavn = document.getElementById('user_login_textfield').value;
        var pw = document.getElementById('user_password_textfield').value;
        var hashedpw = await asyncHash(pw);

 //point to user table in db
        var objectStore = db.transaction("user").objectStore("user");
     
            //search login
        var index = objectStore.index("login");

  //do the search
  index.get(brugernavn).onsuccess = function(event) {
    //user found, now check if password is correct
    if (event.target.result.password == hashedpw) {
      sessionStorage.username = event.target.result.name;
      sessionStorage.brugerid = event.target.result.brugerid;
      if (event.target.result.brugerid == TEACHER)
      {
        window.location.href = 'Main_laerer.html';
      } else if (event.target.result.brugerid == STUDENT)
      {
        window.location.href = 'Main_elev.html';
      }
    } else
    {
      alert("Password wrong");
    }
  };

  index.get(brugernavn).onerror = function(event) {
    alert("user not found");
  };
}

   function getTest(test_no) {
       
     var objectStore = db.transaction(["test"], "readwrite")
        .objectStore("test");
          
     var request = objectStore.get(test_no);
         
            
         request.onerror = function(event) {
           alert("Unable to retrieve data from database!");
            };
            
         request.onsuccess = function(event) {
         // Do something with the request.result!
           if(request.result) {
            //alert("Name: " + request.result.testname + ", Questions: " + request.result.questions + ", Username: " + request.result.username);
                  
             //get question keys
             var temp_str = request.result.questions;
             var questions_keys = temp_str.split("|");
                
          showQuestions(questions_keys, test_no);
            } else {
              alert("Question couldn't be found in your database!");
               }
            };
         }
         
//function showSaveButton(){
//   var button = document.createElement('button');          // CREATE THE BUTTON.
//   var bText = document.createTextNode('Submit');          // CREATE TEXT FOR THE BUTTON
//   button.appendChild(bText);                              // ADD THE TEXT TO THE BUTTON.

//   button.setAttribute('onclick', 'showResults()');
  
//   var container = document.getElementById('container');
//   container.appendChild(button);
//}

function saveResults(test_no)
{
  //iterate through each answer
  let answers = "";
  for(let i=1;i<=question_no;i++)
  {
    if(i>1)
    {
      answers += "|";
    }
    //get which radio button is pressed
    var radios = document.getElementsByName('question'+i);
   
            
    var val;
    for (var c=0, len=radios.length; c<len; c++)
    {
      if ( radios[c].checked )
      {
         val = radios[c].value;
         break;
      }
    }
    
    //append number to answer string
    answers += val;
  }
  
  //store in Results
  var request = db.transaction(["Results"], "readwrite")
  .objectStore("Results")
  .add({ login: sessionStorage.username, testkey: test_no, answers: answers});
  
   request.onsuccess = function(event)
   {
      alert("Test resultat gemt");
   };
  
}
   
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
   
function insertNewline(no)
{
  for (var i=0; i<no; i++)  
  {
    var newline = document.createElement('br');
    container.appendChild(newline);
  }
}       
   
   //below are test functions that might come in handy later

   ////Generate radio buttons
   //for (var i = 1; i <= 4; i++)
   //{
   //   var radiobox1 = document.createElement('input');
   //   radiobox1.type = 'radio';
   //   radiobox1.id = 'rightAnswer'+i;
   //   radiobox1.value = i;
   //   radiobox1.name = 'answer'+question_no;

   //   var label1 = document.createElement('label');
   //   label1.htmlFor = 'Answer ' + i;

   //   var description1 = document.createTextNode('Answer ' + i);


   //   label1.appendChild(description1);
   //   container.appendChild(radiobox1);
   //   container.appendChild(label1);
   //   var newline = document.createElement('br');
   //   container.appendChild(newline);
   // }
   
/*         
         function read_all_users() {
            var objectStore = db.transaction("user").objectStore("user");
            
            objectStore.openCursor().onsuccess = function(event) {
               var cursor = event.target.result;
               
               if (cursor) {
                  alert("Username: " + cursor.key + ", Id: " + cursor.value.brugerid + ", Password: " + cursor.value.password + ", Email: " + cursor.value.email);
                  cursor.continue();
               } else {
                  alert("No more entries!");
               }
            };
         }
         
         function add_user() {
            var request = db.transaction(["user"], "readwrite")
            .objectStore("user")
            .add({ brugerid: "2", username: "Svend", password: "hej", email: "svend@tveskaeg.org" });
            
            request.onsuccess = function(event) {
               alert("Svend has been added to your database.");
            };
            
            request.onerror = function(event) {
               alert("Unable to add data\r\nSvend is aready exist in your database! ");
            }
         }
         
         function remove_user() {
            var request = db.transaction(["user"], "readwrite")
            .objectStore("user")
            .delete("Svend");
            
            request.onsuccess = function(event) {
               alert("Svend's entry has been removed from your database.");
            };
         }  
*/
