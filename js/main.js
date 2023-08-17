// Get references to HTML elements
const $form = document.getElementById('input-form');
const $submitButton = document.querySelector('.submit-button');
const $defInput = document.querySelector('#def');
const $entriesList = document.querySelector('#options-list');
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
    const prompt = "'GIVE ME A LIST OF 5 WORDS or SYNONYMES AND RETURN A SIMPLE DEF FOR EACH OF THEM THAT MAY MATCH THIS DEFINITION: (MOST IMPORTANT THING IS NO EXTRA PROMT MESSAGE! JUST NUMBER FOLLOWED BY A PERIOD FOLLOWED BY THE WORD COLON DEF!!)";
    // Call the API function and handle the response
    const arrayOfOptions = await getMsgData(prompt + definition);

    // Call the renderOptions function to render the options
    renderOptions(arrayOfOptions);

    toggleSubmitButton(true);

    // Create a new entry object
    const newEntry = {
      entryId: data.nextEntryId,
      definition,
      response: arrayOfOptions,
      selectedButtons
    };

    // Increment the entry ID and update the entries array
    data.nextEntryId++;
    data.entries.unshift(newEntry);

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

// the visible parameter will be a boolean true if you
// want the user to see the "SAVE WORDS" button
function toggleSubmitButton(visible) {
  if (visible) {
    $saveWord.removeAttribute('hidden');
  } else {
    $saveWord.setAttribute('hidden', 'true');
  }
}

function toggleOptions(visible) {
  if (visible) {
    $entriesList.removeAttribute('hidden');
  } else {
    $entriesList.setAttribute('hidden', 'true');
  }
}

// Defining an array to store selected button texts
const selectedButtons = [];

function renderOptions(options) {

  // Clear any existing options
  $entriesList.textContent = '';

  // Loop through options and create buttons for each
  options.forEach((option, index) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.classList.add('selectable-button');
    button.textContent = option;
    li.appendChild(button);
    $entriesList.appendChild(li);
  });

  const $selectableButton = document.querySelectorAll('.selectable-button');

  // Looping through each selectable button and attach a click event listener
  $selectableButton.forEach(button => {

    // listening for a click when the button is clicked
    // and WILL also do some work everytime user clicks a button...
    // we want to keep the color blue and save to a array (selectedButtons)
    // IMPORTANT:
    // but if the user clicks the button and deselect the option
    // we need to need to take that out of there array and add the one
    // they just clicked
    button.addEventListener('click', function () {

      // Getting the text content of the clicked button
      const buttonText = button.textContent;

      // Check if Option clicked includes (which means "has")
      // the value of buttonText (which holds the text of the
      // button clicked)...
      if (selectedButtons.includes(buttonText)) {
        // Remove 'focus' class to deselect the option
        button.classList.remove('focus');
        // ... find the position (an integer) of "buttonText" in
        // the "selectedButtons" list and assign the value to
        // 'index'...
        const index = selectedButtons.indexOf(buttonText);
        // ...then remove that element from the selected list
        selectedButtons.splice(index, 1);
      } else {
        // If not selected, add to the array
        selectedButtons.push(buttonText);

        button.classList.add('focus');
      }
    });
  });
}

// Adding  a click event listener to the 'SAVE WORDS' button
$saveWord.addEventListener('click', function () {

  // Clear the input and reset the form
  $defInput.value = '';
  $form.reset();

  // once we grab the words they want to keep save them
  toggleSubmitButton(false);
  toggleOptions(false);
});

// Adding a 'click' event listener to the submit button
$submitButton.addEventListener('click', handleSubmit);
