<template>
  <v-col id="app">
    <v-col class="d-flex flex-wrap">
      <v-col cols="12" md="7">
        <VueDatePicker
          style="padding: 0"
          :format-locale="tr"
          format="dd/MM/yyyy"
          v-model="date"
          locale="tr"
          year-picker
          :teleport="true"
          :clearable="false"
          ><template #yearly="{ label, range, presetDateRange }">
          </template> </VueDatePicker
      ></v-col>
      <v-col
        ><v-btn @click="filterChartByYear" color="primary">Filtrele</v-btn>
      </v-col>
    </v-col>
    <BarChart style="height: 560px" v-bind="barChartProps" />
  </v-col>
</template>
    
<script lang="ts" setup>
import { Chart, registerables } from "chart.js";
import { BarChart, useBarChart } from "vue-chart-3";
import { ref } from "@vue/reactivity";
import { computed, onMounted } from "@vue/runtime-core";
import { fetchGet } from "@/utils/fetchUtils";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { tr } from "date-fns/locale";
const locale = tr;
onMounted(() => {
  const arr: any[] = [];

  var resp = fetchGet(`/api/v1/visitation/${date.value}/report`);
  resp.then((result) =>
    result.forEach((elm: any) => {
      sumMonthsPaid(elm);
    })
  );
});

function sumMonthsPaid(elm: any) {
  if (elm.visitMonth == 1) {
    months.value.jan = months.value.jan + elm.paidAmount;
  }

  if (elm.visitMonth == 2) {
    months.value.feb = months.value.feb + elm.paidAmount;
  }

  if (elm.visitMonth == 3) {
    months.value.mar = months.value.mar + elm.paidAmount;
  }

  if (elm.visitMonth == 4) {
    months.value.apr = months.value.apr + elm.paidAmount;
  }

  if (elm.visitMonth == 5) {
    months.value.may = months.value.may + elm.paidAmount;
  }

  if (elm.visitMonth == 6) {
    months.value.jun = months.value.jun + elm.paidAmount;
  }

  if (elm.visitMonth == 7) {
    months.value.jul = months.value.jul + elm.paidAmount;
  }

  if (elm.visitMonth == 8) {
    months.value.aug = months.value.aug + elm.paidAmount;
  }

  if (elm.visitMonth == 9) {
    months.value.sep = months.value.sep + elm.paidAmount;
  }
  if (elm.visitMonth == 10) {
    months.value.oct = months.value.oct + elm.paidAmount;
  }
  if (elm.visitMonth == 11) {
    months.value.nov = months.value.nov + elm.paidAmount;
  }
  if (elm.visitMonth == 12) {
    months.value.dec = months.value.dec + elm.paidAmount;
  }
}

function filterChartByYear() {
  for (let i in months.value) {
    months.value[i] = null;
  }
  var resp = fetchGet(`/api/v1/visitation/${date.value}/report`);
  resp.then((result) =>
    result.forEach((elm: any) => {
      sumMonthsPaid(elm);
    })
  );
}

const date = ref(<any>new Date().getFullYear());

const months = ref(<any>{
  jan: 0,
  feb: 0,
  mar: 0,
  apr: 0,
  may: 0,
  jun: 0,
  jul: 0,
  aug: 0,
  sep: 0,
  oct: 0,
  nov: 0,
  dec: 0,
});
const sumOfTotalPaidAmount = ref(<any>0);

Chart.register(...registerables);

const chartData = computed(() => ({
  labels: [
    "ocak",
    "şubat",
    "mart",
    "nisan",
    "mayıs",
    "haziran",
    "temmuz",
    "ağustos",
    "eylül",
    "ekim",
    "kasım",
    "aralık",
  ],
  datasets: [
    {
      data: months.value,
      backgroundColor: ["#77CEFF", "#0079AF", "#123E6B", "#97B0C4", "#A5C8ED"],
    },
  ],
}));

const { barChartProps, barChartRef } = useBarChart({
  chartData,
});
</script>
    
    