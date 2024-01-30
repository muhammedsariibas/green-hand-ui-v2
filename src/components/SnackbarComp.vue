<template>
    <v-snackbar v-model="internalIsOpen" location="top left" 
    :color="props.color"
    >
      {{ text }}
  
      <template v-slot:actions>
        <v-btn color="black" variant="text" @click="closeSnackbar">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';

  
  const emit = defineEmits(['update:modelValue']);
  const props = defineProps<{
    text: string | null,
    modelValue: boolean | null
    color: any
  }>()
  
  const internalIsOpen = ref<any>(props.modelValue);
  
  watch(() => props.modelValue, (newVal) => {
    internalIsOpen.value = newVal;
  });
  
  // Snackbar'ı kapatmak için fonksiyon
  function closeSnackbar() {
    internalIsOpen.value = false;
    emit('update:modelValue', false);
  }
  </script>
  