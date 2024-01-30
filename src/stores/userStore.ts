
// import { defineStore } from "pinia";

// export const useUserStore = defineStore({
//   id: 'user-store',

//   state: () => {
//     return {
//       currentUser:{} as any
//     }
//   },
//   actions: {
//     async fetchCurrentUser() {
//         try{

//           const urlManager = useUrlManager();
//           const {data:user} = await useAuthFetch<CommonResponse>(urlManager.Base.User.Me());


//           if(user.value != null)
//           {
//             this.$state.currentUser = user.value.data as User;
//           }

//         }catch(err){

//         }
//     }
//   },
//   getters: {
//     getCurrentUser: state => state.currentUser
//   },
// })