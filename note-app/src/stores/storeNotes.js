import { defineStore } from 'pinia'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/js/firebase'

export const useStoreNotes = defineStore('storeNotes', {
  state: () => ({
    notes: [
      /* {
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
      }, */
    ]
  }),
  actions: {
    async getNotes() {
      const querySnapshot = await getDocs(collection(db, 'notes'))
      querySnapshot.forEach((doc) => {
        let note = {
          id: doc.id,
          content: doc.data().content
        }
        this.notes.push(note)
      })
    },

    addNote(newNoteContent) {
      let currentDate = new Date().getTime()
      let id = currentDate.toString()
      let note = {
        id,
        content: newNoteContent
      }
      this.notes.unshift(note)
    },

    deleteNote(idToDelete) {
      this.notes = this.notes.filter((note) => note.id !== idToDelete)
    },

    updateNote(id, content) {
      let index = this.notes.findIndex((note) => note.id === id)
      this.notes[index].content = content
    }
  },
  getters: {
    getNoteContent: (state) => {
      return (id) => {
        return state.notes.filter((note) => note.id === id)[0].content
      }
    },
    totalNotesCounts: (state) => {
      return state.notes.length
    },
    totalCharactersCount: (state) => {
      let count = 0
      state.notes.forEach((note) => {
        count += note.content.length
      })
      return count
    }
  }
})
