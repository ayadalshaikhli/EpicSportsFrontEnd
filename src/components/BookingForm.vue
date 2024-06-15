<template>
  <div class="booking-form">
    <h2>Book {{ campsite.name }}</h2>
    <form @submit.prevent="submitBooking">
      <label for="dateRange">Select Date Range</label>
      <Datepicker v-model="booking.dateRange" range format="yyyy-MM-dd" required />

      <label for="guests">Number of Guests</label>
      <input type="number" v-model="booking.numberOfGuests" min="1" required />

      <p>Total Price: {{ totalPrice }} Euro</p>

      <button type="submit">Book Now</button>

      <div v-if="bookingError" class="error-message">{{ bookingError }}</div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
  props: ['campsite'],
  components: {
    Datepicker
  },
  data() {
    return {
      booking: {
        dateRange: [],
        numberOfGuests: 1,
        totalPrice: 0,
        bookingStatus: 'Confirmed'
      },
      bookingError: ''
    };
  },
  computed: {
    totalPrice() {
      if (this.booking.dateRange.length === 2) {
        const startDate = new Date(this.booking.dateRange[0]);
        const endDate = new Date(this.booking.dateRange[1]);
        const numberOfNights = (endDate - startDate) / (1000 * 60 * 60 * 24);
        return numberOfNights * this.campsite.pricePerNight;
      }
      return 0;
    }
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      const month = '' + (d.getMonth() + 1);
      const day = '' + d.getDate();
      const year = d.getFullYear();

      return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
    },
    resetBookingForm() {
      this.booking.dateRange = [];
      this.booking.numberOfGuests = 1;
      this.booking.totalPrice = 0;
      this.booking.bookingStatus = 'Confirmed';
      this.bookingError = '';
    },
    async submitBooking() {
      try {
        const token = sessionStorage.getItem('token');
        const user = JSON.parse(sessionStorage.getItem('user'));

        if (!user) {
          this.bookingError = 'You must be logged in.';
          return;
        }

        const userId = user.Id || user.id;
        this.booking.totalPrice = this.totalPrice;

        const bookingData = {
          userId,
          campsiteId: this.campsite.id,
          startDate: this.formatDate(this.booking.dateRange[0]),
          endDate: this.formatDate(this.booking.dateRange[1]),
          numberOfGuests: this.booking.numberOfGuests,
          totalPrice: this.booking.totalPrice,
          bookingStatus: this.booking.bookingStatus
        };

        const response = await axios.post('https://localhost:7063/api/Booking', bookingData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 201) {
          alert('Booking successful');
          this.resetBookingForm();
        }
      } catch (error) {
        console.error('Booking failed', error.response || error);

        if (error.response) {
          console.log('Error response data:', error.response.data);
          console.log('Error response status:', error.response.status);
          console.log('Error response headers:', error.response.headers);
          if (error.response.data.errors) {
            this.bookingError = `Booking failed: ${Object.values(error.response.data.errors).flat().join(', ')}`;
          } else {
            this.bookingError = error.response.data.message || 'Booking failed. Please try again.';
          }
        } else {
          this.bookingError = 'Booking failed. Please try again.';
        }
      }
    }
  }
};
</script>
