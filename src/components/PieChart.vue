<template>
  <div style="width: 100%" class="px-10 py-3">
    <div style="display: flex; justify-content: center">
      <button type="button" @click="switchLegend">Switch</button>
    </div>
    <DoughnutChart style="height: 380px" v-bind="doughnutChartProps" />
  </div>
</template>
    
    <script lang='ts' setup>
import { computed, defineComponent, ref, onMounted } from "vue";
import { DoughnutChart, useDoughnutChart } from "vue-chart-3";
import { Chart, ChartData, ChartOptions, registerables } from "chart.js";
import { fetchGet } from "@/utils/fetchUtils";
Chart.register(...registerables);
const applicantList = ref([]);
const approvedApplications = ref([]);
const a = ref();
const b = ref();
onMounted(async () => {
  applicantList.value = await fetchGet(
    "/api/v1/application?statuses=NEW&statuses=WAITING"
  );
  approvedApplications.value = await fetchGet(
    "/api/v1/application?statuses=APPROVED"
  );
  a.value = applicantList.value.length;
  b.value = approvedApplications.value.length;
});

const dataValues = ref([a, b]);
const dataLabels = ref(["Başvuru", "Onaylanan"]);
const toggleLegend = ref(true);

const testData: any = computed(() => ({
  labels: dataLabels.value,
  datasets: [
    {
      data: dataValues.value,
      backgroundColor: ["#77CEFF", "#0079AF"],
    },
  ],
}));

const options = computed<ChartOptions<"doughnut">>(() => ({
  scales: {
    myScale: {
      type: "logarithmic",
      position: toggleLegend.value ? "left" : "right",
    },
  },
  plugins: {
    legend: {
      position: toggleLegend.value ? "top" : "bottom",
    },
    title: {
      display: true,
    },
  },
}));

const { doughnutChartProps, doughnutChartRef } = useDoughnutChart({
  chartData: testData,
  options,
});

let index = ref(<any>20);

function shuffleData() {
  // dataValues.value = shuffle(dataValues.value);
  dataValues.value.push(index.value);
  dataLabels.value.push("Other" + index.value);

  index.value++;
}

function switchLegend() {
  toggleLegend.value = !toggleLegend.value;
}
</script>
  
    