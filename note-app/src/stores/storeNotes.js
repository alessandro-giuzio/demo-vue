import { defineStore } from 'pinia';

export const useStoreNotes = defineStore('storeNotes', {
  state: () => ({
    notes: [
      {
        id: 'id1',
        content:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem ipsa commodi sint ut ullam culpa nulla molestiae sunt quia qui maxime, enim quasi officiis aperiam fugit, corrupti omnis, eaque animi.',
      },
      {
        id: 'id2',
        content: 'This is a shorter note',
      },
      {
        id: 'id3',
        content:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem ipsa commodi sint ut ullam culpa nulla molestiae sunt quia qui maxime, enim quasi officiis aperiam fugit, corrupti omnis, eaque animi.',
      },
      {
        id: 'id4',
        content: 'This is a shorter note',
      },
    ],
  }),
  actions: {
    addNote(newNoteContent) {
      let currentDate = new Date().getTime();
      let id = currentDate.toString();
      let note = {
        id,
        content: newNoteContent,
      };
      this.notes.unshift(note);
    },
    deleteNote(idToDelete) {
      this.notes = this.notes.filter((note) => note.id !== idToDelete);
    },
  },
});
