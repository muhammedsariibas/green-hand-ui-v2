<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { fetchPost, fetchGet, fetchPut } from "@/Utils/fetchUtils";
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-balham.css"; // Optional theme CSS
import "ag-grid-community/styles/ag-theme-material.css"; // Optional theme CSS
import "ag-grid-enterprise";
import "@vuepic/vue-datepicker/dist/main.css";
import { useI18n } from "vue-i18n";
import { GridOptions, LicenseManager } from "ag-grid-enterprise";
import { onMounted, ref, watchEffect } from "vue";
import { tr } from "date-fns/locale";
LicenseManager.setLicenseKey(
  "For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-16_February_2023_[v2]_MTY3NjUwNTYwMDAwMA==5a37b6995fef0d066d9a3225009488ac"
);

//DATA
const locale = tr;
const gridApi = ref(<any>null);
let columnApi = ref(<any>null);
const rowData = ref<any>(null);
let isLoading = ref<boolean>(false);
const appUpdateDialog = ref<boolean>(false);
let applicationFromRowDoubleClick = ref<any>(null);
let applicationIdFromContextMenuItem = ref<any>(null);
let snackbarStore = useSnackbarStore();
const selectedAidCat = ref<any>(0);
const aidCategories = ref<any>([]);

const { t } = useI18n();

const columnDefs = ref([
  {
    headerName: "",
    maxWidth: 40,
    valueGetter: "node.rowIndex + 1",
  },
  {
    field: "name",
    headerName: "Ad",
    cellRenderer: "agGroupCellRenderer",
    filter: "agTextColumnFilter",
  },
  {
    field: "surname",
    headerName: "Soyad",
    cellRenderer: "agGroupCellRenderer",
    filter: "agTextColumnFilter",
  },
  {
    field: "phone",
    headerName: "Tel",
    cellRenderer: "agGroupCellRenderer",
    filter: "agTextColumnFilter",
  },
  {
    field: "socialSecurityNo",
    headerName: "TC Kimlik No",
    cellRenderer: "agGroupCellRenderer",
    filter: "agTextColumnFilter",
  },
  {
    field: "category.name",
    headerName: "Kategori",
    cellRenderer: "agGroupCellRenderer",
    filter: "agTextColumnFilter",
  },
  
  // {
  //   field: "aidStatus",
  //   headerName: "Onay Durumu",
  //   filter: "agTextColumnFilter",
  //   valueGetter: (params: any) => {
  //     return params.node.data.aidStatus ? t(params.node.data.aidStatus) : null;
  //   },
  // },
]);


function setPinnedRowData() {
  
  let count = 0;

  gridApi.value.forEachNode((param : any)=>{
    count += 1;
  })

  gridApi.value.setPinnedBottomRowData([
    {
   
        name : `Toplam Başvuru : ${count}`
      

    },
  ]);

  
}

// detailCellRenderer: agGridApplicantsInfo,
const gridOptions: GridOptions<any> = {
  rowSelection: "single",
  animateRows: true,
  detailRowHeight: 300,
};

const defaultColDef = {
  sortable: true,
  filter: true,
  flex: 1,
  floatingFilter: true,
  resizable : true
};

//ONMOUNTED
onMounted(async () => {
  let catData = await fetchGet(`/public/api/v1/aid/category`);
  aidCategories.value = [
    {
      name: "HEPSİ",
      id: 0,
    },
    ...catData,
  ];
});

//FUNCTIONS
async function fetchData(catId: any) {
  isLoading.value = true;
  var data = [];
  try {
    if (catId == 0) {
      data = await fetchGet(`/public/api/v1/aid/one-time-aid/list`);
    } else {
      data = await fetchGet(
        `/public/api/v1/aid/one-time-aid/list?categoryId=${catId}`
      );
    }
  } catch (err) {
    snackbarStore.makeToast(true, "error", "Bir problem oluştu");
  }
  isLoading.value = false;
  return data;
}



function onRowDoubleClicked(params: any) {}

async function onGridReady(params: any) {
  gridApi.value = params.api;
  columnApi.value = params.columnApi;
  gridApi.value.getDisplayedRowCount();
}
async function closeDialogAndRefreshData() {
  appUpdateDialog.value = false;
  rowData.value = await fetchData(selectedAidCat.value);
}

//WATCHEFFECT
watchEffect(async () => {
  if (selectedAidCat.value != null) {
    rowData.value = await fetchData(selectedAidCat.value);
    setTimeout(() => {
      setPinnedRowData()
    }, 200);
  }
});
</script>
<template>
  <v-col cols="12" sm="12" md="12" class="d-flex flex-wrap px-0 py-0">
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

   
    <v-col cols="12" md="12" sm="12" class="py-1">
      <v-col class="px-0 pb-0 pt-2" cols="12" sm="4" md="4">
        <v-select
          variant="outlined"
          rounded="0"
          density="compact"
          label="Kategori"
          :items="aidCategories"
          item-title="name"
          item-value="id"
          v-model="selectedAidCat"
        >
        </v-select>
      </v-col>
    </v-col>
    <v-col cols="12" md="12" sm="12" class="py-1">
      <ag-grid-vue
        style="height: calc(100vh - 350px)"
        class="ag-theme-balham"
        :columnDefs="columnDefs"
        @grid-ready="onGridReady"
        :defaultColDef="defaultColDef"
        :gridOptions="gridOptions"
        :getContextMenuItems="getContextMenuItems"
        :rowData="rowData"
        :enableFilter="true"
        :onRowDoubleClicked="onRowDoubleClicked"
      >
      </ag-grid-vue>
    </v-col>
  </v-col>
</template> 