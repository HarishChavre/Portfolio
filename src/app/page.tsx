'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Skills  from './Skills/page';
import  Project from './projects/page';
import About from './about/page';
import  Contact from './contact/page';
import  Blog from './blog/page';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Skills/>
      <Project/>
      <About/>
      <Contact/>
      <Blog/>
    </>
  );
}
