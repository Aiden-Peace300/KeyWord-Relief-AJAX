// Get references to HTML elements
const $form = document.getElementById('input-form');
const $submitButton = document.querySelector('.submit-button');
const $defInput = document.getElementById('def');

// Add 'click' event listener to the submit button
$submitButton.addEventListener('click', function (event) {
  event.preventDefault(); // Prevent page from refreshing

  // Get the input value from the textarea
  const definition = $defInput.value;

  if (definition.length === 0) {
    alert('Please enter a definition.'); // Add validation for empty input
    return;
  }

  // Create a new entry object
  const newEntry = {
    entryId: data.nextEntryId,
    definition
  };

  // Increment the nextEntryId in the data model
  data.nextEntryId++;

  // Add the new entry to the beginning of the entries array
  data.entries.unshift(newEntry);

  // Clear the input
  $defInput.value = '';

  // Reset the form
  $form.reset();
});
