what does watch deep:true, do?
when editing a note, load note into original input field and change button from add to save.
detail view for note
generate id [uuid]
/detail/{id}
load all notes from localStorage and look for item with id
show not found, if note does not exist
more info for note
title
content
tags [notes for cooking, family, programming] (just attach as array of string to the note)

To handle both creating and editing notes with the same form, think about how you can manage the note's data. You’ll need a way to store the details of the note that’s currently being edited or created. What if you had an object that represents the "current" note, which the form could always work with? How might you update this object when the user clicks "edit" on an existing note?

REFRESH THE PAGE AUTOMATICLY WHEN YOU SAVE A NOTE
MAKE ALL THE FORM REACTIVE

Task Management Tools
List of Users with: Id, Names, Email and Passwords
Use Local Store
Check for user at load page if not user save a new one
write the logic in the App.vue component
