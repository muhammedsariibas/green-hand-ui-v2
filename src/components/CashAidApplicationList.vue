<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import approvalStatus from "@/enums/ApprovalStatus";
import approvalDegree from "@/enums/ApprovalDegree";
import actionStatus from "@/enums/VisitActionStatus";
import AgGridUtils from "@/utils/AgGridUtil";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { fetchPost, fetchGet, fetchPut } from "@/Utils/fetchUtils";
import ApplicationDetail from "./ApplicationDetail.vue";
import ApplicationVisitDetail from "./ApplicationVisitDetail.vue";
import ApplicationComp from "./ApplicationComp.vue";
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-balham.css"; // Optional theme CSS
import "ag-grid-community/styles/ag-theme-material.css"; // Optional theme CSS
import "ag-grid-enterprise";
import "@vuepic/vue-datepicker/dist/main.css";
import { useI18n } from "vue-i18n";
import { GridOptions, LicenseManager, RowNode } from "ag-grid-enterprise";
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
let appAssignCategoryDialog = ref<boolean>(false);
let statusChangeDialog = ref<boolean>(false);
let applicationFromRowDoubleClick = ref<any>(null);
let applicationFromContextMenu = ref<any>(null);
let applicationIdFromContextMenuItem = ref<any>(null);
let categories = ref(<any>[]);
let categoryId = ref(<any>null);
let userData = ref<any>(null);
let snackbarStore = useSnackbarStore();
let visitDialog = ref<any>(null);
let selectedApprovalStatus = ref<any>("NEW");
let alertMessage = ref<any>(false);
let assignMonikerDialog = ref<any>(false);
let moniker = ref<any>(null);
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
    headerName: "#",
    valueGetter: "node.rowIndex + 1",
    field: "count",
  },
  {
    field: "applicant.name",
    headerName: "Ad",
    
  },
  {
    field: "applicant.surname",
    headerName: "Soyad",
    filter: "agTextColumnFilter",
  },
  {
    field: "applicant.moniker",
    headerName: "Rumuz",
    filter: "agTextColumnFilter",
  },
  {
    field: "applicant.socialSecurityNo",
    headerName: "TC",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Memleket",
    filter: "agTextColumnFilter",
    valueGetter: (params: any) => {
      // params.node.data.province ? params.node.data.province.name /  : null;
      let province = null;
      let district = null;
      let neighborhood = null;

      if (params.node.data.applicant.province != null) {
        console.log(params.node.data.applicant.province.name);
        province = params.node.data.applicant.province.name;
      }
      if (params.node.data.applicant.district != null) {
        district = params.node.data.applicant.district.name;
      }
      if (params.node.data.applicant.neighborhood != null) {
        neighborhood = params.node.data.applicant.neighborhood.name;
      }

      return province + "/" + district + "/" + neighborhood;
    },
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
      return params.node.data.status ? t(params.node.data.status) : null;
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
  {
    field: "category.name",
    headerName: "Kategori",
  },
]);

// // detailCellRenderer: agGridApplicantsInfo,
// const gridOptions: GridOptions<any> = {

//   getRowStyle: params => {
//     console.log(params.node.data.isIncomplete)
//         if (params.node.data.isIncomplete) {
//             return { background: '#EF9A9A' };
//         }
//     },
//   rowSelection: "multiple",
//   animateRows: true,
//   detailRowHeight: 300,
// };

const gridOptions = ref<GridOptions | any>(
  AgGridUtils.getDefaultGridOptions({
    rowSelection: "multiple",
    getRowStyle: (params) => {
      console.log(params.node.data.isIncomplete);
      if (params.node.data.isIncomplete) {
        return { background: "#EF9A9A" };
      }
    },
  },"cash_aid_application_list_grid")
);

const defaultColDef = {
  sortable: true,
  filter: true,

  floatingFilter: true,
  resizable: true,
};

async function assignMoniker() {
  isLoading.value = true;

  applicationFromContextMenu.value.applicant.moniker = moniker.value;

  const response = await fetchPost(
    "/public/api/v1/application/0",
    { method: "POST" },
    applicationFromContextMenu.value
  );

  if (response.code == 200) {
    assignMonikerDialog.value = false;
    snackbarStore.makeToast(true, "success", "İşlem Başarılı.");
  } else {
    assignMonikerDialog.value = false;
    snackbarStore.makeToast(true, "error", "İşlem Başarısız.");
  }

  rowData.value = await fetchData(selectedApprovalStatus.value);

  isLoading.value = false;
}

