<template>
  <main class="main-content">

    <!-- ======= Section 1: Hero with image background ======= -->
    <section class="hero-section">
      <div class="hero-box">
        <h1>{{ hero.title }}</h1>
        <p>{{ hero.text }}</p>
      </div>
    </section>

    <!-- ======= Section 2: Why Hubsy ======= -->
    <section class="why-hubsy">
      <h2>{{ whyHubsy.title }}</h2>
      <div class="reasons-container">
        <div class="reason" v-for="(item, index) in whyHubsy.reasons" :key="index">
          <img :src="item.icon" :alt="item.title" />
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </div>
      </div>
    </section>

    <!-- ======= Section 3: How it Works ======= -->
    <section class="how-it-works">
      <h2>{{ howItWorks.title }}</h2>
      <div class="steps-container">
        <div class="step" v-for="(item, index) in howItWorks.steps" :key="index">
          <img :src="item.icon" :alt="item.title" />
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </div>
      </div>
    </section>

  </main>
</template>

<script setup>
import { ref } from 'vue'

// ======= Hero section =======
const hero = ref({
  title: 'Welcome to Hubsy!',
  text: 'Your platform for amazing solutions.',
  backgroundImage: '@/assets/hero-bg.jpg' // change to your image
})

// ======= Why Hubsy section =======
const whyHubsy = ref({
  title: 'Why Choose Hubsy?',
  reasons: [
    {
      icon: '@/assets/icon1.png',
      title: 'Fast & Reliable',
      text: 'Get things done quickly without hassle.'
    },
    {
      icon: '@/assets/icon2.png',
      title: 'Easy to Use',
      text: 'User-friendly interface for everyone.'
    },
    {
      icon: '@/assets/icon3.png',
      title: '24/7 Support',
      text: 'We are always here to help you.'
    }
  ]
})

// ======= How it Works section =======
const howItWorks = ref({
  title: 'How it Works',
  steps: [
    {
      icon: '@/assets/step1.png',
      title: 'Sign Up',
      text: 'Create an account in just a few steps.'
    },
    {
      icon: '@/assets/step2.png',
      title: 'Choose a Plan',
      text: 'Select the plan that fits your needs.'
    },
    {
      icon: '@/assets/step3.png',
      title: 'Start Using Hubsy',
      text: 'Enjoy all the benefits and features.'
    }
  ]
})
</script>

<style scoped>
.main-content {
  font-family: sans-serif;
}

/* ======= Section 1: Hero ======= */
.hero-section {
  position: relative;
  height: 600px;
  background: url('@/assets/college.jpg') center/cover no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;

}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* adjust opacity (0.5 = 50% dark) */
  z-index: 1;
}

.hero-box {
  background-color: rgba(255, 255, 255, 0.85);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  max-width: 500px;
}

.hero-box h1 {
  margin-bottom: 1rem;
  font-size: 2rem;
}

.hero-box p {
  font-size: 1rem;
}

/* ======= Section 2: Why Hubsy ======= */
.why-hubsy {
  padding: 4rem 2rem;
  text-align: center;
  background-color: #f5f5f5;
}

.why-hubsy h2 {
  margin-bottom: 3rem;
}

.reasons-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.reason {
  background-color: white;
  padding: 2rem;
  border-radius: 15px;
  width: 250px;
  text-align: center;
}

.reason img {
  height: 60px;
  margin-bottom: 1rem;
}

/* ======= Section 3: How it Works ======= */
.how-it-works {
  padding: 4rem 2rem;
  text-align: center;
}

.how-it-works h2 {
  margin-bottom: 3rem;
}

.steps-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.step {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 15px;
  width: 250px;
  text-align: center;
}

.step img {
  height: 60px;
  margin-bottom: 1rem;
}
</style>
