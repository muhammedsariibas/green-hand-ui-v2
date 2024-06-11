
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
import AgGridUtils from "@/utils/AgGridUtil";
import { GridOptions, LicenseManager } from "ag-grid-enterprise";
import "numeral";
import numeral from "numeral";
import { useI18n } from "vue-i18n";
import { tr } from "date-fns/locale";
const props: any = defineProps(["applicationId"]);
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


const gridOptions = ref<GridOptions | any>(
  AgGridUtils.getDefaultGridOptions({
    rowSelection: "multiple",
  },"visit_by_appId_list_grid")
);

const defaultColDef = {
  sortable: true,
  filter: true,
  
  floatingFilter: true,
  resizable: true,
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
      
     
    },
  ]);
}



async function onGridReady(params: any) {
  isLoading.value = true;
  param.value = params;
  gridApi.value = params.api;
  columnApi.value = params.columnApi;
  rowData.value = await fetchGet(`/api/v1/visitation/by-application/${props.applicationId}`);
  
  AgGridUtils.applyColumnState(gridOptions.value , "visit_by_appId_list_grid")
  updateBottomRowData();
  isLoading.value = false;
}



const columnDefs = ref([
{
    headerName: '#',
    maxWidth : "50",
    valueFormatter: (params:any) => {
      if (params.node.rowPinned) {
        return ""
    }
      return params.node.rowIndex + 1; // Satır indeksini 1'den başlatmak için +1 ekliyoruz.
    },
    field : "id",
    cellStyle: {  fontWeight: 'bold' },
    
  },
  {
    field: "visitDate",
    headerName: "Ziyaret Tarihi",
    filter: "agTextColumnFilter",
    valueFormatter: (params:any) => {
      if (params.node.rowPinned) {
        return `Toplam ziyaret : ${rowData.value.length}`;
    }
      const date = new Date(params.value);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Aylar 0-11 arası olduğu için +1 ekliyoruz.
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
      
    },
  
  },
  {
    field: "application.applicant.name",
    headerName: "Ziyaret edilen adı",
    filter: "agTextColumnFilter",
  },
  {
    field: "application.applicant.surname",
    headerName: "Ziyaret edilen soyadı",
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
    valueGetter: (params: any) => {
      return params.node.data.action ? t(params.node.data.action) : null;
    },
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
  isLoading.value = true;

  var resp = await fetchGet(`/api/v1/visitation/${visitIdForDelete.value}`);
  if (resp.code == 200) {
    snackbarStore.makeToast(true, "success", "İşlem başarılı");
  } else {
    snackbarStore.makeToast(true, "error", "Bir problem oluştu.");
  }
  deleteDialog.value = false;

  rowData.value = await fetchGet(`/api/v1/visitation/by-application/${props.applicationId}`);

  
  isLoading.value = false;
  updateBottomRowData();
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
  