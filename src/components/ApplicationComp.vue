<script lang="ts" setup>
import PersonalInfoStep from "@/components/PersonalInfoStep.vue";
import HouseHoldMemberStep from "./HouseholdMemberStep.vue";
import IncomesStep from "./IncomesStep.vue";
import ApplicationDetail from "./ApplicationDetail.vue";
import ExpensesStep from "./ExpensesStep.vue";
import { useApplicationStore } from "@/stores/applicationStore";
import { useSnackbarStore } from "@/stores/snackbarStore";
import router from "@/router";
import { fetchGet } from "@/utils/fetchUtils";
import { computed, onMounted, ref, watchEffect } from "vue";
import { fetchPost } from "../utils/fetchUtils";
import { useRoute } from "vue-router";
import { watch } from "fs";
const emit = defineEmits<{
  (e: 'closeDialog', value: boolean): void
}>()
const route = useRoute();
const path:any = computed(() => route.path);
const props: any = defineProps(["applicationId" , "resize"]);
const applicationStore = useApplicationStore();
const snackbarStore = useSnackbarStore();
const personalInfo = ref(<any>null);
const householdMember = ref(<any>null);
const incomes = ref(<any>null);
const expenses = ref(<any>null);
const nextText = ref<any>("İleri");
const prevText = ref(<any>"Ana Sayfaya Dön")
const isLoading = ref<boolean>(false);
var steps = ref<any>([
  { id: "1", code: "personalInfo", name: "Kişisel Bilgiler" },
  { id: "2", code: "househouldMember", name: "Aile Bireyleri" },
  { id: "3", code: "incomeInfo", name: "Gelir Bilgileri" },
  { id: "4", code: "applicationDetail", name: "Başvuru Detayları" },
]);
var e1 = ref<any>(null);

onMounted(async () => {
  console.log(props.applicationId);
  if (props.applicationId != null && props.applicationId != undefined) {
    var resp = await fetchGet(
      `/public/api/v1/application/${props.applicationId}`
    );

    if (resp.id != 0) {
      console.log(resp.id);
      applicationStore.application = resp;
    }
  }
});

watchEffect(()=>{
  
})

async function goToNextPage(next: any) {
  console.log(e1.value);
  switch (e1.value) {
    case "1":
      if (await personalInfo.value.validationOfapplicant()) {
        prevText.value = "Geri"
        next();
      }
      break;
    case "2":
      if (householdMember.value.validationOfHouseholdMembers()) {
        next();
      }
      break;
    case "3":
      nextText.value = "Kaydet";
      if (
        incomes.value.validationOfIncomes() &&
        expenses.value.validationOfExpenses()
      ) {
        next();
      }
      break;
    case "4":
      postApplication();
      break;
    default:
  }
}
function goToPrevPage(prev: any) {
  if(e1.value == "1"){
   
    router.push("/")
  }else if(e1.value == "2" ){
    prevText.value = "Ana Sayfaya Dön"
    prev();
  }else{
    prev();
  }

}

async function postApplication() {
  isLoading.value = true;
  try {
    const _currentApplication = JSON.parse(
      JSON.stringify(applicationStore.getCurrentApplication)
    );

    const response = await fetchPost(
      "/public/api/v1/application/0",
      { method: "POST" },
      _currentApplication
    );
    if (response.code === 200) {
      snackbarStore.makeToast(true, "success", "İşlem Başarılı");
      console.log(path.value)
      if(path.value == '/application'){
        router.push({ path: "/success" });
      }
      isLoading.value = false;
      setTimeout(() => {
        applicationStore.$reset();
      }, 500);
    }else{
      snackbarStore.makeToast(true, "error", "İşlem Başarısız.");
      isLoading.value = false;
    }
  } catch (Err) {
    snackbarStore.makeToast(true, "error", "Bir sorun oluştu.");
    isLoading.value = false;
  }
  emit("closeDialog" , false);
}
</script>
<template>
  <v-col cols="12" sm="12" md="12" class="px-0 py-0" >
    <v-dialog v-model="isLoading" persistent>
      <v-col
        style="height: 100vh; width: 100% ;" 
        class="d-flex justify-center align-center"
      >
        <v-progress-circular
          color="primary"
          indeterminate
          :size="83"
          :width="9"
        ></v-progress-circular>
      </v-col>
    </v-dialog>
  
    <v-stepper v-model="e1" bg-color="white" elevation="0">
      
      <template v-slot:default="{ prev, next }">
        <v-stepper-header>
          <template v-for="n in steps" :key="n.id">
            <v-stepper-item
              color="success"
              :complete="e1 > n.id"
              :step="`Step {{ n.id }}`"
              :value="n.id"
              >{{ n.name }}</v-stepper-item
            >

            <v-divider v-if="n.id != steps.length" :key="n"></v-divider>
          </template>
        
        </v-stepper-header>
  

        
        <v-stepper-window >
          <v-stepper-window-item value="1"  >
            <v-card class="stepTemplateCard" rounded="false" >
              <PersonalInfoStep ref="personalInfo" />
            </v-card>
          </v-stepper-window-item>

          <v-stepper-window-item value="2" >
            <v-card flat class="stepTemplateCard px-0 py-0" rounded="false" style="overflow-y: scroll;"
              ><HouseHoldMemberStep  ref="householdMember"></HouseHoldMemberStep
            ></v-card>
          </v-stepper-window-item>
          <v-stepper-window-item value="3">
            <v-card class="stepTemplateCard px-0 py-0" rounded="false" style="overflow-y: scroll;">
              <v-col cols="12" sm="12" md="12" class="px-0 py-0"
                ><IncomesStep ref="incomes"
              /></v-col>
              <v-col cols="12" sm="12" md="12" class="px-0 py-0"
                ><ExpensesStep ref="expenses"
              /></v-col>
            </v-card>
          </v-stepper-window-item>
          <v-stepper-window-item value="4">
            <v-card class="stepTemplateCard px-0 py-0" rounded="false" style="overflow-y: scroll;"
              ><ApplicationDetail
                :application="applicationStore.getCurrentApplication"
            /></v-card>
          </v-stepper-window-item>
        </v-stepper-window>

        <v-stepper-actions
          
          :next-text="nextText"
          :prev-text="prevText"
          color="success"
          :disabled="false"
          @click:prev="goToPrevPage(prev)"
          @click:next="goToNextPage(next)"
        >
        </v-stepper-actions>
      </template>
    </v-stepper>
  </v-col>
</template>

<style  scoped>
.stepTemplateCard {
  height: calc(100vh - 220px);
}
</style>
