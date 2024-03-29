// Get references to HTML elements
const $form = document.querySelector('#input-form');
const $logo = document.querySelector('.logo');
const $searchButton = document.querySelector('.search-button');
const $save = document.querySelector('.save');
const $saveButton = document.querySelector('.save-button');
const $defInput = document.querySelector('#def');
const $entriesList = document.querySelector('#options-list');
const $navButton = document.querySelector('#nav-button');
const $entryForm = document.querySelector('[data-view="entry-form"]');
const $navLinks = document.querySelector('[data-view="nav-links"]');
const $homeLink = document.querySelector('#home-button');
const $backgroundColor = document.querySelector('.background-body-color');
const $headerBottomBorder = document.querySelector('#border');
const $savedWordsView = document.querySelector('[data-view="saved-words"]');
const $selectOptionsPromt = document.querySelector('#click-words-to-save-promt');
const $deleteModal = document.querySelector('#delete-modal');
const $cancelDeleteButton = document.querySelector('#cancel-delete-button');
const $confirmDeleteButton = document.querySelector('#confirm-delete-button');
const $noEntriesMessage = document.querySelector('.no-entries-message');
const $loader = document.querySelector('.loader');

const $savedWordsList = document.querySelector('#saved-words-list');

toggleSaveButton(false);
toggleLoader(false);

// *************************************************************************************************//

// ***************************** getMsgData(name) (EVENT LISTENER FUNCTION) ************************//
// PURPOSE: Function to make a request to the OpenAI API using XMLHttpRequest
// PARAMETER: 'name' - The user input for the conversation
// RETURNS: A promise that resolves with processed API response

