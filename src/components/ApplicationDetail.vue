<script setup lang="ts">
const props: any = defineProps(["application"]);
</script>
<template>
  <v-col cols="12" sm="12" md="12" class="px-0 py-0 d-flex flex-wrap">
    <v-col cols="12" sm="12" md="12"
      ><h1
        style="
          font-family: 'Roboto', sans-serif;
          font-family: 'Roboto Condensed', sans-serif;
          font-family: 'Roboto Slab', serif;
        "
      >
        Başvuru Detayları
      </h1>
    </v-col>
    <v-col cols="12" sm="12" md="12">
      <h2>Kişisel Bilgiler</h2>
      <v-table fixed-header density="compact">
        <thead>
          <tr>
            <th class="text-left">Ad</th>
            <th class="text-left">Soyad</th>
            <th class="text-left">TC Kimlik Numarası</th>
            <th class="text-left">Cinsiyet</th>
            <th class="text-left">Doğum Tarihi</th>
            <th class="text-left">Doğum Yeri</th>
            <th class="text-left">Medeni Hali</th>
            <th class="text-left">Eğitim Durumu</th>
            <th class="text-left">Çalışma Durumu</th>
            <th class="text-left">Mülk Durumu</th>
            <th class="text-left">Memleket</th>
            <th class="text-left">Telefon Numarası</th>
            <th class="text-left">E-mail</th>
            <th class="text-left">Adres</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {{
                application.applicant.name
                  ? $t(application.applicant.name)
                  : "--"
              }}
            </td>
            <td>
              {{
                application.applicant.surname
                  ? application.applicant.surname
                  : "--"
              }}
            </td>
            <td>
              {{
                application.applicant.socialSecurityNo
                  ? application.applicant.socialSecurityNo
                  : "--"
              }}
            </td>
            <td>
              {{
                application.applicant.gender
                  ? $t(application.applicant.gender)
                  : "--"
              }}
            </td>
            <td>
              {{
                application.applicant.birthDate
                  ? application.applicant.birthDate
                  : "--"
              }}
            </td>
            <td>
              {{
                application.applicant.birthPlace
                  ? application.applicant.birthPlace
                  : "--"
              }}
            </td>
            <td>
              {{
                application.applicant.maritalStatus
                  ? $t(application.applicant.maritalStatus)
                  : "--"
              }}
            </td>
            <td>
              {{
                application.applicant.educationLevel
                  ? $t(application.applicant.educationLevel)
                  : "--"
              }}
              /
              {{
                application.applicant.educationStatus
                  ? $t(application.applicant.educationStatus)
                  : "--"
              }}
            </td>
            <td>
              {{
                application.applicant.workingStatus
                  ? $t(application.applicant.workingStatus)
                  : "--"
              }}
            </td>
            <td>
              {{
                application.applicant.propertyStatus
                  ? $t(application.applicant.propertyStatus)
                  : "--"
              }}
            </td>
            <td>
              {{
                application.applicant.province
                  ? application.applicant.province.name
                  : "--"
              }}
              /
              {{
                application.applicant.district
                  ? application.applicant.district.name 
                  : "--"
              }}
              /
              {{
                application.applicant.neighborhood
                  ? application.applicant.neighborhood.name
                  : "--"
              }}
            </td>
            <td>
              {{
                application.applicant.phone
                  ? application.applicant.phone
                  : "--"
              }}
            </td>
            <td>
              {{
                application.applicant.email
                  ? application.applicant.email
                  : "--"
              }}
            </td>
            <td>
              {{
                application.applicant.addressProvince
                  ? application.applicant.addressProvince.name
                  : "--"
              }}
              /
              {{
                application.applicant.addressDistrict
                  ? application.applicant.addressDistrict.name
                  : "--"
              }}
              /
              {{
                application.applicant.addressNeighborhood
                  ? application.applicant.addressNeighborhood.name
                  : "--"
              }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
    <v-col
      cols="12"
      sm="12"
      md="12"
      v-if="
        application.householdMembers != null ||
        application.householdMembers != undefined
      "
    >
      <h2>Aile Üyeleri</h2>
      <v-table fixed-header density="compact">
        <thead>
          <tr>
            <th class="text-left">Yakınlık Derecesi</th>
            <th class="text-left">Ad</th>
            <th class="text-left">soyad</th>
            <th class="text-left">Doğum Tarihi</th>
            <th class="text-left">Cinsiyet</th>
            <th class="text-left">Doğum Yeri</th>
            <th class="text-left">Medeni Durumu</th>
            <th class="text-left">Eğitim Durumu</th>
            <th class="text-left">Çalışma Durumu</th>
            <th class="text-left">Sağlık Durumu</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in application.householdMembers" :key="item.id">
            <td>
              {{ item.relativityDegree ? $t(item.relativityDegree) : "--" }} /{{
                item.comment ? item.comment : null
              }}
            </td>
            <td>{{ item.name ? item.name : "--" }}</td>
            <td>{{ item.surname ? item.surname : "--" }}</td>
            <td>{{ item.birthDate ? item.birthDate : "--" }}</td>
            <td>{{ item.gender ? $t(item.gender) : "--" }}</td>
            <td>{{ item.birthPlace ? item.birthPlace : "--" }}</td>
            <td>{{ item.maritalStatus ? $t(item.maritalStatus) : "--" }}</td>
            <td>
              {{ item.educationLevel ? $t(item.educationLevel) : "--" }} /
              {{ item.educationStatus ? $t(item.educationStatus) : "--" }}
            </td>
            <td>{{ item.workingStatus ? $t(item.workingStatus) : "--" }}</td>
            <td>{{ item.healthStatus ? $t(item.healthStatus) : "--" }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>

    <v-col
      v-if="application.incomes != null || application.incomes != undefined"
      cols="12"
      sm="12"
      md="12"
    >
      <h2>Gelir Durumu</h2>
      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-left">Gelir Türü</th>
            <th class="text-left">Çalişan Kişi</th>
            <th class="text-left">Yakınlık Dercesi</th>
            <th class="text-left">Gelir Miktari</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in application?.incomes" :key="item.id">
            <td>
              {{ item.occupation ? $t(item.occupation) : "--" }} /
              {{ item.comment ? item.comment : null }}
            </td>
            <td>{{ item.name ? $t(item.name) : "--" }}</td>
            <td>
              {{ item.relativityDegree ? $t(item.relativityDegree) : "--" }}
            </td>
            <td>{{ item.income ? item.income : "--" }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
    <v-col
      v-if="application.properties != null || application.properties != undefined"
      cols="12"
      sm="12"
      md="12"
    >
      <h2>Gider Durumu</h2>
      <v-table density="compact">
            <thead>
              <tr>
                <th class="text-left">Gider Türü</th>
                <th class="text-left">Açıklama</th>
                <th class="text-left">Gider Tutarı</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in application?.properties" :key="item.id">
                <td>{{ item.name ? $t(item.name) : "--" }}</td>
                <td>{{ item.type ? $t(item.type) : "--"}}</td>
                <td>{{ item.income ? item.income : "--"}}</td>
              </tr>
            </tbody>
          </v-table>
    </v-col>
   
  </v-col>
</template>