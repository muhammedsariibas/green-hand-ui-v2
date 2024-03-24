<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import approvalStatus from "@/enums/ApprovalStatus";
import approvalDegree from "@/enums/ApprovalDegree";
import actionStatus from "@/enums/VisitActionStatus";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { fetchPost, fetchGet, fetchPut } from "@/Utils/fetchUtils";
import ApplicationDetail from "./ApplicationDetail.vue";
import ApplicationComp from "./ApplicationComp.vue";
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
import { count } from "console";
LicenseManager.setLicenseKey(
  "For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-16_February_2023_[v2]_MTY3NjUwNTYwMDAwMA==5a37b6995fef0d066d9a3225009488ac"
);

//DATA
const locale = tr;
const gridApi = ref(<any>null);
let columnApi = ref(<any>null);
const rowData = ref<any>(null);
let isLoading = ref<boolean>(false);
let appDetailDialog = ref<boolean>(false);
let appUpdateDialog = ref<boolean>(false);
let statusChangeDialog = ref<boolean>(false);
let applicationFromRowDoubleClick = ref<any>(null);
let applicationIdFromContextMenuItem = ref<any>(null);
let userData = ref<any>(null);
let snackbarStore = useSnackbarStore();
let visitDialog = ref<any>(null);
let selectedApprovalStatus = ref<any>("NEW");
const appStatusObject = ref(<any>{
  appId: null,
  degree: null,
  approvalStatus: null,
  explanation: null,
});
const newVisitObject = ref(<any>{
  application: { id: null },
  greeter: null,
  visitDate: new Date(),
  visitor: null,
  explanation: null,
  category: null,
  paidAmount: null,
  action: null,
});
const { t } = useI18n();

const columnDefs = ref([
  {
    headerName: "",
    field: "count",
    maxWidth: 40,
    valueGetter: "node.rowIndex + 1",
  },
  {
    field: "applicant.name",
    headerName: "Ad",
    cellRenderer: "agGroupCellRenderer",
    filter: "agTextColumnFilter",
  },
  {
    field: "applicant.surname",
    headerName: "Soyad",
    filter: "agTextColumnFilter",
  },
  {
    field: "applicant.socialSecurityNo",
    headerName: "TC",
    filter: "agTextColumnFilter",
  },
  {
    field: "applicant.phone",
    headerName: "Tel",
    filter: "agTextColumnFilter",
  },
  {
    field: "status",
    headerName: "Onay Durumu",
    filter: "agTextColumnFilter",
    valueGetter: (params: any) => {
      return t(params.node.data.status);
    },
  },
  {
    field: "degree",
    headerName: "Derecesi",
    filter: "agTextColumnFilter",
    valueGetter: (params: any) => {
      return params.node.data.degree ? t(params.node.data.degree) : null;
    },
  },
  {
    field: "explanation",
    headerName: "Açıklama",
    filter: "agTextColumnFilter",
  },
]);

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
};

//ONMOUNTED
onMounted(async () => {
 
  
  
 
});

function setPinnedRowData() {
  let count = 0;

 


  gridApi.value.setPinnedBottomRowData([{
    count : 0
  }])


  
}

//FUNCTIONS
async function fetchData(statuses: any) {
    
  isLoading.value = true;
  var data = [];
  try {
    data = await fetchGet(`/api/v1/application?statuses=${statuses}`);
  } catch (err) {
    snackbarStore.makeToast(true, "error", "Bir problem oluştu");
  }
  isLoading.value = false;
  return data;
}

function getContextMenuItems(params: any) {
  return [
    {
      name: "Onay Durumunu düzenle",
      action: async () => {
        
        statusChangeDialog.value = true;
        appStatusObject.value.appId = params.node.data.id;
      },
    },
    {
      name: "Başvuruyu düzenle",
      action: async () => {
        appUpdateDialog.value = true;
        applicationIdFromContextMenuItem.value = params.node.data.id;
      },
    },
    {
      name: "Ziyaret gir",
      action: async () => {
        visitDialog.value = true;
        newVisitObject.value.application.id = params.node.data.id;
      },
    },
  ];
}

function onRowDoubleClicked(params: any) {
  applicationFromRowDoubleClick.value = params.node.data;
  appDetailDialog.value = true;
}

async function onGridReady(params: any) {
  gridApi.value = params.api;
  columnApi.value = params.columnApi;
  userData.value = await fetchGet("/api/v1/auth/users");
    
    setPinnedRowData()

}
async function closeDialogAndRefreshData() {
  appUpdateDialog.value = false;
  rowData.value = await fetchData(selectedApprovalStatus.value);
}

async function changeAppStatus() {
  isLoading.value = true;

  const resp = await fetchPut(
    `/api/v1/application/${appStatusObject.value.appId}/status`,
    appStatusObject.value
  );

  if (resp.code == 200) {
    snackbarStore.makeToast(true, "success", "İşleminiz gerçekleşti");
    rowData.value = await fetchData(selectedApprovalStatus.value);
    statusChangeDialog.value = false;
  } else {
    snackbarStore.makeToast(true, "success", "Bir problem oluştu");
  }

  appStatusObject.value = {
    appId: null,
    degree: null,
    approvalStatus: null,
    explanation: null,
  };
  isLoading.value = false;
}

