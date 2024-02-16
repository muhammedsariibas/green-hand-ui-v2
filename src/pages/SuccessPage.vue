<template>
  <v-col
    class="d-flex justify-center align-center py-10"
    style="
      background: linear-gradient(
        60deg,
        rgba(84, 58, 183, 1) 0%,
        rgba(0, 172, 193, 1) 100%
      );
      height: 100vh;
      color: white;
    "
  >
    <v-card elevation="24" height="280px">
      <v-col cols="12" sm="12" md="12">
        <v-alert type="success">Başvurunuz Tamamlandı</v-alert>
        <v-table>
          <tbody>
            <tr>
              <td>Başvuru Tarihi</td>
              <td>{{ newDate() }}</td>
            </tr>

            <tr>
              <td>Başvuru Durumu</td>
              <td>Onaylandı</td>
            </tr>
            <tr>
              <td>Açıklama</td>
              <td>
                Başvurunuz alınmıştır. başvurunuzun onaylanması durumunda
                sizlere ulaşacağız
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-card-actions class="d-flex justify-end">
        <span style="font-size: small">Başvuru Ekranına Dön</span>
        <router-link
          to="/application"
          style="text-decoration: none; color: #e0e0e0"
        >
          <v-icon size="x-large" style="color: black"> mdi-exit-to-app </v-icon>
        </router-link>
        
      </v-card-actions>
    </v-card>
  </v-col>
</template>
  <script lang="ts" setup>
import { tr } from "date-fns/locale";
import { useApplicationStore } from "@/stores/applicationStore";
const applicationStore = useApplicationStore()

function newDate() {
  return (
    new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
  );
}
</script>