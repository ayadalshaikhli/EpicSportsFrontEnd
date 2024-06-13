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

<style scoped>
.campsite-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.error {
  color: red;
  margin-top: 20px;
}
</style>
