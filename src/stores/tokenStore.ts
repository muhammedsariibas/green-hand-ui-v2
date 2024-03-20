import { defineStore } from 'pinia'

export interface Token {
  token : string|null;
  isTokenExist : boolean|null;
}



export const useTokenStore = defineStore('token', {
  state: () => ({
    token : null, 
    isTokenExist : true, 
  } as Token),
  
  getters : {
    getToken(state){
      return state.token;
    },
    getTokenExist(state){
        return state.isTokenExist;
    }
  },
  

})