// AKA: Function to make a request to the OpenAI API using XMLHttpRequest
function getMsgData(name) {
  return new Promise((resolve, reject) => {
    // Creating an XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    const keyParts = [
      'sk-',
      'HCqgOpo5e7',
      'mnVooeCo4u',
      'T3BlbkFJr',
      'Ey7GqFXUhE',
      'Tr1JeoVsO',
    ];
    const apiKey = keyParts.join('');

    const url = 'https://api.openai.com/v1/chat/completions';

    // Configuring the request
    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', `Bearer ${apiKey}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';
    toggleLoader(true);
    xhr.addEventListener('load', function () {
      // Handling response using Promise
      if (xhr.status === 200) {
        let chatGptMsg = '';

        for (let i = 0; i < xhr.response.choices.length; i++) {
          chatGptMsg = xhr.response.choices[0].message.content;
        }

        const definitions = MsgGetCutIntoFivePieces(chatGptMsg);

        resolve(definitions); // Resolve the promise with the result
        toggleLoader(false);
      } else {
        reject(console.error('API request failed'));
        toggleLoader(false);
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

// Defining an array to store selected button texts
const selectedButtons = [];

let newEntry = {
  entryIdToDelete: -1,
  selectedButtonIndexToDelete: -1
};
// *************************************************************************************************//

// ******************************************* getMsgData(name) ************************************//
// PURPOSE: Function to handle form submission
// PARAMETER: 'event' - The submit event object
// RETURNS: None
async function handleSubmit(event) {
  event.preventDefault();

  const definition = $defInput.value;

  if (definition.length === 0) {
    alert('Please enter a definition.');
    return;
  }

  // try {
    const prompt = "'(MOST IMPORTANT THING IS NO EXTRA PROMPT MESSAGE! JUST NUMBER FOLLOWED BY A PERIOD FOLLOWED BY THE WORD COLON DEF!!) GIVE ME A LIST OF 5 WORDS or SYNONYMES AND RETURN A SIMPLE DEF FOR EACH OF THEM THAT MAY MATCH THIS DEFINITION:";
    // Calling the API function and handle the response

    const arrayOfOptions = await getMsgData(prompt + definition);

    $entriesList.textContent = '';

    // Calling the renderOptions function to render the options
    renderOptions(arrayOfOptions);

    // Creating a new entry object with its own copy of selected buttons
    const entrySelectedButtons = selectedButtons.slice(); // Copy the array

    newEntry = {
      entryId: data.nextEntryId,
      definition,
      response: arrayOfOptions,
      selectedButtons: entrySelectedButtons,
      newdate: getCurrentDate()
    };

    data.nextEntryId++;

    // Saving the newEntry to the data object
    data.entries.unshift(newEntry);

    // Clearing the selectedButtons array
    selectedButtons.length = 0;

    // Saving the updated data to local storage
    const dataJSON = JSON.stringify(data);
    localStorage.setItem('Javascript-local-storage', dataJSON);

    // Calling the renderOptions function with the response array
    renderOptions(newEntry.response);

    toggleOptions(true);

    // Showing the save button
    toggleSaveButton(true);

    // Calling the renderKeywordList function with the selected keywords
    renderKeywordList(newEntry);

  // } catch (error) {

  //   alert('An error occurred while processing your request.');
  // }
}

function toggleLoader(visible) {
  if (visible && (selectedButtons.length === 0)) {
    $loader.removeAttribute('hidden'); // Show loader only if no selections made or input is empty
  } else {
    $loader.setAttribute('hidden', 'true'); // Hide loader
  }
}

function getCurrentDate() {
  var monthArray = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dateObj = new Date();
  const month = monthArray[dateObj.getUTCMonth()];
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  // time is in military time
  const time = ((dateObj.getHours().toString()).length > 1 ? dateObj.getHours() : '0' + dateObj.getHours()) + ':' + ((dateObj.getMinutes().toString()).length > 1 ? dateObj.getMinutes() : '0' + dateObj.getMinutes());

  const newdate = month + ' ' + day + ' ' + year + '   ' + time;

  return newdate;
}

// *************************************************************************************************//

// ******************************* MsgGetCutIntoFivePieces (entry) **********************************//
// PURPOSE: Function to split an entry into individual definitions
// PARAMETER: 'entry' - The input entry containing multiple definitions
// RETURNS: An array of individual definitions

// AKA: Function to handle form submission

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
// *************************************************************************************************//

// *********************************** toggleSubmitButton (visible) ********************************//
// PURPOSE: Function to toggle the visibility of the submit button
// PARAMETER: 'visible' - Boolean indicating whether the button should be visible
// RETURNS: None

// AKA: Function visible ensure the 'save' button is shown when needed
function toggleSaveButton(visible) {
  if (visible) {
    $save.removeAttribute('hidden'); // show save button
  } else {
    $save.setAttribute('hidden', 'true'); // hide save button
  }
}

// *************************************************************************************************//

// ************************************** toggleOptions(visible) ***********************************//
// PURPOSE: Function to toggle the visibility of the options list
// PARAMETER: 'visible' - Boolean indicating whether the list should be visible
// RETURNS: None
function toggleOptions(visible) {
  if (visible) {
    $entriesList.removeAttribute('hidden');
  } else {
    $entriesList.setAttribute('hidden', 'true');
  }
}

// *************************************************************************************************//

// ************************************ handleNavIconClicked(event) ********************************//
// PURPOSE: Defining a function called 'handleNavIconClicked' which will ensure that the user only see
// nav and nothing else!
// PARAMETER: 'event' - The click event object
// RETURNS: None

// AKA: Function to handle the navigation icon click event
function handleNavIconClicked(event) {
  if (event.target.tagName === 'I') {
    $backgroundColor.classList.remove('background-body-color');
    $backgroundColor.classList.add('nav-background');
    $save.setAttribute('hidden', 'true');
    $headerBottomBorder.classList.add('bottom-border');
    $entryForm.setAttribute('hidden', 'true');
    $selectOptionsPromt.setAttribute('hidden', 'true');
    $navLinks.removeAttribute('hidden');
    $savedWordsView.setAttribute('hidden', 'true');
    toggleOptions(false);
  } else {
    $entryForm.removeAttribute('hidden');
    $navLinks.setAttribute('hidden', 'true');
  }
}

function viewSwap(nameOfView) {
  if (nameOfView === 'entry-form') {
    $entryForm.removeAttribute('hidden');
    $selectOptionsPromt.removeAttribute('hidden');
    $navLinks.setAttribute('hidden', 'true');
    $save.setAttribute('hidden', 'true');
    $headerBottomBorder.classList.remove('bottom-border'); // Remove the class here
    $savedWordsView.setAttribute('hidden', 'true'); // Hide saved words view
  } else if (nameOfView === 'saved-words') {
    $entryForm.setAttribute('hidden', 'true');
    $save.setAttribute('hidden', 'true');
    $selectOptionsPromt.setAttribute('hidden', 'true');
    $navLinks.setAttribute('hidden', 'true');
    $headerBottomBorder.classList.add('bottom-border'); // Add the class here
    $savedWordsView.removeAttribute('hidden'); // Show saved words view
  }

  // Updating the data.view property to track the currently shown view
  data.view = nameOfView;
}

// *************************************************************************************************//

// ********************************** handleHomeButtonClick(event) ********************************//
// PURPOSE: Function to handle the home button click event
// PARAMETER: 'event' - The click event object
// RETURNS: None
function handleHomeButtonClick(event) {
  $backgroundColor.classList.remove('nav-background');
  $backgroundColor.classList.add('background-body-color');
  viewSwap('entry-form');
}

// *************************************************************************************************//

// ************************************* handleLogoClick(event) ************************************//
// PURPOSE: Function to handle the logo click event
// PARAMETER: 'event' - The click event object
// RETURNS: None
function handleLogoClick(event) {
  $backgroundColor.classList.remove('nav-background');
  $backgroundColor.classList.add('background-body-color');
  viewSwap('entry-form');
}

// Adding a 'click' event listener to the home button
$homeLink.addEventListener('click', handleHomeButtonClick);

// Adding a 'click' event listener to the keywords list button
$logo.addEventListener('click', handleLogoClick);

// *************************************************************************************************//

// ************************************** renderOptions(options) ***********************************//
// PURPOSE: Defining a function called 'renderOptions' which will generate a DOM tree for each entry
// in the array, and append that DOM tree to the unordered list. connected to a li(s) to
// div[data-view="list-words-options"]
// PARAMETER: 'options' - Array of options to render
// RETURNS: None

// AKA: Function to render selectable options as buttons though creating a DOM tree
function renderOptions(options) {

  // Clearing any existing options
  $entriesList.textContent = '';

  // Looping through options and create buttons for each
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
        // else add to the array
        selectedButtons.push(buttonText);

        button.classList.add('focus');
      }
    });
  });
}

