<template>
  <v-col class="px-0 py-0">
    <v-dialog v-model="isLoading" persistent>
      <v-col
        style="height: 100vh; width: 100%"
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
    <v-col>
      <h2
        style="
          font-family: 'Roboto', sans-serif;
          font-family: 'Roboto Condensed', sans-serif;
          font-family: 'Roboto Slab', serif;
        "
      >
        Ziyaret Rapor
      </h2>
    </v-col>
    <v-col
      class="d-flex flex-wrap"
      style="
        background-color: rgb(248, 248, 248);
        border: 1px solid rgb(186, 191, 199);
      "
    >
      <v-col cols="12" md="3" style="padding: 0">
        <VueDatePicker
          style="padding: 0"
          v-model="date"
          locale="tr"
          :format-locale="tr"
          year-picker
          :teleport="true"
          :clearable="false"
        >
          <template #yearly="{ label, range, presetDateRange }">
            <span @click="presetDateRange(range)">{{ label }}</span>
          </template>
        </VueDatePicker>
      </v-col>
      <v-col style="padding: 0" cols="12" md="3">
        <v-btn @click="filterVisits" color="primary">Filtrele</v-btn></v-col
      >
    </v-col>

    <div>
      <ag-grid-vue
        style="height: calc(100vh - 280px)"
        class="ag-theme-alpine"
        :columnDefs="columnDefs"
        @grid-ready="onGridReady"
        :defaultColDef="defaultColDef"
        :gridOptions="gridOptions"
        :getContextMenuItems="getContextMenuItems"
        :rowData="rowData"
        :enableFilter="true"
        :pinned-bottom-row-data="pinnedBottomRowData"
      >
      </ag-grid-vue>
    </div>
  </v-col>
</template>
  
  <script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref } from "@vue/reactivity";
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component
import { fetchGet } from "@/Utils/fetchUtils";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import "ag-grid-enterprise";
import { GridOptions, LicenseManager } from "ag-grid-enterprise";
import { onMounted, onUpdated } from "vue";
import "numeral";
import numeral from "numeral";
import { tr } from "date-fns/locale";
const locale = tr;
LicenseManager.setLicenseKey(
  "For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-16_February_2023_[v2]_MTY3NjUwNTYwMDAwMA==5a37b6995fef0d066d9a3225009488ac"
);


const date = ref(new Date().getFullYear());
const gridApi = ref(<any>null);
let columnApi = ref(null);
const rowData = ref([]);
const isLoading = ref<any>(false);
const months: any = {
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
};

var pinnedBottomRowData: Array<any> = [];

const sumOfTotalPaidAmount = ref(<any>0);
function sumMonthsPaid(elm: any) {
  if (elm.visitMonth == 1) {
    months.jan = numeral(numeral(months.jan).value() + elm.paidAmount).format(
      "#,#"
    );
  }

  if (elm.visitMonth == 2) {
    months.feb = numeral(months.feb).value();
    months.feb = months.feb + elm.paidAmount;
    months.feb = numeral(months.feb).format("#,#");
  }

  if (elm.visitMonth == 3) {
    months.mar = numeral(numeral(months.mar).value() + elm.paidAmount).format(
      "#,#"
    );
  }

  if (elm.visitMonth == 4) {
    months.apr = numeral(months.apr).value();
    months.apr = months.apr + elm.paidAmount;
    months.apr = numeral(months.apr).format("#,#");
  }

  if (elm.visitMonth == 5) {
    months.may = numeral(months.may).value();
    months.may = months.may + elm.paidAmount;
    months.may = numeral(months.may).format("#,#");
  }

  if (elm.visitMonth == 6) {
    months.jun = numeral(months.jun).value();
    months.jun = months.jun + elm.paidAmount;
    months.jun = numeral(months.jun).format("#,#");
  }

  if (elm.visitMonth == 7) {
    months.jul = numeral(months.jul).value();
    months.jul = months.jul + elm.paidAmount;
    months.jul = numeral(months.jul).format("#,#");
  }

  if (elm.visitMonth == 8) {
    months.aug = numeral(months.aug).value();
    months.aug = months.aug + elm.paidAmount;
    months.aug = numeral(months.aug).format("#,#");
  }
  if (elm.visitMonth == 9) {
    months.sep = numeral(months.sep).value();
    months.sep = months.sep + elm.paidAmount;
    months.sep = numeral(months.sep).format("#,#");
  }
  if (elm.visitMonth == 10) {
    months.oct = numeral(months.oct).value();
    months.oct = months.oct + elm.paidAmount;
    months.oct = numeral(months.oct).format("#,#");
  }
  if (elm.visitMonth == 11) {
    months.nov = numeral(months.nov).value();
    months.nov = months.nov + elm.paidAmount;
    months.nov = numeral(months.nov).format("#,#");
  }
  if (elm.visitMonth == 12) {
    months.dec = numeral(months.dec).value();
    months.dec = months.dec + elm.paidAmount;
    months.dec = numeral(months.dec).format("#,#");
  }
}

