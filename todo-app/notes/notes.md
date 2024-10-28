# Task Breakdown

## Feature Descriptions and Instructions

1. **Deep Watching in Vue.js**

   - Use `watch` with `deep: true` to observe changes in deeply nested properties within an object. This ensures that Vue watches each nested property individually, rather than just top-level properties.

2. **Edit Note Workflow**

   - When editing a note:
     - Load the selected note's details into the original input fields (title, content, tags).
     - Switch the form button label from "Add" to "Save" to signify that an edit is in progress.

3. **Detail View for Notes**

   - Define a route `/detail/{id}` to access individual note details.
   - Use a UUID to generate unique IDs for notes.
   - Load all notes from `localStorage` and look up the note by its ID.
   - If a note does not exist, display a "Note not found" message.

4. **Note Structure**

   - Ensure each note has:
     - `title`: The main title of the note.
     - `content`: The body or main text of the note.
     - `tags`: An array of strings categorizing the note (e.g., `[ "cooking", "family", "programming" ]`).

5. **Creating and Editing Notes**

   - To handle both creation and editing within the same form:
     - Create an object, e.g., `currentNote`, representing the note currently being edited or created.
     - When the user clicks "edit" on a note, load its data into `currentNote`, allowing the form to automatically bind and update this object.
     - Use Vue's reactivity to keep the form data in sync with `currentNote`.

6. **Page Refresh on Save**

   - Automatically refresh the page after a note is saved to display updated content immediately.

7. **Make the Form Fully Reactive**
   - Ensure all form fields respond to changes in the `currentNote` object, so updates are instantly reflected.

## Task Management System

1. **User List**

   - Maintain a list of users, each with:
     - `Id`: Unique identifier for each user.
     - `Name`, `Email`, and `Password`: Basic user information.

2. **Local Storage for User Data**

   - Use `localStorage` to persist user information across sessions.
   - Check for the presence of a user upon page load. If no user is found, create a new user entry.

3. **App.vue Logic**
   - Place the logic for handling user creation, loading, and authentication within `App.vue`.
