// Get references to HTML elements
const $form = document.getElementById('input-form');
const $submitButton = document.querySelector('.submit-button');
const $defInput = document.getElementById('def');

// Function to make a request to the OpenAI API using XMLHttpRequest
function getMsgData(name) {

  // Promise method produces a value after an asynchronous (aka, async) operation completes successfully
  return new Promise((resolve, reject) => {

    // Create an XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    const apiKey = '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';
    const url = 'https://api.openai.com/v1/chat/completions';

    // Configure the request
    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', `Bearer ${apiKey}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';

    // Event listener for when the response is loaded
    xhr.addEventListener('load', function () {
      const chatGptMsg = xhr.response.choices[0].message.content;
      resolve(chatGptMsg); // Resolve the Promise with the response
    });

    // Data to be sent in the request body
    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: name
        },
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        }
      ]
    };

    // Send the request with the JSON data
    xhr.send(JSON.stringify(requestData));
  });
}

// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();

  const definition = $defInput.value;

  if (definition.length === 0) {
    alert('Please enter a definition.');
    return;
  }

  // Call the API function and handle the response
  getMsgData('GIVE ME A LIST OF 5 WORDS (NUMBERED) AND A SIMPLE DEF OF EACH OF THEM THAT MAY MATCH THIS DEF USE COLONS (NO BETWEEN NUMBER AND WORD) IN BETWEEN WORD AND DEF :' + definition)
    .then(response => {

      // Create a new entry object
      const newEntry = {
        entryId: data.nextEntryId,
        definition,
        response
      };

      // Increment the entry ID and update the entries array
      data.nextEntryId++;
      data.entries.unshift(newEntry);

      // Clear the input and reset the form
      $defInput.value = '';
      $form.reset();

    })
    .catch(error => {
      console.error(error);
    });
}

// Add a 'click' event listener to the submit button
$submitButton.addEventListener('click', handleSubmit);
