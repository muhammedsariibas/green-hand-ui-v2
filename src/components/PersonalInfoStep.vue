<script setup lang="ts">
import type { MaskInputOptions } from "maska";
import { vMaska } from "maska";
import { isStringShorterThan } from "@/utils/StringUtils";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { tr } from "date-fns/locale";
import { fetchGet } from "@/utils/fetchUtils";
import { fetchPost } from "@/utils/fetchUtils";
import { useSnackbarStore } from "@/stores/snackbarStore";
import workingStatus from "@/enums/WorkingStatus";
import educationLevel from "@/enums/EducationLevel";
import educationStatus from "@/enums/EducationStatus";
import genders from "@/enums/Gender";
import maritalStatus from "@/enums/MaritalStatus";
import propertyStatusData from "@/enums/PropertyStatus";
import { ref, onMounted, watchEffect } from "vue";
import { useApplicationStore } from "@/stores/applicationStore";

const applicationStore = useApplicationStore();

//PROPS

//DATA
const locale = tr;
const snackbarStore = useSnackbarStore();
let nameField = ref(<boolean>false);
let surname = ref(<boolean>false);
let socialSecurityNo = ref(<boolean>false);
let gender = ref(<boolean>false);
let birthDate = ref(<boolean>false);
let birthPlace = ref(<boolean>false);
let maritalStatusError = ref(<boolean>false);
let educationLevelError = ref(<boolean>false);
let educationStatusError = ref(<boolean>false);
let workingStatusError = ref(<boolean>false);
let province = ref(<boolean>false);
let district = ref(<boolean>false);
let neighborhood = ref(<boolean>false);
let phone = ref(<boolean>false);
let addressProvince = ref(<boolean>false);
let addressDistrict = ref(<boolean>false);
let addressNeighborhood = ref(<boolean>false);
let addressStreet = ref(<boolean>false);
let buildingNo = ref(<boolean>false);
let apartmentNo = ref(<boolean>false);
let email = ref(<boolean>false);
let propertyStatus = ref(<boolean>false);
let application = ref<any>(null);
let isLoading = ref<any>(false);
let newStreetDialog = ref(<boolean>false);
let newStreetName = ref<any>(null);

const provinceData = ref(<any>[]);
const districtData = ref(<any>[]);
const neighborhoodData = ref(<any>[]);
const addressDistrictData = ref(<any>[]);
const addressNeighborhoodData = ref(<any>[]);
let streetData = ref(<any>[]);

let applicant = ref(<any>{
  id: 0,
  name: <any>null,
  surname: <any>null,
  birthDate: <any>null,
  birthPlace: <any>null,
  gender: <any>null,
  maritalStatus: <any>null,
  educationLevel: <any>null,
  educationStatus: <any>null,
  workingStatus: <any>null,
  propertyStatus: <any>null,
  province: <any>null,
  socialSecurityNo: <any>null,
  district: <any>null,
  neighborhood: <any>null,
  addressProvince: <any>null,
  addressDistrict: <any>null,
  addressNeighborhood: <any>null,
  addressStreet: <any>null,
  address: <any>null,
  buildingNo: <any>null,
  apartmentNo: <any>null,
  healthStatus: <any>null,
  phone: <any>null,
  email: <any>null,
});

const socialSecurityMaskOptions: MaskInputOptions = {
  mask: "###########",
};

const phoneMaskOptions: MaskInputOptions = {
  mask: "(5##) ### ## ##",
};

