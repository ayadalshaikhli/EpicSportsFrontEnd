<template>
  <div>
    <CampsiteGrid :campsites="campsites" :error="error" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import CampsiteGrid from './CampsiteGrid.vue';

const props = defineProps(['searchParams', 'initialLoad']);
const campsites = ref([]);
const error = ref(null);

const fetchAllCampsites = async () => {
  try {
    const response = await axios.get('https://localhost:7063/api/Campsite');
    campsites.value = response.data;
    console.log("Fetched all campsites:", campsites.value);  
  } catch (err) {
    console.error('Error fetching all campsites:', err);
    handleError(err);
  }
};

const searchCampsites = async (searchParams) => {
  try {
    console.log("Searching campsites with params:", searchParams);
    const response = await axios.get('https://localhost:7063/api/Campsite/search', { params: searchParams });
    console.log("Response from API:", response.data); 
    campsites.value = response.data;
    console.log("Search results:", campsites.value);
    
    if (campsites.value.length === 0) {
      error.value = 'No campsites available for the given criteria.';
    } else {
      error.value = null;
    }
  } catch (err) {
    console.error('Error searching campsites:', err);
    handleError(err);
  }
};

const handleError = (err) => {
  console.error('Error:', err);
  if (err.response) {
    console.error('Response data:', err.response.data);
    console.error('Response status:', err.response.status);
  }
  error.value = 'Failed to fetch campsite data. Please try again later.';
};

watch(() => props.searchParams, (newSearchParams) => {
  console.log("New search params:", newSearchParams);
  if (props.initialLoad) {
    fetchAllCampsites();
  } else {
    if (newSearchParams) {
      searchCampsites(newSearchParams);
    } else {
      fetchAllCampsites();
    }
  }
});

onMounted(() => {
  if (props.initialLoad) {
    fetchAllCampsites();
  }
});
</script>
