<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/hubsy.png" alt="ClassHub Logo" />
    </div>

    <nav class="nav">
      <ul>
        <li v-for="link in navLinks" :key="link.text">
          <router-link :to="link.url">{{ link.text }}</router-link>
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
  { text: 'Home', url: '/' },
  { text: 'Lessons', url: '/lessons' },
  { text: 'About', url: '/about' },
  { text: 'Contact', url: '/contact' },
])
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
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.logo h1 {
  
  font-size: 1.5rem;

}

.logo img{
  height: 150px;
  width: auto;
  margin-top: 10px;
  /* filter: brightness(0) invert(1); */
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
