<template>
  <div class="confirmation-container">
    <div class="confirmation-box">
      <div class="icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <h1 class="title">Thank You For Your Order!</h1>
      <p class="message">
        Your order has been submitted successfully. You will receive a confirmation
        email shortly with your details.
      </p>
      <router-link to="/" class="btn-home">
        Back to Homepage
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.confirmation-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  background-color: #f9f9f9;
  min-height: 70vh;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.confirmation-box {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 48px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.icon-wrapper {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #d1f7dd; /* A nice light green */
  color: #1a7431; /* A dark green */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #0E0A07;
  margin-bottom: 16px;
}

.message {
  font-size: 15px;
  color: #72706B;
  line-height: 1.6;
  margin-bottom: 32px;
}

.btn-home {
  display: inline-block;
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  color: #ffffff;
  background-color: #393833;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-home:hover {
  background-color: #000000;
}
</style>