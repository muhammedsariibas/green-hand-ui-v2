<template>
  <v-card class="mx-auto" max-width="500" min-width="500" theme="dark">
    <v-card-title class="p text-h6 font-weight-regular justify-space-between">
      <v-col class="pl-1 py-2">
        <span>Kullanıcı Girişi</span>
      </v-col>

      <v-divider></v-divider>
    </v-card-title>

    <v-card-text>
      <v-text-field label="Kullanıcı Adı" v-model="loginInfo.username"></v-text-field>
      <v-text-field label="Şifre" type="password" v-model="loginInfo.password"></v-text-field>
      <span class="text-caption text-grey-darken-1">
        Lütfen Kullanıcı adı ve şifrenizi girin
      </span>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="d-flex justify-center">
      <v-btn
        :loading="isLoading"
        block
        selected-class="backgroundGradient"
        style="
          background: linear-gradient(
            60deg,
            rgba(0, 172, 193, 1) 0%,
            rgba(84, 58, 183, 1) 100%
          );
        "
        @click="login"
      >
        Giriş
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTokenStore } from "../stores/tokenStore";
import { fetchPost } from "../utils/fetchUtils";
import router from "@/router";
import { useSnackbarStore } from '../stores/snackbarStore'
const snackbarStore = useSnackbarStore()

const tokenStore = useTokenStore();
let isLoading = ref<Boolean>(false);

let loginInfo = ref(<
  {
    username: string | null;
    password: string | null;
  }
>{
  username: null,
  password: null,
});

async function login() {
  isLoading.value = true;

  try {
    window.localStorage.removeItem("token");
    tokenStore.token = null;
    tokenStore.isTokenExist = false
    const resp = await fetchPost(
      "/public/api/v1/auth/login",
      { method: "POST" },
      loginInfo.value
    );
    console.log(resp.code)
    if (resp.code == 200) {
      tokenStore.token = resp.token;
      tokenStore.isTokenExist = true;
      router.push("/home");
    }else{
      console.log("error")
      snackbarStore.makeToast(true , 'error', 'Kullanıcı adı veya Şifre yanlış')
      isLoading.value = false
    }
  } catch (err) {
    snackbarStore.makeToast(true , 'error', 'Bir sorun oluştu.')
    isLoading.value = false
  }
}
</script>