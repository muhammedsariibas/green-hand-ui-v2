<script lang="ts" setup>
import ApplicationComp from "@/components/ApplicationComp.vue";
</script>
<template>
  <v-col
    cols="12"
    sm="12"
    md="12"
    class="px-0 py-0"
    style="background-color: white; height: 100vh"
  >
    <ApplicationComp></ApplicationComp>
  </v-col>
</template>

<style>
.v-slide-group-item--active {
  background: linear-gradient(
    60deg,
    rgba(84, 58, 183, 1) 0%,
    rgba(0, 172, 193, 1) 100%
  );
}

.v-slide-group-item--active {
  color: white;
}

.v-overlay__scrim {
  opacity: 0.7 !important;
}

.v-field--error:not(.v-field--disabled) {
  background-color: rgba(255, 0, 0, 0.1) !important;
}
</style>


