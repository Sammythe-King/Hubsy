<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/hubsy.png" alt="ClassHub Logo" />
    </div>

    <nav class="nav">
      <ul>
        <li v-for="link in navLinks" :key="link.text">
          <a :href="link.url">{{ link.text }}</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// Customizable site name
const siteName = ref('Classhub')

// Navigation links (can add/remove links here)
const navLinks = ref([
  { text: 'Home', url: '#' },
  { text: 'Lessons', url: '#' },
  { text: 'About', url: '#' },
  { text: 'Contact', url: '#' },
])
</script>

<style scoped>
.header {

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1px 1rem;
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  height: 80px;
  
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;

}

.logo img{
  height: 150px;
  width: auto;
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
</style>
