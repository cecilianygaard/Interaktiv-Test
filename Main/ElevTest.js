function showQuestions(questions_keys, test_no){
   var container = document.getElementById('container');
   
   //save globally so that save test results function knows about the number of questions shown(question_no defined in the html file)
   question_no = questions_keys.length;
   
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
          }   
       };        
       request.onerror = function(event) {
       };
   }
}

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



function showAnswers (){


}
