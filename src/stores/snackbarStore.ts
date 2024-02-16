

import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbarStore', {
  state: () => ({
    isOpen: false as boolean | null,
    color: null as string | null,
    text: null as string | null,
  }),
  actions: {
    makeToast(isOpen: boolean, color: string, text: string | null) {
      
      this.isOpen = isOpen
      this.color = color
      this.text = text

      setTimeout(()=>{
        this.isOpen = false
        this.color = null
        this.text = null
      },1000)
    }
  },
  getters: {
    getSnackbar(state) {
      return state
    },
  },
})
