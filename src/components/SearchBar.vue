<template>
  <form class="search-bar" @submit.prevent="emitSearch">
    <div class="search-input">
      <label for="location">Where</label>
      <input type="text" id="location" v-model="location" placeholder="Search destinations" />
    </div>

    <div class="search-input">
      <label for="checkin">Check in</label>
      <input type="date" id="checkin" v-model="startDate" />
    </div>

    <div class="search-input">
      <label for="checkout">Check out</label>
      <input type="date" id="checkout" v-model="endDate" />
    </div>

    <div class="search-input">
      <label for="Max Price">Max Price Per Night</label>
      <input type="number" step="0.01" min="0" id="maxprice" v-model="maxPrice" />
    </div>

    <button class="search-button" type="submit">
      <span class="material-symbols-outlined">Search</span>
    </button>
  </form>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import dayjs from 'dayjs';

const location = ref('');
const startDate = ref('');
const endDate = ref('');
const maxPrice = ref(null);

const formatDate = (date) => {
  return date ? dayjs(date).format('YYYY-MM-DD') : '';
};

const emit = defineEmits(['search']);

const emitSearch = () => {
  const searchParams = {
    location: location.value || undefined,
    checkin: formatDate(startDate.value) || undefined,
    checkout: formatDate(endDate.value) || undefined,
    maxPrice: maxPrice.value || undefined
  };
  
  console.log("Emitting search parameters:", searchParams);  
  
  emit('search', searchParams);
  
  location.value = '';
  startDate.value = '';
  endDate.value = '';
  maxPrice.value = '';
};
</script>
