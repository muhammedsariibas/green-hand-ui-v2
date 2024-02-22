<script lang="ts" setup>
import relativityDegreeData from "@/enums/RelativityDegreeData";
import occupationData from "@/enums/OccupationData";
import expenseData from "@/enums/ExpenseData";
import { useApplicationStore } from "@/stores/applicationStore";
import { isStringShorterThan } from "@/utils/StringUtils";
import { isDateEmpty } from "@/utils/DateUtil";
import { isNumberEmpty } from "@/utils/NumberUtil";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { onMounted, ref, watchEffect } from "vue";
import { fetchGet } from "../utils/fetchUtils";

//DATA
const applicationStore = useApplicationStore();
const expenses = ref(<any>[]);
const employeeData = ref<any>([]);
let snackbarStore = useSnackbarStore();

//FUNCTIONS
function prepareExpensesList() {
  var returnArray: any = [];
  if (
    applicationStore.getCurrentHouseholdMembers != null &&
    applicationStore.getCurrentHouseholdMembers.length > 0
  ) {
    

    var expensesFromHouseholdMember =
      applicationStore.getCurrentHouseholdMembers.filter(
        (t: any) =>
          (t.healthStatus == "CHRONIC_PATIENT" ||
            t.healthStatus == "PERSON_IN_NEED") &&
          t.id == 0
      );

    expensesFromHouseholdMember.forEach((item: any) => {
      returnArray.push({
        id: 0,
        name: item.healthStatus,
        type: null,
        income: null,
        comment: null,
        note: null,
        disabled: true,
        errorName: false,
        errorOccupation: false,
        errorIncome: false,
        errorComment: false,
        errorNote: false,
      });
    });
  }

  var currentInfo = applicationStore.getCurrentPersonalInfo;
  if (currentInfo.id == 0 && currentInfo.propertyStatus === "RENT") {
    returnArray.push({
      id: 0,
      name: currentInfo.propertyStatus,
      type: null,
      income: null,
      comment: null,
      note: null,
      disabled: true,
      errorName: false,
      errorOccupation: false,
      errorIncome: false,
      errorComment: false,
      errorNote: false,
    });
  }

  return returnArray;
}
function addNewExpense() {
  expenses.value.push({
    id: 0,
    name: null,
    type: null,
    income: null,
    comment: null,
    note: null,
    disabled: false,
    errorName: false,
    errorOccupation: false,
    errorIncome: false,
    errorComment: false,
    errorNote: false,
  });
}
function removeExpense(index: any) {
  expenses.value.splice(index, 1);
}

//WATCHEFFECT
watchEffect(() => {
  if (applicationStore.getCurrentApplicationId != 0) {
    expenses.value = [];
    if (
      applicationStore.getCurrentproperties != null ||
      applicationStore.getCurrentproperties != undefined
    ) {
      expenses.value = [
        ...applicationStore.getCurrentproperties.filter((t: any) => t.id != 0),
        ...prepareExpensesList(),
      ];
    }
  } else {
    expenses.value = prepareExpensesList();
  }
});

function validationOfExpenses() {
  let returnValue: boolean = false;
  console.log(expenses.value)
  if (expenses.value.length > 0) {
    for (var expense of expenses.value) {
      if (isStringShorterThan(expense.name, 2)) {
        expense.errorName = true;
        snackbarStore.makeToast(true, "error", "Gider kısmını kontrol ediniz");
        returnValue = false;
        console.log("1")
        break;
      } else if (expense.name == "OTHER") {
        if (isStringShorterThan(expense.comment, 2)) {
          expense.commentError = true;
          snackbarStore.makeToast(
            true,
            "error",
            "Gider kaynağını kontrol ediniz"
          );
          returnValue = false;
          console.log("2")
          break;
        }
      }

      if (expense.name == "RENT") {
        if (expense.income == 0 || expense.income == null) {
          expense.errorIncome = true;
          snackbarStore.makeToast(
            true,
            "error",
            "Kira için gider tutarını kontrol ediniz"
          );
          console.log("3")
          returnValue = false;
          break;
        }else {
        delete expense.disabled;
        delete expense.errorName;
        delete expense.errorOccupation;
        delete expense.errorIncome;
        delete expense.errorComment;
        delete expense.errorNote;
        applicationStore.application.properties = expenses.value;
        returnValue = true;
      }
      } else {
        delete expense.disabled;
        delete expense.errorName;
        delete expense.errorOccupation;
        delete expense.errorIncome;
        delete expense.errorComment;
        delete expense.errorNote;
        applicationStore.application.properties = expenses.value;
        returnValue = true;
      }
    }
  }else{
    applicationStore.application.properties = expenses.value;
    returnValue = true;
  }
  console.log(returnValue)
  return returnValue;
}

defineExpose({validationOfExpenses})
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
        Gider Bilgileri
      </h1>
    </v-col>
    <v-col class="py-0">
      <li
        v-for="(item, index) in expenses"
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
              :disabled="item.disabled"
              :error="item.errorName"
              :items="expenseData"
              item-title="name"
              item-value="id"
              hide-details
              density="compact"
              v-model="item.name"
              clearable
              label="Gider"
              variant="outlined"
              bg-color="#F5F5F5"
            ></v-select>

            <v-text-field
              :disabled="item.disabled"
              :error="item.errorComment"
              class="pl-3"
              v-if="item.name == 'OTHER'"
              hide-details
              density="compact"
              v-model="item.comment"
              clearable
              label="Gider Kaynağı"
              variant="outlined"
              bg-color="#F5F5F5"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="4" style="padding-left: 0">
            <v-text-field
              :error="item.errorNote"
              hide-details
              density="compact"
              v-model="item.note"
              clearable
              label="Açıklama"
              variant="outlined"
              bg-color="#F5F5F5"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="2" md="2" style="padding-left: 0">
            <v-text-field
              :error="item.errorIncome"
              hide-details
              density="compact"
              prefix="₺"
              type="number"
              v-model="item.income"
              clearable
              label="Gider Tutarı"
              variant="outlined"
              bg-color="#F5F5F5"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="1" md="1" style="padding-left: 0">
            <v-btn
              :disabled="item.disabled"
              hide-details
              density="compact"
              style="height: 38px"
              @click="removeExpense(index)"
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
          @click="addNewExpense"
          elevation="10"
          variant="tonal"
          style="background-color: rgb(84, 58, 183)"
          icon
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-col>
  </v-card>
</template>