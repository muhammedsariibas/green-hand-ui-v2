
<script lang="ts" setup>
import { ref } from "@vue/reactivity";
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import "ag-grid-enterprise";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { GridOptions, LicenseManager } from "ag-grid-enterprise";
import { fetchGet, fetchPost } from "../utils/fetchUtils";
LicenseManager.setLicenseKey(
  "For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-16_February_2023_[v2]_MTY3NjUwNTYwMDAwMA==5a37b6995fef0d066d9a3225009488ac"
);

const snackbarStore = useSnackbarStore();
const dialogAddRole = ref(false);
const dialogEditRole = ref(false);
const deleteRoleDialog = ref(false);
const text = ref(<string | null>null);
const permData = ref(<any>null);
const permData2 = ref(<any>null);
const gridApi = ref(null);
let columnApi = ref(null);
const rowData = ref([]);
let isLoading = ref<boolean>(false);

const role = ref(<any>{
  id: 0,
  name: null,
  permissionIds: [],
});

const newRole = ref(<any>{
  id: 0,
  name: null,
  permissionIds: [],
});

const gridOptions: GridOptions<any> = {
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
async function onGridReady(params: any) {
  gridApi.value = params.api;
  columnApi.value = params.columnApi;

  const updateData = (data: any) => {
    rowData.value = data;
  };

  var resp = await fetchGet("/api/v1/auth/roles");

  var perm = await fetchGet("/api/v1/auth/perm");
  for (var z = 0; z < resp.length; z++) {
    for (var i = 0; i < resp[z].permissionIds.length; i++) {
      var data = perm.filter((t: any) => t.id == resp[z].permissionIds[i]);
      console.log(data);
      resp[z].permissionIds[i] = data[0].name;
    }
  }

  updateData(resp);
}

async function fetchRoles() {
  isLoading.value = true;
  var resp = await fetchGet("/api/v1/auth/roles");
  rowData.value = resp;
  isLoading.value = false;
}

const columnDefs = ref([
  {
    field: "name",
    filter: "agMultiColumnFilter",
    headerName: "Rol",
  },
  {
    field: "permissionIds",
    filter: "agMultiColumnFilter",
    headerName: "İzinler",
  },
]);

var deleteId = ref(<any>null);
function getContextMenuItems(event: any) {
  return [
    {
      name: "Rolü düzenle",
      action: async () => {
        dialogEditRole.value = true;
        permData.value = await fetchGet("/api/v1/auth/perm");
        console.log(permData);
        role.value.id = event.node.data.id;
        var resp = await fetchGet("/api/v1/auth/roles");
        var getRoleById = resp.filter((t: any) => t.id == event.node.data.id);
        role.value.id = getRoleById[0].id;
        role.value.name = getRoleById[0].name;
        role.value.permissionIds = [];
        for (var i = 0; i < getRoleById[0].permissionIds.length; i++) {
          console.log(getRoleById[0].permissionIds[i]);
          role.value.permissionIds?.push(getRoleById[0].permissionIds[i]);
        }

        console.log(getRoleById);
      },
    },
    {
      name: "Rolü Sil",
      action: async () => {
        deleteRoleDialog.value = true;
        deleteId.value = event.node.data.id;
      },
    },
    "copy",
  ];
}

async function deleteRole() {
  isLoading.value=true
  var resp = await fetchGet(`/api/v1/auth/role/${deleteId.value}`);
  if (resp.code == 200) {
    text.value = "İşleminiz gerçekleşti";
    snackbarStore.makeToast(true, "success", "İşlem başarılı");
    fetchRoles();
    deleteRoleDialog.value = false;
  } else {
    snackbarStore.makeToast(true, "error", "İşlem başarısız");
    deleteRoleDialog.value = false;
  }
  isLoading.value=false
}

async function addRole() {
  permData.value = await fetchGet("/api/v1/auth/perm");
  newRole.value.id = 0;
  dialogAddRole.value = true;
}

async function addNewRole() {
  isLoading.value = true;
  dialogAddRole.value = false;
  var resp = await fetchPost(
    "/api/v1/auth/role",
    {
      method: "POST",
    },
    newRole.value
  );

  if (resp.code == 200) {
    snackbarStore.makeToast(true, "success", "İşlem başarılı");
    fetchRoles();
  } else {
    snackbarStore.makeToast(true, "error", "İşlem başarısız");
  }
  isLoading.value = false;
}

async function editRole() {
  isLoading.value = true;
  dialogAddRole.value = false;
  var resp = await fetchPost(
    "/api/v1/auth/role",
    {
      method: "POST",
    },
    role.value
  );

  if (resp.code == 200) {
    snackbarStore.makeToast(true, "success", "İşlem başarılı");
    fetchRoles();
  } else {
    snackbarStore.makeToast(true, "error", "işleminiz gerçekleşmedi");
  }
  isLoading.value = false;
}
</script>
  
  
<template>
  <v-col class="px-0 py-o">
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
        Roller
      </h2></v-col
    >
    <div>
      <ag-grid-vue
        style="height: calc(100vh - 64px)"
        class="ag-theme-alpine"
        :columnDefs="columnDefs"
        @grid-ready="onGridReady"
        :defaultColDef="defaultColDef"
        :gridOptions="gridOptions"
        :getContextMenuItems="getContextMenuItems"
        :rowData="rowData"
        :enableFilter="true"
      >
      </ag-grid-vue>

      <v-dialog width="600" v-model="dialogEditRole">
        <v-card>
          <v-card-title
            ><h4
              style="
                font-family: 'Roboto', sans-serif;
                font-family: 'Roboto Condensed', sans-serif;
                font-family: 'Roboto Slab', serif;
              "
            >
              Rol Düzenle
            </h4></v-card-title
          >
          <v-card-text class="d-flex flex-wrap px-0">
            <v-col cols="12" md="12" class="d-flex flex-wrap">
              <v-col class="py-1" cols="12" md="12">
                <v-text-field
                  v-model="role.name"
                  label="Role Adı"
                ></v-text-field>
              </v-col>
              <v-col class="py-1" cols="12" md="12">
                <v-select
                  v-model="role.permissionIds"
                  :items="permData"
                  item-title="name"
                  item-value="id"
                  label="Roller"
                  multiple
                ></v-select>
              </v-col>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              variant="plain"
              @click="dialogEditRole = false"
            >
              İptal
            </v-btn>
            <v-btn color="success" variant="tonal" @click="editRole">
              Kaydet
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog width="600" v-model="dialogAddRole">
        <v-card>
          <v-card-title
            ><h4
              style="
                font-family: 'Roboto', sans-serif;
                font-family: 'Roboto Condensed', sans-serif;
                font-family: 'Roboto Slab', serif;
              "
            >
              Rol Ekle
            </h4></v-card-title
          >
          <v-card-text class="d-flex flex-wrap px-0">
            <v-col cols="12" md="12" class="d-flex flex-wrap">
              <v-col class="py-1" cols="12" md="12">
                <v-text-field
                  v-model="newRole.name"
                  label="Role Adı"
                ></v-text-field>
              </v-col>
              <v-col class="py-1" cols="12" md="12">
                <v-select
                  v-model="newRole.permissionIds"
                  :items="permData"
                  item-title="name"
                  item-value="id"
                  label="Roller"
                  multiple
                ></v-select>
              </v-col>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="plain" @click="dialogAddRole = false">
              İptal
            </v-btn>
            <v-btn color="success" variant="tonal" @click="addNewRole">
              Kaydet
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog width="600" v-model="deleteRoleDialog" persistent>
        <v-card>
          <v-card-title>
            <span class="text-h5">Onay Durumu</span>
          </v-card-title>
          <v-card-text class="d-flex flex-wrap px-0">
            <v-col class="px-6">İşleminizi onaylıyor musunuz</v-col>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              variant="plain"
              @click="deleteRoleDialog = false"
            >
              İptal
            </v-btn>
            <v-btn color="success" variant="tonal" @click="deleteRole">
              Onayla
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn
        @click="addRole"
        style="position: fixed; bottom: 30px; right: 30px"
        icon="mdi-vuetify"
        color="blue"
      >
        <v-icon>mdi-plus </v-icon>
      </v-btn>
    </div>
  </v-col>
</template>
    