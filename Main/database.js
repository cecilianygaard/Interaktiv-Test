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
   { brugerid: TEACHER, login: "p", password: "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=", email: "abc@def.com", name: "Pernille", team:""},
   { brugerid: STUDENT, login: "dude", password: "qCHGLoEE+FGdY5tMCUiuzmQbFD9mAfoUWZO7LixymdQ=", email: "du@de.com", name: "Nilleper", team:""}
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
   db = event.target.result;
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
