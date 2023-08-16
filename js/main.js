// Get references to HTML elements
// const $form = document.getElementById('input-form');
const $submitButton = document.querySelector('.submit-button');
const $defInput = document.querySelector('#def');
const $saveWord = document.querySelector('#toggle');

toggleSubmitButton(false);

// Function to make a request to the OpenAI API using XMLHttpRequest
function getMsgData(name) {
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

    xhr.addEventListener('load', function () {
      // Handle response using Promise
      if (xhr.status === 200) {
        let chatGptMsg = '';

        for (let i = 0; i < xhr.response.choices.length; i++) {
          chatGptMsg = xhr.response.choices[0].message.content;
        }

        const definitions = MsgGetCutIntoFivePieces(chatGptMsg);

        resolve(definitions); // Resolve the promise with the result
      } else {
        reject(console.error('API request failed'));
      }
    });

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
async function handleSubmit(event) {
  event.preventDefault();

  const definition = $defInput.value;

  if (definition.length === 0) {
    alert('Please enter a definition.');
    return;
  }

  try {
    // Call the API function and handle the response
    const arrayOfOptions = await getMsgData('GIVE ME A LIST OF 5 WORDS or SYNONYMES (9-college grade level) AND A SIMPLE DEF OF EACH OF THEM THAT MAY MATCH THIS DEF: (NO EXTRA PROMT MESSAGE JUST NUMBER FOLLOWED BY A PERIOD FOLLOWED BY THE WORD COLON DEF!!)' + definition);

    toggleSubmitButton(true);

    // Create a new entry object
    const newEntry = {
      entryId: data.nextEntryId,
      definition,
      response: arrayOfOptions
    };

    // Increment the entry ID and update the entries array
    data.nextEntryId++;
    data.entries.unshift(newEntry);

    // // Clear the input and reset the form
    // $defInput.value = '';
    // $form.reset();

  } catch (error) {
    console.error(error);
    alert('An error occurred while processing your request.');
  }
}

function MsgGetCutIntoFivePieces(entry) {
  const definitions = entry.split('\n'); // Split the entry by newline characters

  // Initializing an array to store definitions
  const arrayOfOptions = [];

  // Looping through the definitions, skipping empty lines
  for (const definition of definitions) {
    if (definition.trim() !== '') {
      arrayOfOptions.push(definition);
    }
  }

  return arrayOfOptions;
}

function toggleSubmitButton(visible) {
  if (visible) {
    $saveWord.removeAttribute('hidden');
  } else {
    $saveWord.setAttribute('hidden', 'true');
  }
}

// Addding a 'click' event listener to the submit button
$submitButton.addEventListener('click', handleSubmit);
