'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Skills  from './skills/page';
import  Project from './projects/page';
import  Contact from './contact/page';
import Link from 'next/link'

export default function HomePage() {
  return (
    <>               
      <Navbar />
      <HeroSection />
      <Skills/>
      <Project/>
        <Contact/>


      {/* Navigation Links to Pages */}
      <nav >
        <Link href="/about"></Link>
        <Link href="/blog"></Link>
      </nav>

    </>
  );
}
