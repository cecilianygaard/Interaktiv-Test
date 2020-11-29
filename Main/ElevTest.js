function showQuestions(questions_keys, test_no){
   var container = document.getElementById('container');
   
   //save globally so that save test results function knows about the number of questions shown(question_no defined in the html file)
   question_no = questions_keys.length;
   
   var c = [];
   
   var correct_answer_array = [];
   
   //iterate through questions
   for (var j = 0; j < questions_keys.length; j++)
   {
       let objectStore = db.transaction(["questions"], "readwrite").objectStore("questions");
       let request = objectStore.get(parseInt(questions_keys[j]));
       
       var questions_shown = 0;
       
       request.onsuccess = function(event)
       {
         
          questions_shown++;
         
          //answers
          let temp_str = request.result.answers;
          let answers = temp_str.split("|");
          correct_answer_array.push(request.result.correctAnswers);
        
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
            radiobox1.id = 'chosenAnswer' + i;
            radiobox1.value = i;
            radiobox1.name = 'question'+questions_shown;
            container.appendChild(radiobox1);
             
            let label1 = document.createElement('label');
            label1.htmlFor = 'Answer ' + i;           
              label1.id = 'Question'+questions_shown+'Answer'+i;
            var description1 = document.createTextNode(answers[i]);
          
            label1.appendChild(description1);
            container.appendChild(label1);
             
            insertNewline(1);             
         }
                    
         //if last question create save results button
         if(questions_shown == question_no)
         {
            var button = document.createElement('button');
            var bText = document.createTextNode('Gem test');
            button.appendChild(bText);
            button.setAttribute('onclick', 'saveResults('+test_no+')');  
            container.appendChild(button);    
            
            let temp_str = "";

            
            sessionStorage.correct_answer_array = correct_answer_array;
         }   
      };        
      request.onerror = function(event) {
      };
   }
}

function saveResults(test_no)
{
  
  var correct_answer_array = (sessionStorage.correct_answer_array).split(',');
  
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
    
    alert('Svar:'+val+', correct:' + (correct_answer_array[i-1]-1).toString());
    
    //Show correct answer in greens
    let id = 'Question'+i+'Answer'+(correct_answer_array[i-1]-1).toString();
    document.getElementById(id).style.color = "green";
    
    //if answer is not correct, show chosen answer in red
    if ((val != correct_answer_array[i-1]-1))
    {
       let id = 'Question'+i+'Answer'+val.toString();
       document.getElementById(id).style.color = "red";
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

function showAnswers(){
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
         } 
       else {
         alert("Question couldn't be found in your database!");
      }
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
