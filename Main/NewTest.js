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
      
      //for each answer, temporarily save which question it belongs to
      //answer_link_table.push(question_no);
      
      
      answer_no++;
    }
    answers_per_question_array.push(answers_per_question);
    question_no++;
}



function SaveTest()
{
  var answers_to_save;
  var answers_saved;
  var answer_keys;
  var question_keys = "";
  var j;
  
     var answer_counter = 0;
    var temp;
   var questions_saved;
   
    //iterate through all questions
    for (var i = 1; i < question_no; i++)
    {
     
      alert("Question no: " + i);
      
      question_saved = 0;
      answers_saved = 0;
      answer_keys = "";
      
      //iterate through answers for current question
      answers_to_save = answers_per_question_array[i-1];
     
       for (j = 1; j <= answers_to_save; j++)
       {
          answer_counter++;
       
         //var transaction1 = db.transaction(["answers"], "readwrite");
         //var objectStore1 = transaction1.objectStore("answers");
         //var request = objectStore1.add({ text: document.getElementById('answer_text_field'+answer_counter).value});
         
         key_id = SaveAnswer(document.getElementById('answer_text_field'+answer_counter).value);
     
       
           alert("key_id: " + key_id);
         
            //add key to string of keys
            answer_keys = answer_keys + key_id + " ";
          
            
            //incremenet no of answers saved
            answers_saved++;
    
            //check if all answers has been saved before saving the question
            if(answers_saved==answers_to_save)
            {
               //answer_keys is a string of keys pointing to answers for the current question
               //question_keys += SaveQuestion(answer_keys, document.getElementById('question_text_field'+i).value);
               question_saved = 1;
              
            }
    
       }
       //while(!question_saved){}
     
    }  
    
 
}




function SaveAnswer(answertext)
{
 
   
   
   
var CheckAnswerSavedInstance = function () {
    CheckAnswerSaved
        .then(function (fulfilled) {
            key_id = fulfilled;
            return key_id;
        })
        .catch(function (error) {
            alert('IBJEF');
            // oops, mom don't buy it
            //console.log(error.message);
             // output: 'mom is not happy'
        });
  
} 

 var transaction1 = db.transaction(["answers"], "readwrite");
   var objectStore1 = transaction1.objectStore("answers");
   var request = objectStore1.add({ text: answertext});   
   
   
var CheckAnswerSaved = new Promise(

   function(myResolve, myReject)
   {
         request.onsuccess = function(event)
         {
            var temp = event.target.result;    
            myResolve(temp);
         };
         
          request.onerror = function(event)
         {
            var temp = "error";
            myReject(temp);
         };
});

return CheckAnswerSavedInstance();


}




//SaveQuestion();



function SaveQuestion(answer_keys, question_text)
{
  var temp;
  var questions_saved = 0;
  var question_key;
  
  //save questions
  
  alert("Hej4");
  
       var request2 = db.transaction(["questions"], "readwrite")
            .objectStore("questions")
            .add({ text: question_text, answers: answer_keys, correctAnswers: ""});
            
            
             
            
            request2.onsuccess = function(event)
            {
              //get the key
              temp = event.target.result;
              question_key = temp + " ";
           };
           
           request2.onerror = function(event)
            {
           };
     return question_key;
}

function SaveTestComplete(question_keys)
{
   var request = db.transaction(["tests"], "readwrite")
   .objectStore("tests")
   .add({testname: sessionStorage.username, questions: document.getElementById('text_field_test_name').value, username: question_keys});
}

function insertNewline(no)
{

  for (var i=0; i<no; i++)  
  {
    var newline = document.createElement('br');
    container.appendChild(newline);
  }
}