// *************************************************************************************************//

// *********************************** renderKeywordList(savedWords) ********************************//
// PURPOSE: Defining a function named 'renderKeywordList' The function should generate and return a DOM
// tree from the savedWords (global) array each element in that array needs to match figma
// PARAMETER: None
// RETURNS: None

// AKA: Function to render saved words list by creating a DOM tree
function renderKeywordList() {
  let keywordsCounter = 0;

  // Clearing any existing saved words
  $savedWordsList.textContent = '';

  data.entries.forEach((entry, entryIndex) => {
    if (entry.selectedButtons.length > 0) {
      const date = document.createElement('p');
      const wordTypedIn = document.createElement('p');
      wordTypedIn.classList.add('word-typed-in');
      wordTypedIn.textContent = 'YOU TYPED: ' + entry.definition;
      date.textContent = entry.newdate;
      date.classList.add('date-info');
      $savedWordsList.appendChild(wordTypedIn);
      $savedWordsList.appendChild(date);

      entry.selectedButtons.forEach((savedWord, selectedButtonIndex) => {
        const extractedWord = extractWord(savedWord);
        const li = document.createElement('li');
        const wordAndDef = document.createElement('p');
        const deleteButton = document.createElement('i');
        deleteButton.classList.add('fa', 'fa-trash', 'delete', 'column-delete');
        wordAndDef.classList.add('word-and-def', 'column-word-and-def');
        li.classList.add('saved-word');
        wordAndDef.textContent = extractedWord;
        li.appendChild(wordAndDef);
        li.appendChild(deleteButton);

        // Setting data attributes for entryIndex and selectedButtonIndex
        deleteButton.setAttribute('data-entry-index', entryIndex);
        deleteButton.setAttribute('data-button-index', selectedButtonIndex);

        $savedWordsList.appendChild(li);
        keywordsCounter++;

        // Adding click event listener to the delete button
        deleteButton.addEventListener('click', () => {
          // Showing the delete modal when the delete button is clicked
          $deleteModal.classList.add('block');

          // Getting the entry index and selected button index from data attributes
          const entryIndexToDelete = event.target.getAttribute('data-entry-index');
          const selectedButtonIndexToDelete = event.target.getAttribute('data-button-index');

          // Converting the strings to integers
          newEntry.entryIdToDelete = parseInt(entryIndexToDelete);
          newEntry.selectedButtonIndexToDelete = parseInt(selectedButtonIndexToDelete);
        });
      });
    }
  });
  // Showing or hiding the "No entries" message as needed
  toggleNoEntries(keywordsCounter === 0);
}

function handleKeywordsListButtonClicked() {
  // Calling viewSwap to switch to the saved-words view
  viewSwap('saved-words');
}

