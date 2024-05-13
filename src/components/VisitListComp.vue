
<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { fetchPost } from "@/Utils/fetchUtils";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { ref } from "@vue/reactivity";
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component
import { fetchGet } from "@/Utils/fetchUtils";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-theme-balham.css"; // Optional theme CSS
 
import { GridOptions, LicenseManager } from "ag-grid-enterprise";
import "numeral";
import numeral from "numeral";
import { useI18n } from "vue-i18n";
import { tr } from "date-fns/locale";
const locale = tr;
const snackbarStore = useSnackbarStore();
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
LicenseManager.setLicenseKey(
  "For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-16_February_2023_[v2]_MTY3NjUwNTYwMDAwMA==5a37b6995fef0d066d9a3225009488ac"
);


//DATA
const { t } = useI18n();
const deleteDialog = ref(<boolean>false);
const date = ref([startOfMonth(new Date()), endOfMonth(new Date())]);
const gridApi = ref(<any>null);
let columnApi = ref(null);
const rowData = ref(<any>[]);
var param = ref(<any>null);
let isLoading = ref<boolean>(false);
    let visitIdForDelete = ref(<any>null);
const presetRanges = ref([
  { label: "Bugün", range: [new Date(), new Date()] },
  { label: "Bu ay", range: [startOfMonth(new Date()), endOfMonth(new Date())] },
  {
    label: "Son ay",
    range: [
      startOfMonth(subMonths(new Date(), 1)),
      endOfMonth(subMonths(new Date(), 1)),
    ],
  },
  { label: "Bu yıl", range: [startOfYear(new Date()), endOfYear(new Date())] },
  {
    label: "Bu yıl (slot)",
    range: [startOfYear(new Date()), endOfYear(new Date())],
    slot: "yearly",
  },
]);

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


//FUNCTIONS
function updateBottomRowData() {
  let total = 0;
  console.log(rowData.value);
  for (var i in rowData.value) {
    total += rowData.value[i].paidAmount;
  }
  gridApi.value.setPinnedBottomRowData([
    {
      paidAmount: total,
      visitDate: `Toplam  : ${rowData.value.length}`,
    },
  ]);
}

const updateData = (data: any) => {
  rowData.value = data;
};

async function onGridReady(params: any) {
  param.value = params;
  gridApi.value = params.api;
  columnApi.value = params.columnApi;
  var resp = await fetchGet("/api/v1/visitation/visits");

  updateData(resp);
  updateBottomRowData();
}

async function filterVisits() {
  try {
    var resp = await fetchGet(
      `/api/v1/visitation/visits?startDate=${date.value[0]}&endDate=${date.value[1]}`
    );
    
    updateData(resp);
  } catch (err) {}

  updateBottomRowData();
}

const columnDefs = ref([
  {
    field: "visitDate",
    headerName: "Ziyaret Tarihi",
    filter: "agTextColumnFilter",
  },
  {
    field: "application.applicant.name",
    headerName: "Ziyaret edilen adı",
    filter: "agTextColumnFilter",
  },
  {
    field: "greeter",
    headerName: "Karşılayan",
    filter: "agTextColumnFilter",
  },
  {
    field: "action",
    headerName: "Ziyaret sebebi",
    filter: "agTextColumnFilter",
    valueGetter : (params:any)=>{
      return params.node.data.action ? t(params.node.data.action) : null
    }
  },
  {
    field: "visitor.name",
    headerName: "Ziyaretçi",
    filter: "agTextColumnFilter",
  },
  {
    field: "explanation",
    headerName: "Açıklama",
    filter: "agTextColumnFilter",
  },
  {
    field: "paidAmount",
    headerName: "Ödeme",
    filter: "agTextColumnFilter",
    valueGetter: (params: any) => {
      var result: any = 0;
      result = numeral(params.node.data.paidAmount).format("#,#");
      return result;
    },
  },
]);

function getContextMenuItems(params: any) {
  return [
    {
      name: "Sil",
      action: async () => {
        deleteDialog.value = true;
        visitIdForDelete.value = params.node.data.id;
      },
    },
    "copy",
  ];
}

async function deleteVisit() {
    isLoading.value=true;
  
  var resp = await fetchGet(`/api/v1/visitation/${visitIdForDelete.value}`);
  if (resp.code == 200) {
    snackbarStore.makeToast(true,"success","İşlem başarılı")
  } else {
    snackbarStore.makeToast(true,"error","Bir problem oluştu.")
  }
  deleteDialog.value = false;
  isLoading.value=false;
}
</script>


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
    <v-col
      ><h2
        style="
          font-family: 'Roboto', sans-serif;
          font-family: 'Roboto Condensed', sans-serif;
          font-family: 'Roboto Slab', serif;
        "
      >
        Ziyaret Kayıtları
      </h2></v-col
    >
    <v-col
      class="d-flex flex-wrap"
      style="
        background-color: rgb(248, 248, 248);
        border: 1px solid rgb(186, 191, 199);
      "
    >
      <v-col cols="12" md="4" style="padding: 0">
        <VueDatePicker
          id="dialogDatePick"
          style="padding: 0"
          v-model="date"
          auto-apply
          locale="tr"
          :format-locale="tr"
          format="dd/MM/yyyy"
          :enable-time-picker="false"
          text-input
          :teleport="true"
          :clearable="false"
          range
          :preset-ranges="presetRanges"
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
        class="ag-theme-balham"
        :columnDefs="columnDefs"
        @grid-ready="onGridReady"
        :defaultColDef="defaultColDef"
        :gridOptions="gridOptions"
        :getContextMenuItems="getContextMenuItems"
        :rowData="rowData"
        :enableFilter="true"
      >
      </ag-grid-vue>
    </div>

    <v-dialog width="600" v-model="deleteDialog" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">Onay Durumu</span>
        </v-card-title>
        <v-card-text class="d-flex flex-wrap px-0">
          <v-col class="px-6">İşleminizi onaylıyor musunuz</v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="plain" @click="deleteDialog = false">
            İptal
          </v-btn>
          <v-btn color="success" variant="tonal" @click="deleteVisit">
            Onayla
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>
  