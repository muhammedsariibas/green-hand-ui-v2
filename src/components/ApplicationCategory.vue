
<script lang="ts" setup>
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

import { tr } from "date-fns/locale";
import { nullLiteral } from "@babel/types";

const locale = tr;
const snackbarStore = useSnackbarStore();

LicenseManager.setLicenseKey(
  "For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-16_February_2023_[v2]_MTY3NjUwNTYwMDAwMA==5a37b6995fef0d066d9a3225009488ac"
);

//DATA

const deleteDialog = ref(<boolean>false);
const gridApi = ref(<any>null);
let columnApi = ref(null);
const rowData = ref(<any>[]);
var param = ref(<any>null);
let isLoading = ref<boolean>(false);
let categoryIdForDelete = ref(<any>null);
let editCategoryDialog = ref(<boolean>false);

const gridOptions: GridOptions = {
  rowSelection: "single",
  animateRows: true,
  masterDetail: true,
  detailRowHeight: 300,
};

const defaultColDef = {
  sortable: true,
  filter: true,
 
  floatingFilter: true,
  resizable: true,
};

let category = ref(<any>{
  id: 0,
  name: null,
  explanation: null,
});

//FUNCTIONS

async function onGridReady(params: any) {
  isLoading.value = true;
  param.value = params;
  gridApi.value = params.api;
  columnApi.value = params.columnApi;
  rowData.value = await fetchGet(`/api/v1/application/category`);
  updateBottomRowData();
  isLoading.value = false;
}

function updateBottomRowData() {
  gridApi.value.setPinnedBottomRowData([
    {
      name: `Toplam Kategori ${rowData.value.length}`,
    },
  ]);
}

function onRowDoubleClicked(params: any) {
  category.value = params.node.data;
  editCategoryDialog.value = true;
}

const columnDefs = ref([
  {
    headerName: "#",
    maxWidth: "50",
    valueFormatter: (params: any) => {
      if (params.node.rowPinned) {
        return "";
      }
      return params.node.rowIndex + 1; // Satır indeksini 1'den başlatmak için +1 ekliyoruz.
    },
    field: "id",
    cellStyle: { fontWeight: "bold" },
  },
  {
    field: "name",
    headerName: "Adı",
  },
  {
    field: "explanation",
    headerName: "Açıklama",
  },
]);

function getContextMenuItems(params: any) {
  return [
    {
      name: "Sil",
      action: async () => {
        deleteDialog.value = true;
        categoryIdForDelete.value = params.node.data.id;
      },
    },
    "copy",
  ];
}

async function addCategory() {
  isLoading.value = true;

  if (category.value.name == null) {
    snackbarStore.makeToast(true, "error", "Ad kısmı boş bırakılamaz");
  } else {
    var resp = await fetchPost(
      "/api/v1/application/category",
      {
        method: "POST",
      },
      category.value
    );
    editCategoryDialog.value = false;
    if (resp.code == 200) {
      rowData.value = await fetchGet(`/api/v1/application/category`);
      updateBottomRowData();
      snackbarStore.makeToast(true, "success", "İşleminiz gerçekleşti");
    } else {
      snackbarStore.makeToast(true, "error", "Bir hata oluştu");
    }
    category.value = {
      id: 0,
      name: null,
      explanation: null,
    };
  }

  isLoading.value = false;
}

async function openDialogAndSetNullCategory() {
  category.value = {
    id: 0,
    name: null,
    explanation: null,
  };
  editCategoryDialog.value = true;
}

async function deleteCategory() {
  isLoading.value = true;

  var resp = await fetchGet(`/api/v1/visitation/${categoryIdForDelete.value}`);
  if (resp.code == 200) {
    snackbarStore.makeToast(true, "success", "İşlem başarılı");
  } else {
    snackbarStore.makeToast(true, "error", "Bir problem oluştu.");
  }
  deleteDialog.value = false;

  rowData.value = await fetchGet(`/api/v1/application/category`);

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
        style="height: calc(100vh - 80px)"
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

    <v-dialog width="600" v-model="editCategoryDialog" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">Kategori Ekle / Düzenle</span>
        </v-card-title>
        <v-card-text class="d-flex flex-wrap px-0">
          <v-col cols="12" sm="12" md="12" class="py-0"
            ><v-text-field label="Ad" v-model="category.name"></v-text-field
          ></v-col>
          <v-col cols="12" sm="12" md="12" class="py-0">
            <v-textarea
              label="Açıklama"
              v-model="category.explanation"
            ></v-textarea
          ></v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="plain"
            @click="editCategoryDialog = false"
          >
            İptal
          </v-btn>
          <v-btn color="success" variant="tonal" @click="addCategory">
            Ekle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn
      @click="openDialogAndSetNullCategory"
      style="position: fixed; bottom: 30px; right: 30px"
      icon="mdi-vuetify"
      color="blue"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-col>
</template>
  