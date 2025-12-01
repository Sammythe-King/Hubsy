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
import deadlineIcon from '@/assets/deadline.png'
import thumbs from '@/assets/thumbs-up.png'
import time from '@/assets/24-7.png'
import account from '@/assets/add.png'
import plane from '@/assets/paper-plane.png'
import learn from '@/assets/library.png'


// ======= Hero section =======
const hero = ref({
  title: 'Welcome to ubsy!',
  text: 'Your all-in-one Hub for After-School Learning',
  backgroundImage: '@/assets/hero-bg.jpg' // change to your image
})

// ======= Why Hubsy section =======
const whyHubsy = ref({
  title: 'Why Choose Hubsy?',
  reasons: [
    {
      icon: deadlineIcon,
      title: 'Fast & Reliable',
      text: 'Get things done quickly without hassle.'
    },
    {
      icon: thumbs,
      title: 'Easy to Use',
      text: 'User-friendly interface for everyone.'
    },
    {
      icon: time,
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
      icon: account,
      title: 'Sign Up',
      text: 'Create an account in just a few steps.'
    },
    {
      icon: plane,
      title: 'Choose a Plan',
      text: 'Browse a wide range of after-school activities, and find what fits you.'
    },
    
    {
      icon: learn,
      title: 'Learn and Grow',
      text: 'Enjoy engaging, high-quality lessons designed to build new skills, confidence, and creativity beyond the classroom.'
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
  align-items: center;
  justify-content: flex-start; /* moves content to the left */
  padding-left: 10%; /* breathing room from edge */
  overflow: hidden;

}

.hero-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.35); /* adjust opacity (0.5 = 50% dark) */
  
}

.hero-box {
  position: relative;
  z-index: 2;
  color: #f1f1f1; /* soft white — easy on the eyes */
  max-width: 1000px;
}

.hero-box h1 {
  font-size: 6rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.1;
  color: #ffffff; /* pure white for clarity */

}

.hero-box p {
  font-size: 2rem;
  color: #dcdcdc; /* soft gray for contrast */
  max-width: 800px;
  line-height: 1.6;
  margin-top: 0px;
  padding-top: 0px;
  font-style: italic;

}



/* ======= Section 2: Why Hubsy ======= */
.why-hubsy {
  padding: 2rem 2rem;
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
  height: 80px;
  margin-bottom: 5px;
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
  height: 80px;
  margin-bottom: 1rem;
  color: black;
  filter: brightness(0) saturate(100%); /* turns icon completely black */
}
</style>