onMounted(async () => {
  const arr: any[] = [];
  const year = new Date().getFullYear();
  var resp = await fetchGet(`/api/v1/visitation/${year}/report`);
  resp.forEach((elm: any) => {
    sumMonthsPaid(elm);

    const filter = arr.filter((t) => t.applicantId == elm.applicantId);

    if (filter.length > 0) {
      assignToMonth(elm.visitMonth, elm.paidAmount, filter[0]);
    } else {
      const newElm = Object.assign({}, elm);
      newElm.months = {};

      assignToMonth(elm.visitMonth, elm.paidAmount, newElm);
      arr.push(newElm);
    }
    console.log(arr);
    updateData(arr);
  });

  updateBottomRowData();
});

function assignToMonth(visitMonth: any, paidAmount: any, elm: any) {
  console.log(`paidAmount ${paidAmount}`);
  switch (visitMonth) {
    case 1:
      elm.months.jan = numeral(
        numeral(elm.months.jan).value() + paidAmount
      ).format("0,0");
      break;
    case 2:
      elm.months.feb = numeral(
        numeral(elm.months.feb).value() + paidAmount
      ).format("0,0");
      break;
    case 3:
      elm.months.mar = numeral(
        numeral(elm.months.mar).value() + paidAmount
      ).format("0,0");
      break;
    case 4:
      elm.months.apr = numeral(
        numeral(elm.months.apr).value() + paidAmount
      ).format("#,#");
      break;
    case 5:
      elm.months.may = numeral(
        numeral(elm.months.may).value() + paidAmount
      ).format("#,#");
      break;
    case 6:
      elm.months.jun = numeral(
        numeral(elm.months.jun).value() + paidAmount
      ).format("#,#");
      break;
    case 7:
      elm.months.jul = numeral(
        numeral(elm.months.jul).value() + paidAmount
      ).format("#,#");
      break;
    case 8:
      elm.months.aug = numeral(
        numeral(elm.months.aug).value() + paidAmount
      ).format("#,#");
      break;
    case 9:
      elm.months.sep = numeral(
        numeral(elm.months.sep).value() + paidAmount
      ).format("#,#");
      break;
    case 10:
      elm.months.oct = numeral(
        numeral(elm.months.oct).value() + paidAmount
      ).format("#,#");
      break;
    case 11:
      elm.months.nov = numeral(
        numeral(elm.months.nov).value() + paidAmount
      ).format("#,#");
      break;
    case 12:
      elm.months.dec = numeral(
        numeral(elm.months.dec).value() + paidAmount
      ).format("#,#");
      break;
  }
}

const gridOptions: GridOptions = {
  rowSelection: "single",
  animateRows: true,
  masterDetail: true,
  detailRowHeight: 300,
};

