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
            { brugerid: TEACHER, login: "p", password: "47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=", email: "abc@def.com", name: "Pernille"},
            { brugerid: STUDENT, login: "dude", password: "qCHGLoEE+FGdY5tMCUiuzmQbFD9mAfoUWZO7LixymdQ=", email: "du@de.com", name: "Nilleper"}
            //hardcode more users here
         ];
                
          const dummyanswerData = [
            {text: "svar"}
         ];
           
            const dummyQuestionData = [
            {text: "Spørgsmål", answers:"", correctAnswers: "" }
         ];
         
             const dummyTestData = [
            {testname: "Testxxx", questions:"", username: "" }
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
            
            /* Generate answer table in database */
            
            var objectStoreAnswers = db.createObjectStore("answers", { autoIncrement : true });
            
            //needed for index based searching by id
            //objectStoreAnswers.createIndex("id", "id", { unique: true });
            
             //populate database with hardcoded entries
            for (var j in dummyanswerData) {
               objectStoreAnswers.add(dummyanswerData[j]);
            }
            
            /* Generate question table */
            
            var objectStoreQuestions = db.createObjectStore("questions", { autoIncrement : true, keyPath: "key"});
            
            //needed for index based searching by id
            //objectStoreAnswers.createIndex("id", "id", { unique: true });
            
             //populate database with hardcoded entries
            for (var k in dummyQuestionData) {
               objectStoreQuestions.add(dummyQuestionData[k]);
            }
            
            /* Generate question table */
            var objectStoreTest = db.createObjectStore("test", { autoIncrement : true, keyPath: "key"});
            
            //needed for index based searching by id
            //objectStoreAnswers.createIndex("id", "id", { unique: true });
            
             //populate database with hardcoded entries
         // for (var l in dummyTestData) {
         //    objectStoreTest.add(dummyTestData[l]);
         // }
            
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
                
          showQuestions(questions_keys);
            } else {
              alert("Question couldn't be found in your database!");
               }
            };
         }
         
function showQuestions(questions_keys){
   var container = document.getElementById('container');
   
   //Show question
   //var question = document.createElement('h2');
   //question.innerHTML = "Spørgsmål";
   //container.appendChild(question);
   
   //iterate through questions
   for (var j = 0; j < questions_keys.length; j++) {
       let objectStore = db.transaction(["questions"], "readwrite").objectStore("questions");
       let request = objectStore.get(parseInt(questions_keys[j]));
       
       request.onsuccess = function(event) {
        
          //alert(request.result.text);
          //answers
          let temp_str = request.result.answers;
          let answers = temp_str.split("|");
          //temp_str = "";
          //for(let c=0;c<answers.length;c++)
          //{
          //  temp_str += answers[c] + "\n";
          //}
          //alert(temp_str);
          
          var container = document.getElementById('container');
          
          //---------------------------------------
          
          insertNewline(2);
          
           let question = document.createElement('h3');
           question.innerHTML = request.result.text;
           container.appendChild(question);
          
          //iterate through answers
          for(let i=0;i<answers.length;i++)
          {
            
            
             
             let radiobox1 = document.createElement('input');

             radiobox1.type = 'radio';
             radiobox1.id = i;
             radiobox1.value = i;
             radiobox1.name = 'question';
             container.appendChild(radiobox1);
             
             let label1 = document.createElement('label');
             label1.htmlFor = 'Answer ' + i;
             var description1 = document.createTextNode(answers[i]);
             label1.appendChild(description1);
             container.appendChild(label1);
             
             insertNewline(1);
          }

      //var description1 = document.createTextNode('Answer ' + i);

      //label1.appendChild(description1);

      //container.appendChild(radiobox1);
      //container.appendChild(label1);
      //var newline = document.createElement('br');
      //container.appendChild(newline);
          
          
          
          
       };
            
       request.onerror = function(event) {
     
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
  
}
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
