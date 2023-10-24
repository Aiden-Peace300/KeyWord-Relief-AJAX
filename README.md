# KEYWORD RELIEF - AJAX PROJECT

<img width="1277" alt="keyword relief web application" src="https://github.com/Aiden-Peace300/KeyWord-Relief-AJAX/assets/47370726/78648b46-c6b0-4ab8-9c6c-550d73900f94">

## Overview
Welcome to the Keyword relief web application, a dynamic project showcasing the power of HTML, CSS, and JavaScript. This project is a testament to my proficiency in DOM manipulation, developed as a solo endeavor. It serves as a valuable tool for writers looking to expand their vocabulary.

## Features
### 1. Create an Entry
- Users can effortlessly create new entries, providing a streamlined way to document words or phrases they want to remember.
### 2. Discover New Words
- My application harnesses the capabilities of AI to suggest five words along with their definitions. It's the perfect tool to help users find that elusive word they can't quite think of.
### 3. View Past Vocabulary
- Easily revisit and explore the words and phrases you've saved in the past. Your past entries are conveniently stored and accessible for future reference.
### 4. Remove Entries
- If a word or phrase is no longer needed, users can quickly remove it from their past vocabulary with a simple deletion feature.

## API Integration
To power my word suggestion feature, I've integrated the [OpenAI GPT Chat Completions API](https://platform.openai.com/docs/guides/gpt/chat-completions-api). This API enables the application to provide contextually relevant word suggestions, enriching your vocabulary.

## How It Works
My application leverages local storage to persist your data, ensuring that your past entries are retained even after closing your browser. This is made possible through the usage of the `localStorage` object in JavaScript. The `handleStorage` function is called when you're about to leave or reload the webpage, saving your data to the local storage to keep it safe and accessible.

```javascript
// Adding an event listener to the beforeunload event of the window object.
// When the user is about to leave or reload the webpage,
// the handleStorage function will be executed.
window.addEventListener('beforeunload', handleStorage);

// Define an initial data object
let data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1
};

// Attempt to retrieve data from local storage
const previousDataJSON = localStorage.getItem('Javascript-local-storage');

if (previousDataJSON !== null) {
  // Parse the data if it exists and ensure data.entries is always an array
  data = JSON.parse(previousDataJSON);
  if (!Array.isArray(data.entries)) {
    data.entries = [];
  }
}

function handleStorage(event) {
  // Serialize the data object to a JSON string
  const dataJSON = JSON.stringify(data);

  // Store the JSON data in the browser's local storage
  localStorage.setItem('Javascript-local-storage', dataJSON);
}
```

## Get Started
To get started, simply follow these steps:

1. Create a new entry to save a word or phrase.
2. Explore word suggestions to discover new vocabulary.
3. Revisit your past entries in the "Past Vocabulary" section.
4. Delete entries you no longer need by using the provided delete feature.

## Contact 
If you have any suggestions or feedback, please feel free to reach out to me.
Email: aidenpeacecodes@gmail.com

Happy writing, and may your vocabulary always be expansive!
