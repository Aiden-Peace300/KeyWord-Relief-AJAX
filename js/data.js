/* exported data */
// adding an event listener to the beforeunload event of the window object.
// When the user is about to leave or reload the webpage,
// the handleStorage function will be executed.
window.addEventListener('beforeunload', handleStorage);

let data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1
};

// getItem() => retrieve data from the browser's local storage
const previousDataJSON = localStorage.getItem('Javascript-local-storage');

// Checking if previousDataJSON is not null and parse it if it has a value
if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);

  // Ensure that data.entries is always an array, even when parsing from local storage
  if (!Array.isArray(data.entries)) {
    data.entries = [];
  }
}

function handleStorage(event) {
  // stringify() => static method converts a JavaScript value to a JSON string
  const dataJSON = JSON.stringify(data);

  // setItem() => store data in the browser's local storage
  localStorage.setItem('Javascript-local-storage', dataJSON);
}
