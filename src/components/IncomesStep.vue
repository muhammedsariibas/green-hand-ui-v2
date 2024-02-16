<script lang="ts" setup>
import relativityDegreeData from "@/enums/RelativityDegreeData";
import occupationData from "@/enums/OccupationData";
import { useApplicationStore } from "@/stores/applicationStore";
import { isStringShorterThan } from "@/utils/StringUtils";
import { isDateEmpty } from "@/utils/DateUtil";
import { isNumberEmpty } from "@/utils/NumberUtil";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { onMounted, ref, watchEffect } from "vue";
import { fetchGet } from "../utils/fetchUtils";

//DATA
const applicationStore = useApplicationStore();
const incomes = ref(<any>[]);
const employeeData = ref<any>([]);
let snackbarStore = useSnackbarStore();
//ONMOUNTED
onMounted(() => {});

//FUNCTIONS
function addNewIncome() {
  incomes.value.push({
    id: 0,
    income: null,
    relativityDegree: null,
    name: null,
    occupation: null,
    comment: null,
    disabled: false,
    errorName: false,
    errorOccupation: false,
    errorIncome: false,
    errorComment: false,
  });
}

function removeIncome(index: any) {
  incomes.value.splice(index, 1);
}

function prepareEmployeeData() {
  var data = [];
  if (
    applicationStore.getCurrentApplication != null &&
    applicationStore.getCurrentApplication != undefined
  ) {
    data.push(applicationStore.getCurrentPersonalInfo.name);
    if (
      applicationStore.getCurrentHouseholdMembers != null &&
      applicationStore.getCurrentHouseholdMembers.length > 0
    ) {
      for (var member of applicationStore.getCurrentHouseholdMembers) {
        data.push(member.name);
      }
    }
  }

  return data;
}

function prepareIncomelist() {
  var returnArray: any = [];
  if (
    applicationStore.getCurrentHouseholdMembers != null &&
    applicationStore.getCurrentHouseholdMembers.length > 0
  ) {
    var incomeFromHouseholdMember =
      applicationStore.getCurrentHouseholdMembers.filter(
        (t: any) =>
          (t.workingStatus == "WORKING" || t.workingStatus == "RETIRED") &&
          t.id == 0
      );
    var currentInfo = applicationStore.getCurrentPersonalInfo;
    if (
      currentInfo.id == 0 &&
      (currentInfo.workingStatus === "WORKING" ||
        currentInfo.workingStatus === "RETIRED")
    ) {
      returnArray.push({
        id: 0,
        income: null,
        relativityDegree: "Kendisi",
        name: currentInfo.name,
        occupation: currentInfo.workingStatus,
        comment: null,
        disabled: false,
        errorName: false,
        errorOccupation: false,
        errorIncome: false,
        errorComment: false,
      });
    }

    incomeFromHouseholdMember.forEach((item: any) => {
      returnArray.push({
        id: 0,
        income: null,
        relativityDegree: item.relativityDegree,
        name: item.name,
        occupation: item.workingStatus,
        comment: null,
        disabled: false,
        errorName: false,
        errorOccupation: false,
        errorIncome: false,
        errorComment: false,
      });
    });


  }
  return returnArray;
}

 function validationOfIncomes() {
  let returnValue: boolean = false;
  console.log(incomes.value)
  if (incomes.value.length > 0) {
    for (var income of incomes.value) {
      console.log(incomes.value);
      console.log(income);
      if (isStringShorterThan(income.occupation, 2)) {
        income.errorOccupation = true;
        snackbarStore.makeToast(
          true,
          "error",
          "Lütfen gelir kaynağı bilgisini kontrol ediniz"
        );
        returnValue = false;
        break;
      } else if (income.occupation == "OTHER") {
        if (isStringShorterThan(income.comment, 2)) {
          income.errorComment = true;
          snackbarStore.makeToast(
            true,
            "error",
            "Lütfen Gelir kaynağı bilgisini kontrol ediniz"
          );
          returnValue = false;
          break;
        }
      }
      if (isStringShorterThan(income.name, 2)) {
        income.errorName = true;
        snackbarStore.makeToast(
          true,
          "error",
          "Lütfen çalışan kişinin adını kontrol ediniz"
        );
        returnValue = false;
        break;
      } else if (isNumberEmpty(income.income)) {
        console.log("furu");
        income.errorIncome = true;
        snackbarStore.makeToast(
          true,
          "error",
          "Lütfen gelir miktarını kontrol ediniz"
        );
        returnValue = false;
        break;
      } else {
        console.log("asd");
        delete income.disabled;
        delete income.errorName;
        delete income.errorOccupation;
        delete income.errorIncome;
        delete income.errorComment;
        incomes.value;
        applicationStore.application.incomes = incomes.value;
        returnValue = true;
      }
    }
   
  }else{
    applicationStore.application.incomes = incomes.value;
    returnValue = true
  }
  return returnValue;
}

