<script lang="ts" setup>
import workingStatus from "@/enums/WorkingStatus";
import educationLevel from "@/enums/EducationLevel";
import educationStatus from "@/enums/EducationStatus";
import genders from "@/enums/Gender";
import maritalStatus from "@/enums/MaritalStatus";
import propertyStatusData from "@/enums/PropertyStatus";
import relativityDegreeData from "@/enums/RelativityDegreeData";
import healthStatus from "@/enums/HealthStatus";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useApplicationStore } from "@/stores/applicationStore";
import { isStringShorterThan } from "@/utils/StringUtils";
import { isDateEmpty } from "@/utils/DateUtil";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { tr } from "date-fns/locale";
import { onMounted, ref, watchEffect } from "vue";
import { fetchGet } from "../utils/fetchUtils";

//DATA
const locale = tr;
let householdMembers = ref(<any>[]);
let provinceData = ref(<any>[]);
let applicationStore = useApplicationStore();
let snackbarStore = useSnackbarStore();

//FUNCTIONS
async function fetchProvince() {
  return await fetchGet("/public/api/v1/geo/country/1/province");
}

function addNewHouseholdMember() {
  householdMembers.value.push({
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
    phone: null,
    email: null,
    address: null,
    relativityDegree: null,
    healthStatus: null,
    comment: null,
    disabled: null,
    errorRelativityDegree: false,
    errorName: false,
    errorSurname: false,
    errorBirthDate: false,
    errorGender: false,
    errorBirthPlace: false,
    errorMaritalStatus: false,
    errorEducationLevel: false,
    errorEducationStatus: false,
    errorWorkingStatus: false,
    errorProvince: false,
    errorDistrict: false,
    errorNeighborhood: false,
    errorHealthStatus: false,
    errorComment: false,
  });
}

function removeHouseholdMember(index: any) {
  householdMembers.value.splice(index, 1);
}

function validationOfHouseholdMembers() {
  let returnValue: boolean = false;
  if (householdMembers.value.length > 0) {
    for (var member of householdMembers.value) {
      if (isStringShorterThan(member.relativityDegree, 2)) {
        member.errorRelativityDegree = true;
        snackbarStore.makeToast(
          true,
          "error",
          "Lütfen yakınlık derecesi kısmını kontrol ediniz"
        );
        returnValue = false;
        break;
      } else if (member.relativityDegree == "OTHER") {
        if (isStringShorterThan(member.comment, 2)) {
          member.errorComment = true;
          snackbarStore.makeToast(
            true,
            "error",
            "Lütfen yakınlık derecesi kısmını kontrol ediniz"
          );
          returnValue = false;
          break;
        }
      }

      if (isStringShorterThan(member.name, 2)) {
        member.errorName = true;
        snackbarStore.makeToast(true, "error", "Lütfen adı kontrol ediniz");
        returnValue = false;
        break;
      } else if (isStringShorterThan(member.surname, 2)) {
        member.errorSurname = true;
        snackbarStore.makeToast(true, "error", "Lütfen soyadı kontrol ediniz");
        returnValue = false;
        break;
      } else if (isDateEmpty(member.birthDate, new Date().getFullYear())) {
        snackbarStore.makeToast(
          true,
          "error",
          "Lütfen doğum tarihini kontrol ediniz"
        );
        returnValue = false;
        break;
      } else if (member.gender == null) {
        member.errorGender = true;
        snackbarStore.makeToast(true, "error", "Lütfen cinsiyeti seçiniz");
        returnValue = false;
        break;
      } else if (isStringShorterThan(member.birthPlace, 2)) {
        member.errorBirthPlace = true;
        snackbarStore.makeToast(true, "error", "Lütfen doğum yerini seçiniz");
        returnValue = false;
        break;
      } else if (member.maritalStatus == null) {
        member.errorMaritalStatus = true;
        snackbarStore.makeToast(
          true,
          "error",
          "Lütfen medeni durumunu seçiniz"
        );
        returnValue = false;
        break;
      } else if (member.educationLevel == null) {
        member.errorEducationLevel = true;
        snackbarStore.makeToast(
          true,
          "error",
          "Lütfen eğitim durumunu seçiniz"
        );
        returnValue = false;
        break;
      } else if (member.educationStatus == null) {
        member.errorEducationStatus = true;
        snackbarStore.makeToast(
          true,
          "error",
          "Lütfen eğitim durumunu seçiniz"
        );
        returnValue = false;
        break;
      } else if (member.workingStatus == null) {
        member.errorWorkingStatusError = true;
        snackbarStore.makeToast(
          true,
          "error",
          "Lütfen çalışma durumunu seçiniz"
        );
        returnValue = false;
        break;
      } else if (member.healthStatus == null) {
        member.errorHealthStatus = true;
        snackbarStore.makeToast(
          true,
          "error",
          "Lütfen çalışma durumunu seçiniz"
        );
        returnValue = false;
        break;
      } else {
        delete member.disabled;
        delete member.errorRelativityDegree;
        delete member.errorName;
        delete member.errorSurname;
        delete member.errorBirthDate;
        delete member.errorGender;
        delete member.errorBirthPlace;
        delete member.errorMaritalStatus;
        delete member.errorEducationLevel;
        delete member.errorEducationStatus;
        delete member.errorWorkingStatus;
        delete member.errorProvince;
        delete member.errorDistrict;
        delete member.errorNeighborhood;
        delete member.errorHealthStatus;
        delete member.errorComment;

        applicationStore.application.householdMembers = householdMembers.value;
        returnValue = true;
      }
    }
  }else{
    returnValue = true
  }
  return returnValue;
}

