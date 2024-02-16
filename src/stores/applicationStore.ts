import { defineStore } from 'pinia'
export const useApplicationStore = defineStore('app', {
  state: () => ({
    application: {
      id: 0,
      applicant: {
        id: 0,
        name: null,
        surname: null,
        birthDate: null,
        birthPlace: null,
        gender: null,
        maritalStatus: null,
        educationLevel: null,
        educationStatus: null,
        workingStatus: null,
        propertyStatus: null,
        province: null,
        socialSecurityNo: null,
        district: null,
        neighborhood: null,
        addressProvince: null,
        addressDistrict: null,
        addressNeighborhood: null,
        addressStreet: null,
        address: null,
        buildingNo: null,
        apartmentNo: null,
        healthStatus: null,
      },
      householdMembers: <any>[

      ],
      incomes: [

      ],
      properties: [

      ]
      ,
      peopleInNeed: [],
      status: 'WAITING',

    }
  }),
  getters: {
    getCurrentApplication(state) {
      return state.application
    },
    getCurrentPersonalInfo(state) {
      return state.application.applicant;
    },
    getCurrentHouseholdMembers(state) {
      return state.application.householdMembers
    },
    getCurrentIncomes(state) {
      return state.application.incomes
    },
    getCurrentApplicationId(state) {
      return state.application.id;
    },
    getCurrentproperties(state) {
      return state.application.properties;
    }
  }

})



// {
//   id:0,
//   name: null,
//   surname: null,
//   birthDate: null,
//   birthPlace: null,
//   gender: null,
//   maritalStatus: null,
//   educationLevel: null,
//   educationStatus: null,
//   phone: null,
//   email: null,
//   address: null,
//   relativityDegree: null,
//   healthStatus:null
// }

// {
//   id:0,
//   income: null,
//   relativityDegree: null,
//   name: null,
//   occupation: null
// }

// {
//   id:0,
//   name: null,
//   type: null,
//   income: null,
// }

// {
//   id:0,
//   relativityDegree: null,
//   name: null,
//   note: null,
// }