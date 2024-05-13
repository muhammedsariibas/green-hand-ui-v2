

<script lang="ts" setup>
import { ref } from "@vue/reactivity";
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import "ag-grid-enterprise";
import { GridOptions, LicenseManager } from "ag-grid-enterprise";
import { fetchGet, fetchPost } from "../utils/fetchUtils";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { onMounted } from "vue";
LicenseManager.setLicenseKey(
  "For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-16_February_2023_[v2]_MTY3NjUwNTYwMDAwMA==5a37b6995fef0d066d9a3225009488ac"
);

//DATA
let snackbarStore = useSnackbarStore();
const isLoading = ref<any>(false);
const headerUser = ref(<string | null>null);
const dialog = ref(<boolean>false);
const text = ref(<string | null>null);
const deleteUserDialog = ref(false);
var roleData = ref(<any>null);
const dialogAddUser = ref(<boolean>false);
const gridApi = ref(null);
let columnApi = ref(null);
const rowData = ref([]);
var roleData2 = ref(<any>null);
var userIdForDelete = ref(<any>null);
const provinceData = ref(<any>[]);
const districtData = ref(<any>[]);
const neighborhoodData = ref(<any>[]);
const isEnabledData = [
  { id: true, name: "aktif" },
  { id: false, name: "pasif" },
];

var userInfo = ref(<any>{
  id: 0,
  name: null,
  password: null,
  roleIds: [],
  email: null,
  phone: null,
  enabled: null,
});

