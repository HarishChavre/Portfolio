'use client';

import React, { useState, createContext, useMemo, useContext, useEffect, useRef, useCallback } from 'react';
import {
  Typography,
  Box,
  Button,
  CssBaseline,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Corrected '=>' to 'from'
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

// Import Three.js
import * as THREE from 'three';

// --- Simulated Theme Context (for demonstration purposes) ---
// This context and theme setup are crucial for the HeroSection's theming.
// In a real Next.js app, these would typically be in a separate, shared file.
export const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: 'dark' });

const getAppTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#90CAF9' : '#1976D2', // Light blue for dark, standard blue for light
        light: mode === 'dark' ? '#BBDEFB' : '#42A5F5',
        dark: mode === 'dark' ? '#64B5F6' : '#1565C0',
      },
      secondary: {
        main: mode === 'dark' ? '#CE93D8' : '#9C27B0', // Light purple for dark, standard purple for light
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#F5F5F5',
        paper: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#E0E0E0' : '#212121',
        secondary: mode === 'dark' ? '#B0B0B0' : '#757575',
      },
    },
    typography: {
      fontFamily: 'Inter, sans-serif', // Using Inter font
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    },
  });

// --- Hero Section Specific Styled Components ---
const HeroSectionWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh', // Full viewport height for standalone hero
  textAlign: 'center',
  padding: theme.spacing(4, 2),
  overflow: 'hidden', // Ensure Three.js canvas doesn't cause scrollbars
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(180deg, #121212 0%, #1a1a1a 100%)'
    : 'linear-gradient(180deg, #F5F5F5 0%, #E0E0E0 100%)',
}));

const ThreeCanvas = styled('canvas')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0, // Behind content
  pointerEvents: 'none', // Allow clicks to pass through to content
});

const ContentBox = styled(motion(Box))(({ theme }) => ({
  position: 'relative',
  zIndex: 1, // Above Three.js canvas
  maxWidth: '900px',
  margin: '0 auto',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  background: theme.palette.mode === 'dark'
    ? 'rgba(30, 30, 30, 0.7)'
    : 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(8px)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 10px 30px rgba(0,0,0,0.7), 0 0 20px rgba(255,255,255,0.1)'
    : '0 10px 30px rgba(0,0,0,0.15), 0 0 20px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
}));

const AnimatedTypography = motion(Typography);
const AnimatedButton = motion(Button);

// Framer Motion Variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Delay between child animations
      delayChildren: 0.5, // Delay before first child starts
    },
  },
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
    },
  },
};

const buttonVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
    },
  },
};

// --- HeroSection Component ---
export default function HeroSection() {
  // Access mode from context
  const { mode } = useContext(ColorModeContext);
  // Create theme instance within HeroSection
  const theme = useMemo(() => getAppTheme(mode), [mode]);

  const canvasRef = useRef(null);
  const animationFrameId = useRef(null); // To store the animation frame ID for cleanup

  // Three.js setup and animation
  const initThreeJs = useCallback(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true }); // alpha: true for transparent background
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Particles
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    // Use theme colors for particles
    const color1 = new THREE.Color(theme.palette.primary.main);
    const color2 = new THREE.Color(theme.palette.primary.light);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = (Math.random() - 0.5) * 200;
      positions[i + 2] = (Math.random() - 0.5) * 200;

      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 5;

    // Animation Loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      particles.rotation.x += 0.0005;
      particles.rotation.y += 0.0008;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [theme]); // Re-initialize if theme (via mode) changes

  useEffect(() => {
    initThreeJs();
  }, [initThreeJs]);

  return (
    // ThemeProvider is necessary to provide the 'theme' object to styled components and MUI components
    // In a real app, this ThemeProvider would usually wrap your entire app component.
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Apply baseline CSS for consistent styling */}
      <HeroSectionWrapper>
        <ThreeCanvas ref={canvasRef} />
        <ContentBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatedTypography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              color: 'primary.main',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              lineHeight: 1.1,
              textShadow: mode === 'dark' ? '0 0 15px rgba(144, 202, 249, 0.5)' : '0 0 10px rgba(25, 118, 210, 0.3)',
            }}
            variants={itemVariants}
          >
            Harish Chavre
          </AnimatedTypography>
          <AnimatedTypography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              mt: 1,
            }}
            variants={itemVariants}
          >
            Full Stack Developer
          </AnimatedTypography>
          <AnimatedTypography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: '600px',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              mt: 2,
              lineHeight: 1.6,
            }}
            variants={itemVariants}
          >
            Crafting robust and intuitive web experiences with a passion for clean code and innovative solutions.
            Specializing in React.js, Node.js, and database management.
          </AnimatedTypography>
          <Box sx={{ mt: 4, display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            <AnimatedButton
              variant="contained"
              color="primary"
              size="large"
              href="#" // Replace with actual link
              sx={{
                padding: '12px 30px',
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '10px',
                boxShadow: mode === 'dark' ? '0 5px 15px rgba(144, 202, 249, 0.3)' : '0 5px 15px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: mode === 'dark' ? '0 8px 20px rgba(144, 202, 249, 0.4)' : '0 8px 20px rgba(25, 118, 210, 0.4)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
            </AnimatedButton>
            <AnimatedButton
              variant="outlined"
              color="primary"
              size="large"
              href="/HARISHCHAVRE_RESUME.pdf" // Link to the resume PDF
              target="_blank" // Open in a new tab
              rel="noopener noreferrer" // Security best practice for target="_blank"
              sx={{
                padding: '12px 30px',
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: '10px',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: theme.palette.mode === 'dark' ? '#121212' : '#FFFFFF',
                  transform: 'translateY(-3px)',
                  boxShadow: mode === 'dark' ? '0 5px 15px rgba(144, 202, 249, 0.2)' : '0 5px 15px rgba(25, 118, 210, 0.2)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
              variants={buttonVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Resume
            </AnimatedButton>
          </Box>
        </ContentBox>
      </HeroSectionWrapper>
    </ThemeProvider>
  );
}
