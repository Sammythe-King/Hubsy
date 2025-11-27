<template>
  <!-- This transition provides the fade-in/out effect -->
  <transition name="fade">
    <div v-if="notification.message" class="notification-container" :class="'type-' + notification.type">
      <div class="notification-content">
        <!-- Icon based on type -->
        <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <svg v-else-if="notification.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        
        <p>{{ notification.message }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { notification } from '../store.js'
</script>

<style scoped>
.notification-container {
  position: fixed; /* Floats on top of everything */
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 500;
  font-size: 15px;
  display: flex;
  align-items: center;
  max-width: 400px;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
}
.notification-content p {
  margin: 0;
  line-height: 1.4;
}
.notification-content svg {
  flex-shrink: 0;
}

/* Colors based on type */
.type-success {
  background-color: #d1f7dd;
  color: #1a7431;
  border: 1px solid #a3e9b8;
}
.type-error {
  background-color: #fef2f2;
  color: #c0392b;
  border: 1px solid #fbcbc8;
}
.type-info {
  background-color: #e6f0ff;
  color: #0066ff;
  border: 1px solid #b3d1ff;
}


/* Transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>