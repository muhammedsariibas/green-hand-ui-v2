
<template>
  <div class="loginPageContainer">
    <LoginCompVue />
  </div>
</template>

<script lang="ts" setup>
import LoginCompVue from "../components/LoginComp.vue";
</script>

<style scoped>
.loginPageContainer {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    60deg,
    rgba(84, 58, 183, 1) 0%,
    rgba(0, 172, 193, 1) 100%
  );
}
</style>
