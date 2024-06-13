<template>
  <div>
    <div class="account-detail" v-if="user">
      <h1>My Account Information</h1>
      <label><strong>Username:</strong> <input v-model="user.username" @input="checkChanges" class="input-field" /></label>
      <label><strong>Email:</strong> <input v-model="user.email" @input="checkChanges" class="input-field" /></label>
      <label><strong>First Name:</strong> <input v-model="user.firstName" @input="checkChanges" class="input-field" /></label>
      <label><strong>Last Name:</strong> <input v-model="user.lastName" @input="checkChanges" class="input-field" /></label>
      <label>
        <strong>Phone Number:</strong>
        <input v-model.number="user.phoneNumber" @input="checkChanges" class="input-field" type="tel" required/>
        <span v-if="phoneNumberError" class="error-message">Phone number must be 9 digits.</span>
      </label>
      <button :disabled="!changesMade" @click="updateUserInfo" class="update-button">Update Info</button>
      <button @click="togglePasswordFields" class="change-password-button">Change Password</button>
      <div v-if="showPasswordFields" class="password-fields">
        <label><strong>Current Password:</strong> <input v-model="currentPassword" type="password" class="input-field" /></label>
        <span v-if="currentPasswordError" class="error-message">{{ currentPasswordError }}</span>
        <label><strong>New Password:</strong> <input v-model="newPassword" type="password" class="input-field" /></label>
        <button @click="updatePassword" class="update-password-button">Update Password</button>
      </div>
      <!--<button @click="deleteAccount" class="delete-button">Delete Account</button>-->
    </div>
    <div v-else class="loading">
      <p>Loading account details...</p>
      <p v-if="error">{{ error }}</p>
    </div>
    <div class="account-detail" v-if="bookings.length">
      <h1>My Bookings</h1>
      <ul class="booking-list">
        <li v-for="booking in bookings" :key="booking.id" class="booking-item">
          <div class="booking-details">
            <p><strong>Camping:</strong> {{ booking.campsite.name }}</p>
            <p><strong>Location:</strong> {{ booking.campsite.location }}</p>
            <p><strong>Date:</strong> {{ formatDate(booking.startDate) }} - {{ formatDate(booking.endDate) }}</p>
          </div>
          <button @click="cancelBooking(booking.id)" class="cancel-button">Cancel Booking</button>
        </li>
      </ul>
    </div>
    <div v-else class="loading">
      <p>No bookings found.</p>
      <p v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const user = ref(null);
const bookings = ref([]);
const error = ref(null);
const phoneNumberError = ref(false);
const currentPasswordError = ref(false);
const currentPassword = ref('');
const newPassword = ref('');
const changesMade = ref(false);
const showPasswordFields = ref(false);

const fetchUserData = async () => {
  try {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      user.value = JSON.parse(userData);
      await fetchUserBookings(user.value.id);
    } else {
      error.value = 'User data not found. Please log in again.';
    }
  } catch (err) {
    console.error('Error fetching data:', err);
    error.value = 'Failed to fetch user data. Please try again later.';
  }
};

const fetchUserBookings = async (userId) => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.get(`https://localhost:7063/api/User/${userId}/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    bookings.value = response.data;
  } catch (err) {
    console.error('Error fetching bookings:', err);
    error.value = 'Failed to fetch bookings. Please try again later.';
  }
};

const cancelBooking = async (bookingId) => {
  try {
    const token = sessionStorage.getItem('token');
    await axios.delete(`https://localhost:7063/api/Booking/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Remove the canceled booking from the bookings list
    bookings.value = bookings.value.filter(booking => booking.id !== bookingId);
  } catch (err) {
    console.error('Error canceling booking:', err);
    error.value = 'Failed to cancel booking. Please try again later.';
  }
};

const updateUserInfo = async () => {
  try {
    // Validate phone number
    if (user.value.phoneNumber < 100000000 || user.value.phoneNumber > 999999999) {
      phoneNumberError.value = true;
      return;
    }
    phoneNumberError.value = false;

    const token = sessionStorage.getItem('token');
    const updatedUser = { ...user.value };

    await axios.put(`https://localhost:7063/api/User/${user.value.id}`, updatedUser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert('User information updated successfully');
    await fetchUserData();
  } catch (err) {
    console.error('Error updating user info:', err);
    error.value = 'Failed to update user info. Please try again later.';
  }
};

const updatePassword = async () => {
  try {
    if (!currentPassword.value || !newPassword.value) {
      currentPasswordError.value = 'Current and new passwords are required.';
      return;
    }

    const token = sessionStorage.getItem('token');
    const passwordData = {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    };

    await axios.put(`https://localhost:7063/api/User/${user.value.id}/password`, passwordData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert('Password updated successfully');
    await fetchUserData();
  } catch (err) {
    console.error('Error updating password:', err);
    if (err.response.data.errors && err.response.data.errors.CurrentPassword) {
      currentPasswordError.value = err.response.data.errors.CurrentPassword[0];
    } else {
      currentPasswordError.value = 'Failed to update password. Please try again later.';
    }
  }
};

const deleteAccount = async () => {
  try {
    const token = sessionStorage.getItem('token');
    await axios.delete(`https://localhost:7063/api/User/${user.value.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert('Account deleted successfully');
    
    // Perform logout or redirect to login page
    sessionStorage.clear();
    window.location.href = '/login';
  } catch (err) {
    console.error('Error deleting account:', err);
    error.value = 'Failed to delete account. Please try again later.';
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const togglePasswordFields = () => {
  showPasswordFields.value = !showPasswordFields.value;
  // Reset password fields when toggling visibility
  currentPassword.value = '';
  newPassword.value = '';
};

const checkChanges = () => {
  // Check if any changes were made to user details fields
  changesMade.value = (
    user.value.username !== user.username ||
    user.value.email !== user.email ||
    user.value.firstName !== user.firstName ||
    user.value.lastName !== user.lastName ||
    user.value.phoneNumber !== user.phoneNumber
  );
};

// Fetch user data when the component is mounted
fetchUserData();

// Watch for changes in phoneNumber and ensure it is a string
watch(() => user.value?.phoneNumber, (newVal) => {
  if (newVal !== undefined) {
    user.value.phoneNumber = String(newVal);
  }
});

</script>

<style scoped>
.account-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.loading {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

.booking-list {
  list-style: none;
  padding: 0;
}

.booking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.booking-details {
  flex-grow: 1;
}

.cancel-button {
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: darkred;
}

.update-button {
  padding: 10px;
  background-color: blue;
  color: white;
  border: none;
  cursor: pointer;
  margin-bottom: 10px; /* Adjusted to move button above Change Password */
  margin-right: 10px; 
}

.update-button:hover {
  background-color: darkblue;
}

.update-password-button {
  padding: 10px;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}

.update-password-button:hover {
  background-color: darkgreen;
}

.delete-button {
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
}

.delete-button:hover {
  background-color: darkred;
}

label {
  display: block;
  margin-bottom: 10px;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: -10px;
}

.change-password-button {
  padding: 10px;
  background-color: #ccc;
  color: black;
  border: none;
  cursor: pointer;
  margin-bottom: 10px;
}

.change-password-button:hover {
  background-color: #bbb;
}

.password-fields {
  margin-top: 10px;
}
</style>
