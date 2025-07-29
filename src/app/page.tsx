'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Skills  from '../app/Skills/Skills';
import  Project from '../app/projects/Project';
import About from '../app/about/About';
import  Contact from '../app/contact/Contact';
import  Blog from '../app/blog/Blog';

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