async function addVisit() {
  isLoading.value = true;
  try {
    const resp = await fetchPost(
      "/api/v1/visitation",
      { method: "POST" },
      newVisitObject.value
    );

    if (resp.code == 200) {
      snackbarStore.makeToast(true, "success", "İşlem Başarılı");
    } else {
      snackbarStore.makeToast(true, "error", "Bir problem oluştu.");
    }
  } catch (Err) {
    snackbarStore.makeToast(true, "error", "Bir problem oluştu.");
  }
  newVisitObject.value = {
    application: { id: null },
    greeter: null,
    visitDate: new Date(),
    visitor: null,
    explanation: null,
    category: null,
    paidAmount: null,
    action: null,
  };
  visitDialog.value = false;
  isLoading.value = false;
}

//WATCHEFFECT
watchEffect(async () => {
  if (selectedApprovalStatus.value != null) {
    rowData.value = await fetchData(selectedApprovalStatus.value);
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
    <v-dialog v-model="appDetailDialog" persistent>
      <v-col
        cols="12"
        sm="12"
        md="12"
        class="d-flex justify-center align-center"
      >
        <v-col cols="12" sm="10" md="10" style="background-color: white">
          <v-btn
            style="float: right"
            size="medium"
            icon
            variant="text"
            @click="appDetailDialog = !appDetailDialog"
            ><v-icon>mdi-close</v-icon></v-btn
          >
          <application-detail
            :application="applicationFromRowDoubleClick"
          ></application-detail>
        </v-col>
      </v-col>
    </v-dialog>
    <v-dialog v-model="appUpdateDialog" persistent>
      <v-col cols="12" sm="12" md="12" class="d-flex justify-center px-0 py-0">
        <v-col
          cols="12"
          sm="10"
          md="10"
          class="px-0 py-0"
          style="background-color: white"
        >
          <v-btn
            style="float: right"
            size="medium"
            icon
            variant="text"
            @click="appUpdateDialog = !appUpdateDialog"
            ><v-icon>mdi-close</v-icon></v-btn
          >
          <ApplicationComp
            @close-dialog="closeDialogAndRefreshData"
            :application-id="applicationIdFromContextMenuItem"
          ></ApplicationComp>
        </v-col>
      </v-col>
    </v-dialog>
    <v-dialog width="600" v-model="statusChangeDialog" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">Onay Durumu</span>
        </v-card-title>
        <v-card-text class="d-flex flex-wrap px-0">
          <v-col cols="12" sm="12" class="d-flex flex-wrap">
            <v-select
              hide-details
              density="compact"
              class="pr-3"
              v-model="appStatusObject.approvalStatus"
              :items="approvalStatus"
              item-title="name"
              item-value="id"
              label="Onay Durumu"
              required
            ></v-select>

            <v-select
              hide-details
              density="compact"
              v-if="appStatusObject.approvalStatus != 'DECLINED'"
              v-model="appStatusObject.degree"
              item-title="name"
              item-value="id"
              :items="approvalDegree"
              label="Derece"
            ></v-select>
          </v-col>
          <v-col cols="12" md="12">
            <v-textarea
              hide-details
              density="compact"
              v-model="appStatusObject.explanation"
              label="Açıklama"
              auto-grow
            ></v-textarea>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="plain"
            @click="statusChangeDialog = false"
          >
            İptal
          </v-btn>
          <v-btn color="success" variant="tonal" @click="changeAppStatus">
            Kaydet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="600" v-model="visitDialog" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">Ziyaret Gir</span>
        </v-card-title>
        <v-card-text class="d-flex flex-wrap px-0">
          <v-col cols="12" md="12">
            <VueDatePicker
              locale="tr"
              :format-locale="tr"
              format="dd/MM/yyyy"
              id="dialogDatePicker"
              v-model="newVisitObject.visitDate"
              text-input
              :teleport="true"
              :clearable="false"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              hide-details
              density="compact"
              type="number"
              clearable
              label="Ödenen Miktar"
              v-model="newVisitObject.paidAmount"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              hide-details
              density="compact"
              clearable
              label="Karşılayan"
              v-model="newVisitObject.greeter"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              hide-details
              density="compact"
              v-model="newVisitObject.visitor"
              :items="userData"
              item-value="id"
              item-title="name"
              return-object
              label="Ziyareti Gerçekleştiren"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              hide-details
              density="compact"
              v-model="newVisitObject.action"
              :items="actionStatus"
              item-value="id"
              item-title="name"
              label="Ziyareti Sebebi"
            ></v-select>
          </v-col>
          <v-col cols="12" md="12">
            <v-textarea
              hide-details
              density="compact"
              v-model="newVisitObject.explanation"
              label="Açıklama"
              auto-grow
            ></v-textarea>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="plain" @click="visitDialog = false">
            İptal
          </v-btn>
          <v-btn color="success" variant="tonal" @click="addVisit">
            Kaydet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-col cols="12" sm="12" md="12"
      ><h2
        style="
          font-family: 'Roboto', sans-serif;
          font-family: 'Roboto Condensed', sans-serif;
          font-family: 'Roboto Slab', serif;
        "
      >
        Nakdi Yardım Başvuruları
      </h2></v-col
    >
    <v-col cols="12" md="12" sm="12" class="py-1">
      <v-col class="px-0 py-0" cols="12" sm="4" md="4">
        <v-select
          variant="outlined"
          rounded="0"
          density="compact"
          label="Onay Durumu"
          :items="approvalStatus"
          item-title="name"
          item-value="id"
          multiple
          v-model="selectedApprovalStatus"
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