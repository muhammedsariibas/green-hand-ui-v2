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
        ><v-btn @click="filterChartByYear" color="priMarty">Filtrele</v-btn>
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
    months.value.Ocak = months.value.Ocak + elm.paidAmount;
  }

  if (elm.visitMonth == 2) {
    months.value.Şubat = months.value.Şubat + elm.paidAmount;
  }

  if (elm.visitMonth == 3) {
    months.value.Mart = months.value.Mart + elm.paidAmount;
  }

  if (elm.visitMonth == 4) {
    months.value.Nisan = months.value.Nisan + elm.paidAmount;
  }

  if (elm.visitMonth == 5) {
    months.value.Mayıs = months.value.Mayıs + elm.paidAmount;
  }

  if (elm.visitMonth == 6) {
    months.value.Haziran = months.value.Haziran + elm.paidAmount;
  }

  if (elm.visitMonth == 7) {
    months.value.Temmuz = months.value.Temmuz + elm.paidAmount;
  }

  if (elm.visitMonth == 8) {
    months.value.Ağustos = months.value.Ağustos + elm.paidAmount;
  }

  if (elm.visitMonth == 9) {
    months.value.Eylül = months.value.Eylül + elm.paidAmount;
  }
  if (elm.visitMonth == 10) {
    months.value.Ekim = months.value.Ekim + elm.paidAmount;
  }
  if (elm.visitMonth == 11) {
    months.value.Kasım = months.value.Kasım + elm.paidAmount;
  }
  if (elm.visitMonth == 12) {
    months.value.Aralık = months.value.Aralık + elm.paidAmount;
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
  Ocak: 0,
  Şubat: 0,
  Mart: 0,
  Nisan: 0,
  Mayıs: 0,
  Haziran: 0,
  Temmuz: 0,
  Ağustos: 0,
  Eylül: 0,
  Ekim: 0,
  Kasım: 0,
  Aralık: 0,
});
const sumOfTotalPaidAmount = ref(<any>0);

Chart.register(...registerables);

const chartData = computed(() => ({
  labels: [
    
  ],
  datasets: [
    {
      label : 'Miktar(tl)',
      data: months.value,
      backgroundColor: ["#77CEFF", "#0079AF", "#123E6B", "#97B0C4", "#A5C8ED"],
    },
  ],
}));

const { barChartProps, barChartRef } = useBarChart({
  chartData,
});
</script>
    
    