defineExpose({validationOfHouseholdMembers})

//ONMOUNTED
onMounted(async () => {
  provinceData.value = await fetchProvince();
});

//WATCHEFFECT
watchEffect(() => {
  if(householdMembers.value.length >0){
    for (var member of householdMembers.value) {
    if (member.name != null) {
      member.name = member.name?.toUpperCase();
    }
    if (member.surname != null) {
      member.surname = member.surname?.toUpperCase();
    }
    if (member.birthPlace != null) {
      member.birthPlace = member.birthPlace?.toUpperCase();
    }
  }
  }
  if (applicationStore.getCurrentApplicationId != 0) {
    console.log(applicationStore.getCurrentHouseholdMembers);
    if (
      applicationStore.getCurrentHouseholdMembers != null ||
      applicationStore.getCurrentHouseholdMembers != undefined
    ) {
      householdMembers.value = applicationStore.getCurrentHouseholdMembers;
    }
  }
});
</script>
<template>
  <v-card class="bg-light d-flex flex-wrap" flat >
    <v-col class="d-flex justify-space-between py-0" cols="12" sm="12" md="12" >
      <h1
        class="py-0"
        style="
          font-family: 'Roboto', sans-serif;
          font-family: 'Roboto Condensed', sans-serif;
          font-family: 'Roboto Slab', serif;
        "
      >
        Aile Bireyleri
      </h1>
    </v-col>

    <v-col cols="12" sm="12" md="12" class="py-0" >
      <li
        v-for="(member, index) in householdMembers"
        :key="index"
        style="list-style-type: none"
      >
        <v-col class="d-flex flex-wrap mx-0 p-0">
          <v-col cols="11" sm="11" md="11" class="d-flex flex-wrap m-0 py-0">
            <v-col
              cols="12"
              sm="3"
              md="3"
              style="padding-left: 0"
              class="d-flex flex-wrap"
            >
              <v-select
                :error="member.errorRelativityDegree"
                hide-details
                density="compact"
                v-model="member.relativityDegree"
                clearable
                :items="relativityDegreeData"
                item-value="id"
                item-title="name"
                label="Yakınlık Derecesi"
                variant="outlined"
                bg-color="#F5F5F5"
              ></v-select>
              <v-text-field
                :error="member.errorComment"
                style="padding-left: 6px"
                v-if="member.relativityDegree == 'OTHER'"
                hide-details
                density="compact"
                v-model="member.comment"
                clearable
                label="Yakınlık Derecesi"
                variant="outlined"
                bg-color="#F5F5F5"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="3" md="3" style="padding-left: 0">
              <v-text-field
                :error="member.errorName"
                hide-details
                density="compact"
                v-model="member.name"
                clearable
                label="Ad"
                variant="outlined"
                bg-color="#F5F5F5"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="3" md="3" style="padding-left: 0">
              <v-text-field
                :error="member.errorSurname"
                bg-color="#F5F5F5"
                style="opacity: 0-2"
                hide-details
                density="compact"
                clearable
                v-model="member.surname"
                label="Soyad"
                variant="outlined"
              ></v-text-field
            ></v-col>

            <v-col cols="12" sm="3" md="3" style="padding-left: 0">
              <VueDatePicker
                v-model="member.birthDate"
                locale="tr"
                auto-apply
                :format-locale="tr"
                placeholder="Doğum Tarihi"
                format="dd/MM/yyyy"
                :enable-time-picker="false"
                text-input
                :teleport="true"
              />
            </v-col>

            <v-col cols="12" sm="2" md="2" style="padding-left: 0">
              <v-select
                :error="member.errorGender"
                hide-details
                v-model="member.gender"
                density="compact"
                clearable
                label="Cinsiyetiniz"
                :items="genders"
                item-title="name"
                item-value="id"
                variant="outlined"
                bg-color="#F5F5F5"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="2" md="2" class="pl-0">
              <v-autocomplete
                :error="member.errorBirthPlace"
                hide-details
                density="compact"
                clearable
                bg-color="#F5F5F5"
                v-model="member.birthPlace"
                label="Doğum yeri"
                :items="provinceData"
                item-value="name"
                item-title="name"
                variant="outlined"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="2" md="2" style="padding-left: 0">
              <v-select
                :error="member.errorMaritalStatus"
                bg-color="#F5F5F5"
                hide-details
                density="compact"
                clearable
                v-model="member.maritalStatus"
                label="Medeni Durumu"
                :items="maritalStatus"
                item-title="name"
                item-value="id"
                variant="outlined"
              ></v-select>
            </v-col>

            <v-col
              cols="12"
              sm="3"
              md="3"
              class="d-flex"
              style="padding-left: 0"
            >
              <v-select
                :error="member.errorEducationLevel"
                bg-color="#F5F5F5"
                hide-details
                density="compact"
                clearable
                v-model="member.educationLevel"
                label="Eğitim Durumu"
                :items="educationLevel"
                item-title="name"
                item-value="id"
                variant="outlined"
              ></v-select>

              <v-select
                :error="member.errorEducationStatus"
                label="Eğitim Durumu"
                bg-color="#F5F5F5"
                style="padding-left: 6px"
                v-if="member.educationLevel !== null"
                hide-details
                density="compact"
                clearable
                v-model="member.educationStatus"
                :items="educationStatus"
                item-title="name"
                item-value="id"
                variant="outlined"
              ></v-select>

              <v-select
                :error="member.errorWorkingStatusError"
                bg-color="#F5F5F5"
                style="padding-left: 6px"
                v-if="member.educationStatus !== null"
                hide-details
                density="compact"
                clearable
                v-model="member.workingStatus"
                label="İş Durumu"
                :items="workingStatus"
                item-title="name"
                item-value="id"
                variant="outlined"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="3" md="3" style="padding-left: 0">
              <v-select
                :error="member.errorHealthStatus"
                bg-color="#F5F5F5"
                hide-details
                density="compact"
                clearable
                v-model="member.healthStatus"
                label="Sağlık Durumu"
                :items="healthStatus"
                item-title="name"
                item-value="id"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-col>

          <v-col cols="10" sm="1" md="1" class="pr-0">
            <v-btn
              hide-details
              density="compact"
              style="height: 38px"
              @click="removeHouseholdMember(index)"
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
    </v-col>
    <v-col class="d-flex justify-center">
      <v-btn
        color="white"
        @click="addNewHouseholdMember"
        elevation="10"
        variant="tonal"
        style="background-color: rgb(84, 58, 183)"
        icon
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
     
    </v-col>
  </v-card>
</template>
