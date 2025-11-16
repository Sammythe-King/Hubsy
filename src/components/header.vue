<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/hubsy.png" alt="ClassHub Logo" />
    </div>

    <!-- This wrapper stays the same -->
    <div class="header-right">
      <nav class="nav">
        <ul>
          <li v-for="link in navLinks" :key="link.text">
            <router-link :to="link.url">{{ link.text }}</router-link>
          </li>
        </ul>
      </nav>
      
      <!-- [SHOWS IF LOGGED OUT] The original "Get Started" button -->
      <div v-if="!isLoggedIn" class="nav-actions">
        <router-link to="/auth" class="btn btn-primary">
          Get Started
        </router-link>
      </div>

      <!-- [SHOWS IF LOGGED IN] The new Welcome message, Cart, and Logout button -->
      <div v-if="isLoggedIn" class="nav-actions">
        
        <!-- Cart Icon Wrapper (Stays the same) -->
        <router-link to="/cart" class="cart-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cart-icon">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span v-if="cartItemCount > 0" class="cart-count">{{ cartItemCount }}</span>
        </router-link>

        <!-- 
          NEW: User Dropdown 
          This replaces the "Hi, User" text and "Logout" button
        -->
        <div class="user-dropdown" ref="dropdownRef">
          <!-- The "Hi, Samuel" button that toggles the menu -->
          <button @click="isDropdownOpen = !isDropdownOpen" class="user-button">
            <!-- Yellow User Icon -->
            <span class="user-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </span>
            <!-- User Name -->
            <span>Hi, {{ user.name.split(' ')[0] }}</span>
            <!-- Dropdown Arrow -->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-icon" :class="{ 'rotated': isDropdownOpen }"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>

          <!-- The Dropdown Menu (only shows if 'isDropdownOpen' is true) -->
          <div v-if="isDropdownOpen" class="dropdown-menu">
            <a href="#" @click.prevent="logout" class="dropdown-item">
              Logout
            </a>
          </div>
        </div>
        <!-- END OF NEW DROPDOWN -->

      </div>

    </div>
  </header>
</template>

<script setup>
// 1. IMPORT `computed`, `ref`, `onMounted`, `onUnmounted`
import { ref, computed, onMounted, onUnmounted } from 'vue'
// 2. IMPORT our user "state", "logout" function, AND "cartItemCount"
import { user, logout, cartItemCount } from '../store.js'

// 3. CREATE a computed property
// This will automatically be `true` if user is logged in, or `false` if not.
const isLoggedIn = computed(() => !!user.value) // '!!' turns user object or null into true/false

// This is your existing code
const siteName = ref('Classhub')
const navLinks = ref([
  { text: 'Home', url: '/' },
  { text: 'Lessons', url: '/lessons' },
  { text: 'About', url: '/about' },
  { text: 'Contact', url: '/contact' },
])

// --- NEW DROPDOWN LOGIC ---
const isDropdownOpen = ref(false)
const dropdownRef = ref(null) // This will hold a reference to our dropdown

/**
 * Closes the dropdown if the user clicks outside of it
 */
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

// Add the click listener when the component mounts
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// Clean up the listener when the component unmounts
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
// --- END OF NEW DROPDOWN LOGIC ---
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 2rem 0px 1rem;
  background-color: #ececec;
  color: rgb(0, 0, 0);
  height: 80px;
  box-sizing: border-box;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.logo h1 {
  font-size: 1.5rem;
}

.logo img {
  height: 150px;
  width: auto;
  margin-top: 10px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 2.5rem; /* Adjust this gap between links and button */
}

.nav ul {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

.nav a {
  color: rgb(0, 0, 0);
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s;
}

.nav a:hover {
  color: #ff9900;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem; /* Gap between cart and user button */
}

/* This is your existing .btn style */
.btn {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-primary {
  background-color: #393833;
}

.btn-primary:hover {
  background-color: #000000;
  color: white;
}

/* --- CART ICON STYLES (from previous step) --- */
.cart-wrapper {
  position: relative;
  color: #393833;
  cursor: pointer;
  padding: 5px; /* Makes it easier to click */
}

.cart-icon {
  width: 26px;
  height: 26px;
  stroke: #393833;
  transition: stroke 0.2s;
}

.cart-wrapper:hover .cart-icon {
  stroke: #c0392b;
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -8px;
  background-color: #c0392b;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* --- NEW DROPDOWN STYLES --- */
.user-dropdown {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #393833; /* Dark background */
  color: white;
  padding: 8px 16px;
  border-radius: 20px; /* Fully rounded */
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  font-size: 15px;
  transition: background-color 0.2s;
}

.user-button:hover {
  background-color: #000000;
}

.user-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #B0AEAB; /* Yellow icon background */
}

.user-icon svg {
  stroke: #393833; /* Dark icon */
  width: 18px;
  height: 18px;
}

.chevron-icon {
  stroke: #a0a0a0;
  transition: transform 0.2s;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 110%; /* Position below the button */
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #ececec;
  min-width: 150px;
  z-index: 10;
  overflow: hidden;
}

.dropdown-item {
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: #393833;
  font-weight: 500;
  font-size: 14px;
  background-color: white;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}
/* --- END NEW STYLES --- */
</style>