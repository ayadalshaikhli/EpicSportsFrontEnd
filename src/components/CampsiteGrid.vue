<template>
  <div class="campsite-grid">
      <CampsiteCard 
          v-for="campsite in campsites" 
          :key="campsite.id" 
          :campsite="campsite" 
      />
      <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import CampsiteCard from './CampsiteCard.vue';
import { defineProps } from 'vue';

const props = defineProps({
  campsites: Array,
  error: String
});

console.log("Campsites in CampsiteGrid:", props.campsites);  // Debugging line
</script>
