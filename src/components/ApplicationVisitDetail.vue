<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { fetchGet, fetchPost } from "../utils/fetchUtils";
import ApplicationDetail from "./ApplicationDetail.vue";
import VisitListByAppId from "./VisitListByAppId.vue";
const props: any = defineProps(["applicationId"]);
const isIncomplete = ref<boolean>(false);
const application = ref<any>(null);
let tab = ref<any>(null);

async function changeIsIncomplete() {
  application.value.isIncomplete = !isIncomplete.value;
  console.log(isIncomplete.value);

  try {
    const response = await fetchPost(
      "/public/api/v1/application/0",
      { method: "POST" },
      application.value
    );
  } catch (Err) {}
}
onMounted(async () => {
  application.value = await fetchGet(
    `/api/v1/application/${props.applicationId}`
  );

  setTimeout(() => {
    isIncomplete.value = application.value.isIncomplete;
  }, 200);
});
</script>
<template>
  <v-col cols="12" sm="12" md="12" class="d-flex flex-wrap px-0 py-0">
    <v-col class="px-0 py-0">
      <v-tabs class="px-0 py-0" v-model="tab" density="compact">
        <v-col class="px-0 py-0">
          <v-tab variant="tonal" value="one">GENEL BİLGİLER</v-tab>
          <v-tab variant="tonal" value="two">ZİYARET TARİHÇE</v-tab>
        </v-col>
        <v-col class="px-0 py-0">
          <slot />
        </v-col>
      </v-tabs>
      <v-window v-model="tab" class="px-0 py-0">
        <v-window-item value="one" class="px-0 py-0">
          <v-col v-if="application != null" class="px-0 py-0">
            <application-detail :application="application">
              <v-switch
                @update:modelValue="changeIsIncomplete"
                color="red"
                label="Eksik Bilgi"
                v-model="isIncomplete"
                inset
              ></v-switch>
            </application-detail>
          </v-col>
        </v-window-item>

        <v-window-item value="two" class="px-0 py-0">
          <v-col v-if="application != null" class="px-0 py-0">
            <visit-list-by-app-id
              :application-id="application.id"
            ></visit-list-by-app-id>
          </v-col>
        </v-window-item>
      </v-window>
    </v-col>
  </v-col>
</template>