//FUNCTION
async function getStreetData(isForceEmpty: boolean) {
  if (isForceEmpty) {
    applicant.value.addressStreet = null;
  }

  if (
    applicant.value.addressNeighborhood?.id == undefined ||
    applicant.value.addressNeighborhood?.id == null
  ) {
    streetData.value = [];
  } else {
    streetData.value = await fetchGet(
      `/public/api/v1/geo/neighborhood/${applicant.value.addressNeighborhood?.id}/street`
    );
  }

  console.log(streetData.value);
}
async function getDistrictData(isForceEmpty: boolean) {
  if (isForceEmpty) {
    applicant.value.district = null;
  }

  if (
    applicant.value.province?.id == undefined ||
    applicant.value.province?.id == null
  ) {
    districtData.value = [];
  } else {
    const districtResult = await fetchGet(
      `/public/api/v1/geo/province/${applicant.value.province?.id}/district`
    );
    districtData.value = districtResult;
  }

  if (applicant.value.district != null) {
    getNeighborhoodData(false);
  }
}
async function getNeighborhoodData(isForceEmpty: boolean) {
  if (isForceEmpty) {
    applicant.value.neighborhood = null;
  }
  if (
    applicant.value?.district?.id == undefined ||
    applicant.value?.district?.id == null
  ) {
    neighborhoodData.value = [];
  } else {
    const neighborhoodResult = await fetchGet(
      `/public/api/v1/geo/district/${applicant.value?.district?.id}/neighborhood`
    );
    neighborhoodData.value = neighborhoodResult;
  }
}
async function getAddressDistrictData(isForceEmpty: boolean) {
  if (isForceEmpty) {
    applicant.value.addressDistrict = null;
  }

  if (
    applicant.value.addressProvince?.id == undefined ||
    applicant.value.addressProvince?.id == null
  ) {
    addressDistrictData.value = [];
  } else {
    const districtResult = await fetchGet(
      `/public/api/v1/geo/province/${applicant.value.addressProvince?.id}/district`
    );
    addressDistrictData.value = districtResult;
  }

  if (applicant.value.addressDistrict != null) {
    getAddressNeighborhoodData(false);
  }
}
async function getAddressNeighborhoodData(isForceEmpty: boolean) {
  if (isForceEmpty) {
    applicant.value.addressNeighborhood = null;
  }

  if (
    applicant.value.addressDistrict?.id == null ||
    applicant.value.addressDistrict?.id == null
  ) {
    addressNeighborhoodData.value = [];
  } else {
    const neighborhoodResult = await fetchGet(
      `/public/api/v1/geo/district/${applicant.value.addressDistrict?.id}/neighborhood`
    );
    addressNeighborhoodData.value = neighborhoodResult;
  }

  if (applicant.value.addressNeighborhood != null) {
    getStreetData(false);
  }
}
async function pushNewStreet(streetName: any) {
  console.log(streetName);
  isLoading.value = true;
  newStreetDialog.value = true;
  if (applicant.value.addressNeighborhood != null) {
    await fetchPost(
      `/public/api/v1/geo/${applicant.value.addressNeighborhood?.id}/street`,
      {
        method: "POST",
      },
      {
        name: streetName,
        neighborhood: {
          id: applicant.value.addressNeighborhood.id,
        },
      }
    );
  }
  getStreetData(false);
  newStreetDialog.value = false;
  newStreetName.value = null;
  isLoading.value = false;
}

async function checkSocialSecurityNumberIsUniqe(param: any) {
  var resp = await fetchGet(
    "/api/v1/application?statuses=NEW&statuses=WAITING&statuses=DECLINED&statuses=APPROVED"
  );
  if (applicationStore.getCurrentPersonalInfo.id == 0) {
    console.log(resp);
    var filteredData = resp.filter(
      (t: any) => t.applicant.socialSecurityNo == param
    );
    console.log(filteredData);
    if (filteredData.length > 0) {
      return true;
    } else {
      false;
    }
  } else {
    var applicationById = await fetchGet(
      `/public/api/v1/application/${applicationStore.getCurrentApplication.id}`
    );

    if (applicationById.applicant.socialSecurityNo != param) {
      var filteredData = resp.filter(
        (t: any) => t.applicant.socialSecurityNo == param
      );
      if (filteredData.length > 0) {
        return true;
      } else {
        false;
      }
    } else {
      return false;
    }
  }
}
const validationOfapplicant = async () => {
  if (isStringShorterThan(applicant.value.name, 2)) {
    nameField.value = true;
    snackbarStore.makeToast(true, "error", "Lütfen Adınızı kontrol ediniz");
    console.log("1");
    return false;
  } else if (isStringShorterThan(applicant.value.surname, 2)) {
    surname.value = true;
    snackbarStore.makeToast(true, "error", "Lütfen soyadınızı kontrol ediniz");
    console.log("2");
    return false;
  } else if (isStringShorterThan(applicant.value.socialSecurityNo, 11)) {
    socialSecurityNo.value = true;
    snackbarStore.makeToast(
      true,
      "error",
      "Lütfen Tc kimlik numaranızı kontrol ediniz"
    );
    return false;
  } else if (
    await checkSocialSecurityNumberIsUniqe(applicant.value.socialSecurityNo)
  ) {
    socialSecurityNo.value = true;
    snackbarStore.makeToast(
      true,
      "error",
      "Bu Tc kimlik numarası başka bir başvuruda kullanılıyor."
    );
    return false;
  } else {
    applicationStore.application.applicant = applicant.value;
    return true;
  }
};