const defaultColDef = {
  sortable: true,
  filter: true,
  flex: 1,
  floatingFilter: true,
};

function onGridReady(params: any) {
  gridApi.value = params.api;
  columnApi.value = params.columnApi;
  updateBottomRowData();
}

function updateBottomRowData() {
  let total = 0;
  for (var i in months) {
    total += numeral(months[i]).value() ?? 0;
  }
  console.log({
    toplam: total,
    months: months,
  });

  gridApi.value.setPinnedBottomRowData([
    {
      toplam: total,
      months: months,
      name: `Toplam  : ${rowData.value.length}`,
    },
  ]);
}

async function filterVisits() {
  isLoading.value = true;
  for (let i in months) {
    months[i] = 0;
  }
  const arr: any[] = [];

  var resp = await fetchGet(`/api/v1/visitation/${date.value}/report`);

  if (resp.length > 0) {
    resp.forEach((elm: any) => {
      sumMonthsPaid(elm);

      const filter = arr.filter((t) => t.applicantId == elm.applicantId);

      if (filter.length > 0) {
        assignToMonth(elm.visitMonth, elm.paidAmount, filter[0]);
      } else {
        const newElm = Object.assign({}, elm);
        newElm.months = {};

        assignToMonth(elm.visitMonth, elm.paidAmount, newElm);
        console.log(newElm);
        arr.push(newElm);
      }
      updateData(arr);
    });
  } else {
    updateData(arr);
  }
  updateBottomRowData();

  isLoading.value = false;
}

const updateData = (data: any) => {
  rowData.value = data;
};

const columnDefs = ref([
  {
    field: "name",
    headerName: "Ad",
    filter: "agTextColumnFilter",
  },
  {
    field: "addressProvince",
    headerName: "Şehir",
    filter: "agTextColumnFilter",
  },
  {
    field: "addressDistrict",
    headerName: "İlçe",
    filter: "agTextColumnFilter",
  },
  {
    field: "addressNeighborhood",
    headerName: "Mahalle",
    filter: "agTextColumnFilter",
  },
  {
    field: "toplam",
    headerName: "Toplam",
    filter: "agTextColumnFilter",
    valueGetter: (params: any) => {
      var result = 0;
      for (const i in params.node.data.months) {
        result += numeral(params?.node?.data?.months[i]).value() ?? 0;
      }

      sumOfTotalPaidAmount.value = sumOfTotalPaidAmount.value + result;
      return numeral(result).format("#,#");
    },
  },
  {
    field: "months.jan",
    headerName: "Ocak",
    filter: "agTextColumnFilter",
  },
  {
    field: "months.feb",
    headerName: "Şubat",
    filter: "agTextColumnFilter",
  },
  {
    field: "months.mar",
    headerName: "Mart",
    filter: "agTextColumnFilter",
  },
  {
    field: "months.apr",
    headerName: "Nisan",
    filter: "agTextColumnFilter",
  },
  {
    field: "months.may",
    headerName: "Mayıs",
    filter: "agTextColumnFilter",
  },
  {
    field: "months.jun",
    headerName: "Haziran",
    filter: "agTextColumnFilter",
  },
  {
    field: "months.jul",
    headerName: "Temmuz",
    filter: "agTextColumnFilter",
  },
  {
    field: "months.aug",
    headerName: "Ağustos",
    filter: "agTextColumnFilter",
  },
  {
    field: "months.sep",
    headerName: "Eylül",
    filter: "agTextColumnFilter",
  },
  {
    field: "months.oct",
    headerName: "Ekim",
    filter: "agTextColumnFilter",
  },
  {
    field: "months.nov",
    headerName: "Kasım",
    filter: "agTextColumnFilter",
  },
  {
    field: "months.dec",
    headerName: "Aralık",
    filter: "agTextColumnFilter",
  },
]);

function getContextMenuItems(params: any) {
  return ["copy"];
}
</script>