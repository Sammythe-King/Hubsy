<script setup>
import { onMounted } from 'vue';
import Header from './components/header.vue'
import MainContent from './components/maincontent.vue'
import Footer from './components/footer.vue';
import { loadUser } from './store.js'
import Notification from './components/Notification.vue';

onMounted(() => {
  loadUser()
})

</script>

<template>
  <Header />
  <router-view />
  <Footer />
  <Notification />
</template>

<style >

body{
  margin: 0;
}

</style>