// Adding a 'click' event listener to the KEYWORD LIST button
const $keywordsButton = document.querySelector('.keywords-button');
$keywordsButton.addEventListener('click', handleKeywordsListButtonClicked);

// *************************************************************************************************//

// *********************************** renderKeywordList(savedWords) ********************************//
// PURPOSE: Defining a function called 'extractWord' with a single parameter. which will need to ensure
// that the listed words don't have numbers attached to them
// PARAMETER: savedWord (array)
// RETURNS: returning that

// AKA: Function to extract the word from the saved word format (number. word)
function extractWord(savedWord) {
  // Spliting the saved word by the period
  const parts = savedWord.split('. ');
  if (parts.length === 2) {
    return parts[1]; // Returning the second part (the word)
  } else {
    return savedWord; // Returning the original saved word if format is unexpected
  }
}

// *************************************************************************************************//

// Adding  a click event listener to the 'SAVE WORDS' button
$saveButton.addEventListener('click', function () {

  if (newEntry.selectedButtons.length > 0) {
    renderKeywordList(newEntry);

    // Clearing the input and reset the form
    $defInput.value = '';
    $form.reset();

    // Clearing the existing options
    $entriesList.textContent = '';

    // Resetting the selectedButtons array
    selectedButtons.length = 0;

    toggleOptions(false);
    toggleSaveButton(false);
  }
});

function handleSaveButtonClick() {
  if (selectedButtons.length > 0) {
    newEntry.selectedButtons = selectedButtons.slice();

    // Rendering the saved words list
    renderKeywordList();

    // Clearing the input and reset the form
    $defInput.value = '';
    $form.reset();

    // Clearing the selectedButtons array
    selectedButtons.length = 0;

    // Calling the renderOptions function to update the options list
    renderOptions([]);

    // Showing the options list again after clearing it
    toggleOptions(false);

    // Toggling the save button
    toggleSaveButton(false);

    // Hiding the saved words view and show the entry form
    viewSwap('saved-words');

  } else {
    console.error('No newEntry data available.');
  }
}

function hideDeleteModal() {
  $deleteModal.classList.remove('block');
}

function handleConfirmDelete(entryIndex, selectedButtonIndex) {
  if (
    entryIndex !== -1 &&
    selectedButtonIndex !== -1 &&
    data.entries[entryIndex] &&
    data.entries[entryIndex].selectedButtons[selectedButtonIndex]
  ) {

    // Removing the button from the selectedButtons array
    data.entries[entryIndex].selectedButtons.splice(selectedButtonIndex, 1);

    // If selectedButtons array becomes empty, remove the entry from data.entries
    if (data.entries[entryIndex].selectedButtons.length === 0) {
      data.entries.splice(entryIndex, 1);
      data.nextEntryId--; // Decrement nextEntryId
    }

    // updating DOM tree
    renderKeywordList();

  } else {
    console.error('Selected button index or entry data not found.');
  }

  // Hiding the modal after removal
  hideDeleteModal();
}

function handleCancelDelete(event) {
  event.preventDefault(); // Prevent the default behavior of the link
  hideDeleteModal();
}

// toggleNoEntries() Function to toggle the visibility of the "No entries" message
function toggleNoEntries(show) {
  if (show) {
    $noEntriesMessage.classList.remove('hidden');
  } else {
    $noEntriesMessage.classList.add('hidden');
  }
}

// Adding a 'click' event listener to the 'SAVE WORDS' button
$saveButton.addEventListener('click', handleSaveButtonClick);

// Adding a 'click' event listener to the submit button
$searchButton.addEventListener('click', handleSubmit);

// Adding a 'click' event listener to the submit button
$navButton.addEventListener('click', handleNavIconClicked);

// Adding a 'click' event listener to the confirm delete button
$confirmDeleteButton.addEventListener('click', function () {
  // Passing entry index and selected button index to the function
  handleConfirmDelete(newEntry.entryIdToDelete, newEntry.selectedButtonIndexToDelete);
});

// Adding a 'click' event listener to the confirm delete button
$cancelDeleteButton.addEventListener('click', handleCancelDelete);

document.addEventListener('DOMContentLoaded', function () {
  renderKeywordList();

  // Showing the view which was displayed prior to page refresh, or default to "entries" view
  viewSwap(data.view);

  // to ensure that the user doesn't see
  // the save button when the pages reloads
  if (data.view === 'entry-form') {
    toggleSaveButton(false);
    toggleLoader(false);
  }
});