defineExpose({
  validationOfapplicant,
});

//ONMOUNTED
onMounted(async () => {
  const provinceResult = await fetchGet(
    "/public/api/v1/geo/country/1/province"
  );
  provinceData.value = provinceResult;
  if (applicant.value.province != null) {
    getDistrictData(false);
    getAddressDistrictData(false);
  }
});

watchEffect(() => {
  if (applicant.value.name != null) {
    applicant.value.name = applicant.value.name.toUpperCase();
  }
  if (applicant.value.surname != null) {
    applicant.value.surname = applicant.value.surname.toUpperCase();
  }

  if (applicationStore.getCurrentPersonalInfo.id != 0) {
    applicant.value = applicationStore.getCurrentPersonalInfo;
  }
});
</script>

<template>
  <v-col cols="12" sm="12" md="12" class="d-flex flex-wrap py-0">
    <v-dialog v-model="isLoading" width="100%" class="d-flex justify-center">
      <v-progress-circular
        indeterminate
        :size="76"
        :width="7"
      ></v-progress-circular>
    </v-dialog>
    <v-col cols="12" sm="12" md="12">
      <h1
        style="
          font-family: 'Roboto', sans-serif;
          font-family: 'Roboto Condensed', sans-serif;
          font-family: 'Roboto Slab', serif;
        "
      >
        Kişisel Bilgiler
      </h1>
    </v-col>
    <v-col cols="12" sm="4" md="4">
      <v-text-field
        :error="nameField"
        id="nameField"
        bg-color="#F5F5F5"
        v-model="applicant.name"
        pattern="[a-zA-Z]+"
        hide-details
        density="compact"
        clearable
        label="Ad"
        variant="outlined"
      ></v-text-field>
    </v-col>

    <v-col cols="12" sm="4" md="4">
      <v-text-field
        :error="surname"
        bg-color="#F5F5F5"
        style="opacity: 0-2"
        hide-details
        density="compact"
        clearable
        v-model="applicant.surname"
        label="Soyad"
        variant="outlined"
      ></v-text-field
    ></v-col>

    <v-col cols="12" sm="4" md="4">
      <v-text-field
        :error="socialSecurityNo"
        bg-color="#F5F5F5"
        style="opacity: 0-2"
        hide-details
        density="compact"
        clearable
        v-model="applicant.socialSecurityNo"
        v-maska:[socialSecurityMaskOptions]
        label="TC Kimlik Numarası"
        type="number"
        variant="outlined"
      ></v-text-field>
    </v-col>

    <v-col cols="12" sm="4" md="4">
      <v-select
        :error="gender"
        bg-color="#F5F5F5"
        hide-details
        density="compact"
        clearable
        v-model="applicant.gender"
        label="Cinsiyetiniz"
        :items="genders"
        item-title="name"
        item-value="id"
        variant="outlined"
      ></v-select>
    </v-col>

    <v-col cols="12" sm="4" md="4">
      <VueDatePicker
        style="border-radius: 0"
        auto-apply
        locale="tr"
        :format-locale="tr"
        format="dd/MM/yyyy"
        id="datePicker"
        placeholder="Doğum Tarihi"
        v-model="applicant.birthDate"
        :enable-time-picker="false"
      />
    </v-col>

    <v-col cols="12" sm="4" md="4">
      <v-autocomplete
        :error="birthPlace"
        hide-details
        density="compact"
        clearable
        bg-color="#F5F5F5"
        v-model="applicant.birthPlace"
        label="Doğum yeri"
        :items="provinceData"
        item-value="name"
        item-title="name"
        variant="outlined"
      ></v-autocomplete>
    </v-col>

    <v-col cols="12" sm="4" md="4">
      <v-select
        :error="maritalStatusError"
        bg-color="#F5F5F5"
        hide-details
        density="compact"
        clearable
        v-model="applicant.maritalStatus"
        label="Medeni Durumu"
        :items="maritalStatus"
        item-title="name"
        item-value="id"
        variant="outlined"
      ></v-select>
    </v-col>

    <v-col cols="12" sm="4" md="4" class="d-flex">
      <v-select
        :error="educationLevelError"
        bg-color="#F5F5F5"
        hide-details
        density="compact"
        clearable
        v-model="applicant.educationLevel"
        label="Eğitim Seviyesi"
        :items="educationLevel"
        item-title="name"
        item-value="id"
        variant="outlined"
      ></v-select>

      <v-select
        :error="educationStatusError"
        bg-color="#F5F5F5"
        style="padding-left: 6px"
        v-if="applicant.educationLevel !== null"
        hide-details
        density="compact"
        clearable
        v-model="applicant.educationStatus"
        label="Eğitim Durumu"
        :items="educationStatus"
        item-title="name"
        item-value="id"
        variant="outlined"
      ></v-select>
      <v-select
        :error="workingStatusError"
        bg-color="#F5F5F5"
        style="padding-left: 6px"
        v-if="applicant.educationStatus !== null"
        hide-details
        density="compact"
        clearable
        v-model="applicant.workingStatus"
        label="İş Durumu"
        :items="workingStatus"
        item-title="name"
        item-value="id"
        variant="outlined"
      ></v-select>
    </v-col>

    <v-col cols="12" sm="4" md="4">
      <v-select
        :error="propertyStatus"
        bg-color="#F5F5F5"
        hide-details
        density="compact"
        clearable
        v-model="applicant.propertyStatus"
        label="Mülk Durumu"
        :items="propertyStatusData"
        item-title="name"
        item-value="id"
        variant="outlined"
      ></v-select>
    </v-col>

    <v-col cols="12" sm="12" md="12" class="d-flex">
      <v-autocomplete
        :error="province"
        hide-details
        density="compact"
        clearable
        bg-color="#F5F5F5"
        v-model="applicant.province"
        label="Memleketi"
        :items="provinceData"
        item-value="id"
        item-title="name"
        variant="outlined"
        return-object
        @update:modelValue="getDistrictData(true)"
      ></v-autocomplete>

      <v-autocomplete
        :error="district"
        style="padding-left: 6px"
        hide-details
        bg-color="#F5F5F5"
        v-if="applicant.province != null"
        density="compact"
        clearable
        v-model="applicant.district"
        label="İlçesi"
        :items="districtData"
        item-value="id"
        item-title="name"
        variant="outlined"
        @update:modelValue="getNeighborhoodData(true)"
        return-object
      ></v-autocomplete>

      <v-autocomplete
        :error="neighborhood"
        style="padding-left: 6px"
        hide-details
        bg-color="#F5F5F5"
        v-if="applicant.district != null"
        density="compact"
        clearable
        v-model="applicant.neighborhood"
        label="Mahalle "
        :items="neighborhoodData"
        item-title="name"
        item-value="id"
        variant="outlined"
        return-object
      ></v-autocomplete>
    </v-col>

    <v-col cols="12" sm="12" md="12">İletişim Bilgileri*</v-col>
    <v-col cols="12" sm="5" md="5">
      <v-text-field
        :error="phone"
        bg-color="#F5F5F5"
        density="compact"
        clearable
        v-model="applicant.phone"
        label="Telefon Numarası"
        v-maska:[phoneMaskOptions]
        placeholder="(530) 888 88 88"
        hint="Lütfen başında sıfır olmadan giriniz"
        persistent-hint
        persistent-placeholder
        variant="outlined"
        type="tel"
        pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
      ></v-text-field>
    </v-col>

    <v-col cols="12" sm="7" md="7">
      <v-text-field
        :error="email"
        bg-color="#F5F5F5"
        density="compact"
        clearable
        v-model="applicant.email"
        label="Email"
        variant="outlined"
      ></v-text-field>
    </v-col>

    <v-col cols="12" sm="12" md="12" class="d-flex">
      <v-autocomplete
        :error="addressProvince"
        hide-details
        density="compact"
        clearable
        bg-color="#F5F5F5"
        v-model="applicant.addressProvince"
        label="Şehir"
        :items="provinceData"
        item-value="id"
        item-title="name"
        variant="outlined"
        @update:modelValue="getAddressDistrictData(true)"
        return-object
      ></v-autocomplete>

      <v-autocomplete
        :error="addressDistrict"
        style="padding-left: 6px"
        hide-details
        bg-color="#F5F5F5"
        v-if="applicant.addressProvince != null"
        density="compact"
        clearable
        :disabled="applicant.addressProvince == null"
        v-model="applicant.addressDistrict"
        label="İlçe"
        :items="addressDistrictData"
        item-value="id"
        item-title="name"
        variant="outlined"
        @update:modelValue="getAddressNeighborhoodData(true)"
        return-object
      ></v-autocomplete>

      <v-autocomplete
        :error="addressNeighborhood"
        style="padding-left: 6px"
        hide-details
        bg-color="#F5F5F5"
        v-if="applicant.addressDistrict != null"
        density="compact"
        clearable
        v-model="applicant.addressNeighborhood"
        label="Mahalle"
        :disabled="applicant.addressDistrict == null"
        :items="addressNeighborhoodData"
        @update:modelValue="getStreetData(true)"
        item-title="name"
        item-value="id"
        variant="outlined"
        return-object
      ></v-autocomplete>
    </v-col>

    <v-col cols="12" sm="10" md="10">
      <v-autocomplete
        :error="addressStreet"
        hide-details
        bg-color="#F5F5F5"
        v-if="applicant.addressNeighborhood != null"
        density="compact"
        clearable
        v-model="applicant.addressStreet"
        label="Sokak"
        :disabled="applicant.addressDistrict == null"
        :items="streetData"
        item-title="name"
        item-value="id"
        variant="outlined"
        return-object
      ></v-autocomplete>
      <v-btn
        v-if="applicant.addressNeighborhood != null"
        variant="text"
        size="small"
        color="primary"
        @click="newStreetDialog = true"
      >
        yeni sokak ekle
      </v-btn>
      <v-dialog v-model="newStreetDialog" width="50%">
        <v-col class="bg-white">
          <v-text-field
            variant="outlined"
            rounded="0"
            label="Yeni sokak adı girin"
            v-model="newStreetName"
          ></v-text-field>

          <v-col class="px-0 py-0 d-flex justify-end">
            <v-btn color="primary" @click="pushNewStreet(newStreetName)"
              >Kaydet</v-btn
            >
          </v-col>
        </v-col>
      </v-dialog>
    </v-col>
    <v-col cols="12" sm="1" md="1">
      <v-text-field
        :error="buildingNo"
        type="number"
        hide-details
        density="compact"
        bg-color="#F5F5F5"
        v-model="applicant.buildingNo"
        label="Bina No"
        variant="outlined"
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="1" md="1">
      <v-text-field
        :error="apartmentNo"
        type="number"
        hide-details
        density="compact"
        bg-color="#F5F5F5"
        v-model="applicant.apartmentNo"
        label="Daire No"
        variant="outlined"
      ></v-text-field>
    </v-col>
  </v-col>
</template>