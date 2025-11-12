<script setup>
import Header from './components/header.vue'
import MainContent from './components/maincontent.vue'
import Footer from './components/footer.vue';

</script>

<template>
  <Header />
  <router-view />
  <Footer />



</template>

<style >

body{
  margin: 0;
}

</style>