defineExpose({
  validationOfIncomes,
});

//WATCHEFFECT
watchEffect(() => {
  console.log(applicationStore.getCurrentIncomes);
  if (applicationStore.getCurrentApplicationId != 0) {
    incomes.value = [];
    if (
      applicationStore.getCurrentIncomes != null ||
      applicationStore.getCurrentIncomes != undefined
    ) {
      
      incomes.value = [
        ...applicationStore.getCurrentIncomes.filter((t:any) => t.id != 0),
        ...prepareIncomelist(),
      ];
    }
  }else{
    incomes.value = prepareIncomelist()
  }
  if (applicationStore.getCurrentApplication) {
    employeeData.value = prepareEmployeeData();
  }
});
</script>
<template>
  <v-card class="bg-light d-flex flex-wrap" flat>
    <v-col class="d-flex justify-space-between" cols="12" sm="12" md="12"
      ><h1
        style="
          font-family: 'Roboto', sans-serif;
          font-family: 'Roboto Condensed', sans-serif;
          font-family: 'Roboto Slab', serif;
        "
      >
        Gelir Durumu
      </h1>
    </v-col>

    <v-col class="py-0">
      <li
        v-for="(income, index) in incomes"
        :key="index"
        style="list-style-type: none"
      >
        <v-col class="d-flex flex-wrap mx-0 p-0">
          <v-col
            cols="12"
            sm="5"
            md="5"
            style="padding-left: 0"
            class="d-flex flex-wrap"
          >
            <v-select
              :disabled="income.disabled"
              :error="income.errorOccupation"
              :items="occupationData"
              item-title="name"
              item-value="id"
              hide-details
              density="compact"
              v-model="income.occupation"
              clearable
              label="Gelir "
              variant="outlined"
              bg-color="#F5F5F5"
            ></v-select>
            <v-text-field
              :disabled="income.disabled"
              :error="income.errorComment"
              v-if="income.occupation == 'OTHER'"
              class="pl-3"
              hide-details
              density="compact"
              v-model="income.comment"
              clearable
              label="Gelir Kaynağı"
              variant="outlined"
              bg-color="#F5F5F5"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="4" md="4" style="padding-left: 0">
            <v-select
              :disabled="income.disabled"
              :error="income.errorName"
              :items="employeeData"
              item-title="name"
              hide-details
              density="compact"
              v-model="income.name"
              clearable
              label="Gelir Sahibi"
              variant="outlined"
              bg-color="#F5F5F5"
            ></v-select>
          </v-col>

          <v-col cols="12" sm="2" md="2" style="padding-left: 0">
            <v-text-field
              :error="income.errorIncome"
              hide-details
              density="compact"
              prefix="₺"
              v-model="income.income"
              clearable
              label="Gelir Miktarı"
              variant="outlined"
              bg-color="#F5F5F5"
              type="number"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="1" md="1" style="padding-left: 0">
            <v-btn
              :disabled="income.disabled"
              hide-details
              density="compact"
              style="height: 38px"
              @click="removeIncome(index)"
              block
              color="error"
              elevation="5"
              solo
              plain
            >
              SİL
            </v-btn>
          </v-col>
        </v-col>
        <v-divider thickness="1.5px" color="rgba(0,172,193,0.6)"></v-divider>
      </li>
      <v-col class="d-flex justify-center">
        <v-btn
          color="white"
          @click="addNewIncome"
          elevation="10"
          variant="tonal"
          style="background-color: rgb(84, 58, 183)"
          icon
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-col>
    {{ applicationStore.getCurrentIncomes }}
  </v-card>
</template>