const gridOptions: GridOptions<any> = {
  rowSelection: "multiple",
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

const columnDefs = ref([
  {
    field: "name",
    filter: "agMultiColumnFilter",
    headerName: "Kullanıcı",
  },
  {
    field: "roleIds",
    filter: "agMultiColumnFilter",
    headerName: "Roller",
  },
]);

//FUNCTIONS
onMounted(async () => {
  const provinceResult = await fetchGet(
    "/public/api/v1/geo/country/1/province"
  );
  provinceData.value = provinceResult;
});

async function getDistrictData(isForceEmpty: boolean) {
  if (isForceEmpty) {
    userInfo.value.district = null;
  }

  if (
    userInfo.value.province?.id == undefined ||
    userInfo.value.province?.id == null
  ) {
    districtData.value = [];
  } else {
    const districtResult = await fetchGet(
      `/public/api/v1/geo/province/${userInfo.value.province?.id}/district`
    );
    districtData.value = districtResult;
  }

  if (userInfo.value.district != null) {
    getNeighborhoodData(false);
  }
}
async function getNeighborhoodData(isForceEmpty: boolean) {
  if (isForceEmpty) {
    userInfo.value.neighborhoodId = null;
  }
  if (
    userInfo.value?.district?.id == undefined ||
    userInfo.value?.district?.id == null
  ) {
    neighborhoodData.value = [];
  } else {
    const neighborhoodResult = await fetchGet(
      `/public/api/v1/geo/district/${userInfo.value?.district?.id}/neighborhood`
    );
    neighborhoodData.value = neighborhoodResult;
  }
}

const updateData = (data: any) => {
  rowData.value = data;
};

async function onGridReady(params: any) {
  isLoading.value = true;

  gridApi.value = params.api;
  columnApi.value = params.columnApi;

  var users = await fetchGet("/api/v1/auth/users");
  var roles = await fetchGet("/api/v1/auth/roles");
  for (var z = 0; z < users.length; z++) {
    for (var i = 0; i < users[z].roleIds.length; i++) {
      var data = roles.filter((t: any) => t.id == users[z].roleIds[i]);
      users[z].roleIds[i] = data[0].name;
    }
  }

  updateData(users);
  isLoading.value = false;
}

function getContextMenuItems(event: any) {
  return [
    {
      name: "Kullanıcı düzenle",
      action: async () => {
        roleData2.value = await fetchGet("/api/v1/auth/roles");
        headerUser.value = "Kullanıcı düzenle";
        dialog.value = true;
        userInfo.value.id = event.node.data.id;
        var users = await fetchGet("/api/v1/auth/users");
        var getDataById = users.filter((t: any) => t.id == event.node.data.id);
        userInfo.value.id = getDataById[0].id;
        userInfo.value.name = getDataById[0].name;

        userInfo.value.roleIds = [];
        for (var i = 0; i < getDataById[0].roleIds.length; i++) {
          userInfo.value.roleIds?.push(getDataById[0].roleIds[i]);
        }

        userInfo.value.email = getDataById[0].email;
        userInfo.value.enabled = getDataById[0].enabled;
        userInfo.value.phone = getDataById[0].phone;
      },
    },
    {
      name: "Kullanıcı Sil",
      action: async () => {
        deleteUserDialog.value = true;
        userIdForDelete.value = event.node.data.id;
      },
    },
    "copy",
  ];
}

async function deleteUser() {
  isLoading.value = true;
  var resp = await fetchGet(`/api/v1/auth/user/${userIdForDelete.value}`);
  if (resp.code == 200) {
    snackbarStore.makeToast(
      true,
      "success",
      (text.value = "İşleminiz gerçekleşti")
    );
    fetchUsers();
    deleteUserDialog.value = false;
  } else {
    snackbarStore.makeToast(true, "error", (text.value = "Bir hata oluştu"));
    deleteUserDialog.value = false;
  }
  isLoading.value = false;
}
async function fetchUsers() {
  isLoading.value = true;
  var users = await fetchGet("/api/v1/auth/users");
  rowData.value = users;
  isLoading.value = false;
}
async function editUser() {
  isLoading.value = true;
  delete userInfo.value.province
  delete userInfo.value.district
  console.log(userInfo.value)
  var resp = await fetchPost(
    "/public/api/v1/auth/register",
    {
      method: "POST",
    },
    userInfo.value
  );
  dialog.value = false;
  if (resp.code == 200) {
    snackbarStore.makeToast(
      true,
      "success",
      (text.value = "İşleminiz gerçekleşti")
    );
    fetchUsers();
  } else {
    snackbarStore.makeToast(true, "error", (text.value = "Bir hata oluştu"));
  }
  isLoading.value = false;
}
async function addUser() {
  headerUser.value = "Kullanıcı ekle";
  isLoading.value = true;
  roleData2.value = await fetchGet("/api/v1/auth/roles");
  fetchUsers();
  isLoading.value = false;
  userInfo.value = {
    id: 0,
    name: null,
    password: null,
    roleIds: [],
    email: null,
    phone: null,
    enabled: true,
  };

  dialog.value = true;
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
        Kullanıcılar
      </h2></v-col
    >
    <div>
      <ag-grid-vue
        style="height: calc(100vh - 220px)"
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
    </div>

    <v-dialog width="600" v-model="dialog">
      <v-card>
        <v-card-title
          ><h4
            style="
              font-family: 'Roboto', sans-serif;
              font-family: 'Roboto Condensed', sans-serif;
              font-family: 'Roboto Slab', serif;
            "
          >
            {{ headerUser }}
          </h4></v-card-title
        >
        <v-card-text class="px-0">
          <v-col cols="12" md="12" class="d-flex flex-wrap">
            <v-col class="py-1" cols="6" md="6">
              <v-text-field
                v-model="userInfo.name"
                label="Kullanıcı adı"
              ></v-text-field>
            </v-col>
            <v-col class="py-1" cols="6" md="6">
              <v-text-field
                type="password"
                v-model="userInfo.password"
                label="Şifre"
              ></v-text-field>
            </v-col>
            <v-col class="py-1" cols="6" md="6">
              <v-text-field
                v-model="userInfo.phone"
                label="Telefon"
              ></v-text-field>
            </v-col>
            <v-col class="py-1" cols="6" md="6">
              <v-select
                v-model="userInfo.enabled"
                :items="isEnabledData"
                item-title="name"
                item-value="id"
                label="Yetki"
              >
              </v-select>
            </v-col>
            <v-col class="py-1" cols="12" md="12">
              <v-text-field
                v-model="userInfo.email"
                label="Email"
              ></v-text-field>
            </v-col>
            <v-col class="py-1" cols="12" md="12">
              <v-select
                v-model="userInfo.roleIds"
                :items="roleData2"
                item-title="name"
                item-value="id"
                label="Roller"
                multiple
              ></v-select>
            </v-col>
            <v-col cols="12" sm="12" md="12" class="d-flex">
              <v-autocomplete
                hide-details
                clearable
                bg-color="#F5F5F5"
                v-model="userInfo.province"
                label="Memleketi"
                :items="provinceData"
                item-value="id"
                item-title="name"
                return-object
                @update:modelValue="getDistrictData(true)"
              ></v-autocomplete>

              <v-autocomplete
                style="padding-left: 6px"
                hide-details
                bg-color="#F5F5F5"
                v-if="userInfo.province != null"
                clearable
                v-model="userInfo.district"
                label="İlçesi"
                :items="districtData"
                item-value="id"
                item-title="name"
                @update:modelValue="getNeighborhoodData(true)"
                return-object
              ></v-autocomplete>

              <v-autocomplete
                style="padding-left: 6px"
                hide-details
                bg-color="#F5F5F5"
                v-if="userInfo.district != null"
                clearable
                v-model="userInfo.neighborhoodId"
                label="Mahalle "
                :items="neighborhoodData"
                item-title="name"
                item-value="id"
        
              ></v-autocomplete>
            </v-col>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="plain" @click="dialog = false">
            İptal
          </v-btn>
          <v-btn color="success" variant="tonal" @click="editUser">
            Kaydet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog width="600" v-model="deleteUserDialog" persistent>
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
            @click="deleteUserDialog = false"
          >
            İptal
          </v-btn>
          <v-btn color="success" variant="tonal" @click="deleteUser">
            Onayla
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn
      @click="addUser"
      style="position: fixed; bottom: 30px; right: 30px"
      icon="mdi-vuetify"
      color="blue"
    >
      <v-icon>mdi-account-plus</v-icon>
    </v-btn>
  </v-col>
</template>
    
    