function setPinnedRowData() {
  let count = 0;

  gridApi.value.forEachNode((param: any) => {
    count += 1;
  });

  gridApi.value.setPinnedBottomRowData([
    {
      applicant: {
        name: `Toplam Başvuru : ${count}`,
      },
    },
  ]);
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
  let arr = [
    {
      name: "Onay Durumunu düzenle",
      action: async () => {
        statusChangeDialog.value = true;
        appStatusObject.value.appId = params.node.data.id;
        appStatusObject.value.approvalStatus = params.node.data.status;
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
      name: "Kategori Atama",
      action: async () => {
        categories.value = await fetchGet("/api/v1/application/category");
        appAssignCategoryDialog.value = true;
      },
    },
    {
      name: "Kullanıcıya Rumuz Ata",
      action: async () => {
        applicationFromContextMenu.value = params.node.data;
        assignMonikerDialog.value = true;
      },
    },
  ];

  if (params.node.data.status == "APPROVED") {
    arr.push({
      name: "Ziyaret gir",
      action: async () => {
        visitDialog.value = true;
        newVisitObject.value.visitor = await fetchGet(
          "/public/api/v1/auth/current-user"
        );
        newVisitObject.value.application.id = params.node.data.id;
        newVisitObject.value.greeter =
          params.node.data.applicant.name + "(KENDİSİ)";
        newVisitObject.value.action = "MONEY_GIVEN_APPROVED";
        checkSameDayVisit();
      },
    });
  }

  return arr;
}

async function checkSameDayVisit() {
  isLoading.value = true;
  alertMessage.value = false;
  var date = new Date(decodeURIComponent(newVisitObject.value.visitDate));
  date.setDate(date.getDate() + 1);

  var newDate = date.toString();
  var resp = await fetchGet(
    `/api/v1/visitation/visits?startDate=${newVisitObject.value.visitDate}&endDate=${newDate}`
  );

  resp.forEach((el: any) => {
    if (el.application.id == newVisitObject.value.application.id) {
      alertMessage.value = true;
    }
  });
  isLoading.value = false;
}
function onRowDoubleClicked(params: any) {
  applicationFromRowDoubleClick.value = params.node.data;
  appDetailDialog.value = true;
}

async function onGridReady(params: any) {
  gridApi.value = params.api;
  columnApi.value = params.columnApi;
  userData.value = await fetchGet("/api/v1/auth/users");
  AgGridUtils.applyColumnState(gridOptions.value , "cash_aid_application_list_grid")
  setPinnedRowData();
}
async function closeDialogAndRefreshData() {
  appUpdateDialog.value = false;
  rowData.value = await fetchData(selectedApprovalStatus.value);
}

async function assignCategoryToApplications() {
  console.log(categoryId);

  let arr = gridApi.value.getSelectedRows().map((t: any) => t.id);

  let resp = await fetchPost(
    `/api/v1/application/${categoryId.value}/category`,
    { method: "POST" },
    arr
  );

  if (resp.code == 200) {
    appAssignCategoryDialog.value = false;
    snackbarStore.makeToast(true, "success", "İşlem başarılı.");
    rowData.value = await fetchData(selectedApprovalStatus.value);
  } else {
    appAssignCategoryDialog.value = false;
    snackbarStore.makeToast(true, "error", "İşlem başarısız.");
  }
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

  delete newVisitObject.value.visitor.username;
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

async function filterByStatus() {
  if (selectedApprovalStatus.value != null) {
    rowData.value = await fetchData(selectedApprovalStatus.value);
    setTimeout(() => {
      setPinnedRowData();
    }, 200);
  }
}

//WATCHEFFECT
// watchEffect(async () => {
//   if (selectedApprovalStatus.value != null) {
//     rowData.value = await fetchData(selectedApprovalStatus.value);
//     setTimeout(() => {
//       setPinnedRowData();
//     }, 200);
//   }
// });
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
    <v-dialog v-model="appAssignCategoryDialog" persistent width="600">
      <v-card>
        <v-card-title>
          <span class="text-h5">Kategori ata</span>
        </v-card-title>
        <v-card-text class="d-flex flex-wrap px-0">
          <v-col cols="12" sm="12" class="d-flex flex-wrap">
            <v-select
              hide-details
              density="compact"
              class="pr-3"
              v-model="categoryId"
              :items="categories"
              item-title="name"
              item-value="id"
              label="Onay Durumu"
              required
            ></v-select>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="plain"
            @click="appAssignCategoryDialog = false"
          >
            İptal
          </v-btn>
          <v-btn
            color="success"
            variant="tonal"
            @click="assignCategoryToApplications"
          >
            Kaydet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="assignMonikerDialog" persistent width="600">
      <v-card>
        <v-card-title>
          <span class="text-h5">Rumuz Ata</span>
        </v-card-title>
        <v-card-text class="d-flex flex-wrap px-0">
          <v-col cols="12" sm="12" class="d-flex flex-wrap">
            <v-text-field
              hide-details
              density="compact"
              class="pr-3"
              v-model="moniker"
              label="Onay Durumu"
              required
            ></v-text-field>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="plain"
            @click="assignMonikerDialog = false"
          >
            İptal
          </v-btn>
          <v-btn color="success" variant="tonal" @click="assignMoniker">
            Kaydet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="appDetailDialog" persistent>
      <v-col
        cols="12"
        sm="12"
        md="12"
        class="d-flex justify-center align-center px-0 py-0"
      >
        <v-col
          cols="12"
          sm="11"
          md="11"
          style="background-color: white"
          class="px-0 py-0"
        >
          <ApplicationVisitDetail
            :application-id="applicationFromRowDoubleClick.id"
          >
            <v-btn
              style="float: right"
              icon
              variant="text"
              @click="appDetailDialog = !appDetailDialog"
              ><v-icon size="large">mdi-close</v-icon></v-btn
            ></ApplicationVisitDetail
          >
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
    <v-dialog width="800" v-model="visitDialog" persistent>
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
              @update:model-value="checkSameDayVisit"
              text-input
              :teleport="true"
              :clearable="false"
            />
          </v-col>
          <v-col cols="12" sm="12" md="12" class="py-0">
            <v-alert class="pt-3" type="warning" v-if="alertMessage"
              >Bu Tarihte Ödeme yapılmıştır.</v-alert
            >
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

    <v-col cols="12" md="12" sm="12" class="py-1 px-0">
      <v-col class="px-0 pb-0 pt-2 d-flex" cols="12" sm="3" md="3">
        <v-select
          hide-details
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
        <v-btn
          rounded="0"
          color="primary"
          elevation="0"
          @click="filterByStatus"
        >
          Filtrele
        </v-btn>
      </v-col>
    </v-col>
    <v-col cols="12" md="12" sm="12" class="py-0 px-0">
      <ag-grid-vue
        style="height: calc(100vh - 172px)"
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