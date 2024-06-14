<template>
  <div class="campsite-detail" v-if="campsite">
    <img v-if="campsite.imageBase64" :src="`data:image/jpeg;base64,${campsite.imageBase64}`" alt="Campsite" class="detail-image" />
    <h1>{{ campsite.name }}</h1>
    <p>{{ campsite.location }}</p>
    <p>{{ campsite.description }}</p>
    <p>Price per night: {{ campsite.pricePerNight }} €</p>

    <div v-if="campsite.amenities" class="amenities">
      <h3>Amenities:</h3>
      <ul>
        <li v-for="amenity in campsite.amenities.split(', ')" :key="amenity">{{ amenity }}</li>
      </ul>
    </div>

    <div class="booking-section">
      <BookingForm :campsite="campsite" />
    </div>

    <div v-if="bookingError" class="error">{{ bookingError }}</div>
  </div>
  <div v-else class="loading">
    Loading campsite details...
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import axios from 'axios';
import DatePicker from '@vuepic/vue-datepicker'; 
import '@vuepic/vue-datepicker/dist/main.css';
import BookingForm from './BookingForm.vue';

export default {
  components: { DatePicker, BookingForm },
  data() {
    return {
      campsite: null,
      bookingError: ''
    };
  },
  async created() {
    const route = useRoute();
    const campsiteId = route.params.id;
    try {
      const response = await axios.get(`https://localhost:7063/api/Campsite/${campsiteId}`);
      this.campsite = response.data;
    } catch (error) {
      console.error('Error fetching campsite details', error);
      this.bookingError = 'Error loading campsite details.';
    }
  }
};
</script>

<style>
.error {
  color: red;
}
</style>
