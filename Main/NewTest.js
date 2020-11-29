   function GenerateQuestion () {

    var container = document.getElementById('container');

    //Show question
    var question = document.createElement('h2');
    question.innerHTML = "Spørgsmål " + question_no;
    container.appendChild(question);

    var questionTxtField = document.createElement('input');
    questionTxtField.type = 'text';
    questionTxtField.id = 'question_text_field'+question_no;
    questionTxtField.value = 'Skriv spørgsmål her';
    questionTxtField.name = 'question';
    questionTxtField.style.fontSize = "large";
    questionTxtField.addEventListener("click", function(){if(questionTxtField.value == 'Skriv spørgsmål her'){questionTxtField.value="";}});
    container.appendChild(questionTxtField);
    
    insertNewline(2);

    //Generate textfields for questions

    var answers_per_question = 0;
    for (var i = 1; i <= 4; i++)
    {
      answers_per_question++;
      
      var radiobox1 = document.createElement('input');

      radiobox1.type = 'radio';
      radiobox1.id = 'rightAnswer'+i;
      radiobox1.value = i;
      radiobox1.name = 'answer'+question_no;

      container.appendChild(radiobox1);

      var answerTxt = document.createElement('text');
      answerTxt.innerHTML = 'Answer ' + i;
      container.appendChild(answerTxt);
      //var answerTxtnode = document.createTextNode('Answer ' + i);

      insertNewline(1);

      var answerTxtField = document.createElement('input');
      answerTxtField.type = 'text';
      answerTxtField.id = 'answer_text_field'+answer_no;
      answerTxtField.name = 'answer';
      container.appendChild(answerTxtField);

      insertNewline(2);
      
      answer_no++;
    }
    answers_per_question_array.push(answers_per_question);
    question_no++;
}










var question_keys;
  
function SaveTest()
{
   var answers_to_save;
   var answers_saved;
   var answer_text;

   var j;
  
   var answer_counter = 0;
   var temp;
   var questions_saved;
   
   question_keys = "";
   
   //iterate through all questions
   for (var i = 1; i < question_no; i++)
   { 
      question_saved = 0;
      answers_saved = 0;
      answer_text = "";
      
      //iterate through answers for current question
      answers_to_save = answers_per_question_array[i-1];
    
      for (j = 1; j <= answers_to_save; j++)
      {
         answer_counter++;
          
         //add answer to answer string (split with "|")
         if(j>1)
         {
           answer_text += '|';
         }
         answer_text = answer_text + document.getElementById('answer_text_field'+answer_counter).value;
              
         //increment no of answers saved
         answers_saved++;
    
         //check if all answers has been saved before saving the question
         if(answers_saved==answers_to_save)
         {
            //determine right answer (which radio button is checked)
             var radios = document.getElementsByName('answer'+i);
            
             var val = "";
            
             for (var c=0, len=radios.length; c<len; c++)
             {
                if ( radios[c].checked )
                {
                   val = radios[c].value;
                   break;
                }
             }

            //save question
            SaveQuestion(answer_text, document.getElementById('question_text_field'+i).value, val);
         } 
       } 
    }  
}


function SaveQuestion(answer_keys, question_text, correct_answer)
{
  var temp;
  var questions_saved = 0;
  
  var request2 = db.transaction(["questions"], "readwrite")
      .objectStore("questions")
      .add({ text: question_text, answers: answer_keys, correctAnswers: correct_answer});       
            
  request2.onsuccess = function(event)
  {
     if (question_saved > 0)
     {
        question_keys+="|";
     }

     question_keys += event.target.result;
               
     question_saved++;
              
     if (question_saved == (question_no-1))
     {
        SaveTestComplete(question_keys);
     }          
  };
           
  request2.onerror = function(event)
  {
  };

}

function SaveTestComplete(question_keys)
{
   var request = db.transaction(["test"], "readwrite")
   .objectStore("test")
   .add({testname: document.getElementById('text_field_test_name').value, questions: question_keys, username:sessionStorage.username});
   
   alert('Test saved');
}

function insertNewline(no)
{
  for (var i=0; i<no; i++)  
  {
    var newline = document.createElement('br');
    container.appendChild(newline);
  }
}
