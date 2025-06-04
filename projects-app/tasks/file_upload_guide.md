# How to Add File & Image Uploads to Task Comments

Want to allow users to upload files and images in task comments? Here's a step-by-step guide to make it happen.

---

## 1. Set Up Supabase Storage

- Create a new **storage bucket** in your Supabase dashboard.  
- Set security rules:
  - Public access for **viewing files**
  - Authenticated access for **uploading files**

---

## 2. Update Your Database Schema

Add an `attachments` field to your `comments` table to store file data:

```sql
ALTER TABLE comments 
ADD COLUMN attachments JSONB DEFAULT '[]'::jsonb NOT NULL;
```

---

## 3. Build the File Upload UI

- Add hidden file input elements with `ref`s
- Create buttons to trigger those inputs
- Show a preview of selected files
- Update the comment submission button to reflect the loading state

---

## 4. Implement File Handling Logic

- Write functions to handle file selection
- Upload selected files to Supabase Storage
- Generate public URLs for uploaded files
- Track and show upload progress

---

## 5. Update Comment Submission Logic

- Update your form handler to support text + attachments
- Ensure files are uploaded **before** submitting the comment
- Save file metadata (URLs, types) in the database

---

## 6. Display Attachments in Comments

- Update your comment component to show attachments
- Render images and other file types differently
- Include:
  - Image previews/thumbnails
  - Download links for other files

---

## 7. Add Error Handling

- Display user-friendly error messages
- Validate file size and type
- Gracefully handle upload errors

---

## 8. Optional Enhancements

- Show progress bars for large uploads
- Enable drag-and-drop file selection
- Compress or resize images before uploading
- Add a lightbox to view images full-screen

---

By following these steps, you’ll be able to support file and image uploads in your task comments section with a polished user experience.
