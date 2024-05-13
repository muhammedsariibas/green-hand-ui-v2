<script setup lang="ts">
import { Chart, registerables } from "chart.js";
import { BarChart, useBarChart } from "vue-chart-3";
import { ref } from "@vue/reactivity";
import { computed, onMounted } from "@vue/runtime-core";
import { fetchGet } from "@/utils/fetchUtils";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { tr } from "date-fns/locale";
const locale = tr;

onMounted(async () => {
  const provinceResult = await fetchGet(
    "/public/api/v1/geo/country/1/province"
  );
  provinceData.value = provinceResult;
});

let neighborhoodData = ref<any>([]);
let provinceData = ref<any>([]);
let districtData = ref<any>([]);
let labelData = ref<any>([]);
let approvedApp = ref<any>([]);
let totalApp = ref<any>([]);
let selectedNeighborhood = ref<any>({
    neighborhoodId : 0
});

async function filterChartByNeighborhood() {
    console.log(selectedNeighborhood)
  var resp = await fetchGet(`/api/v1/application/application-statistics/${selectedNeighborhood.value.neighborhoodId}`);
  labelData.value = resp.map((item: any) => item.street_name);
  approvedApp.value = resp.map((item: any) => item.approved_application);
  totalApp.value = resp.map((item: any) => item.application);
}

async function getDistrictData(isForceEmpty: boolean) {
  if (isForceEmpty) {
    selectedNeighborhood.value.district = null;
  }

  if (
    selectedNeighborhood.value.province?.id == undefined ||
    selectedNeighborhood.value.province?.id == null
  ) {
    districtData.value = [];
  } else {
    const districtResult = await fetchGet(
      `/public/api/v1/geo/province/${selectedNeighborhood.value.province?.id}/district`
    );
    districtData.value = districtResult;
  }

  if (selectedNeighborhood.value.district != null) {
    getNeighborhoodData(false);
  }
}
async function getNeighborhoodData(isForceEmpty: boolean) {
  if (isForceEmpty) {
    selectedNeighborhood.value.neighborhoodId = null;
  }
  if (
    selectedNeighborhood.value?.district?.id == undefined ||
    selectedNeighborhood.value?.district?.id == null
  ) {
    neighborhoodData.value = [];
  } else {
    const neighborhoodResult = await fetchGet(
      `/public/api/v1/geo/district/${selectedNeighborhood.value?.district?.id}/neighborhood`
    );
    neighborhoodData.value = neighborhoodResult;
  }
}

const chartData = computed(() => ({
  labels: labelData.value,
  datasets: [
    {
      label: "Toplam Başvuru",
      data: totalApp.value,
      backgroundColor: "rgba(54, 162, 235, 0.5)",
    },
    {
      label: "Onaylanan Başvuru",
      data: approvedApp.value,
      backgroundColor: "rgb(57,202,28,0.7)",
    },
  ],
}));
Chart.register(...registerables);
const { barChartProps, barChartRef } = useBarChart({
  chartData,
});
</script>
<template>
  <v-col id="app">
    <v-col class="d-flex flex-wrap">
      <v-col cols="12" sm="9" md="9" class="d-flex">
        <v-autocomplete
          variant="outlined"
          density="compact"
          hide-details
          clearable
          bg-color="#F5F5F5"
          v-model="selectedNeighborhood.province"
          label="Memleketi"
          :items="provinceData"
          item-value="id"
          item-title="name"
          return-object
          @update:modelValue="getDistrictData(true)"
        ></v-autocomplete>

        <v-autocomplete
          variant="outlined"
          density="compact"
          style="padding-left: 6px"
          hide-details
          bg-color="#F5F5F5"
          v-if="selectedNeighborhood.province != null"
          clearable
          v-model="selectedNeighborhood.district"
          label="İlçesi"
          :items="districtData"
          item-value="id"
          item-title="name"
          @update:modelValue="getNeighborhoodData(true)"
          return-object
        ></v-autocomplete>

        <v-autocomplete
          variant="outlined"
          density="compact"
          style="padding-left: 6px"
          hide-details
          bg-color="#F5F5F5"
          v-if="selectedNeighborhood.district != null"
          clearable
          v-model="selectedNeighborhood.neighborhoodId"
          label="Mahalle "
          :items="neighborhoodData"
          item-title="name"
          item-value="id"
        ></v-autocomplete>
      </v-col>
      <v-col
        ><v-btn @click="filterChartByNeighborhood" color="priMarty"
          >Filtrele</v-btn
        >
      </v-col>
    </v-col>
    <BarChart style="height: 560px" v-bind="barChartProps" />
  </v-col>
</template>