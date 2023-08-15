/* exported data */
// When the user is about to leave or reload the webpage,
// the handleStorage function will be executed.
window.addEventListener('beforeunload', handleStorage);

let data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1
};

function handleStorage(event) {
  // stringify() => static method converts a JavaScript value to a JSON string
  const dataJSON = JSON.stringify(data);

  // setItem() => store data in the browser's local storage
  localStorage.setItem('Javascript-local-storage', dataJSON);
}
