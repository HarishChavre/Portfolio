'use client';

import React, { useState, createContext, useMemo, useContext, useEffect, useRef, useCallback } from 'react';
import {
  Typography,
  Box,
  CssBaseline,
  Link, // Using MUI Link for external links
  Button,
  IconButton,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

// Import Material-UI Icons for social media
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import CodeIcon from '@mui/icons-material/Code'; // Using a generic code icon for GitLab

// Import Three.js
import * as THREE from 'three';

// --- Static Theme Definition ---
// The theme is static (dark mode) for this standalone component.
const getAppTheme = () =>
  createTheme({
    palette: {
      mode: 'dark', // Hardcoded to dark mode
      primary: {
        main: '#90CAF9', // Light blue
        light: '#BBDEFB',
        dark: '#64B5F6',
      },
      secondary: {
        main: '#CE93D8', // Light purple
      },
      background: {
        default: '#121212',
        paper: '#1E1E1E',
      },
      text: {
        primary: '#E0E0E0',
        secondary: '#B0B0B0',
      },
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: '#E0E0E0', // Default icon color
            '&:hover': {
              color: '#90CAF9', // Primary color on hover
              backgroundColor: 'rgba(144, 202, 249, 0.1)', // Subtle background on hover
            },
          },
        },
      },
    },
  });

// --- Contact Section Specific Styled Components ---
const ContactSectionWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh', // Full viewport height for the section
  textAlign: 'center',
  padding: theme.spacing(8, 2), // Increased padding
  overflow: 'hidden',
  background: 'linear-gradient(180deg, #1a1a1a 0%, #121212 100%)', // Consistent dark background gradient
}));

const ThreeCanvas = styled('canvas')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  pointerEvents: 'none',
});

const ContentBox = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  maxWidth: '800px', // Content width
  width: '100%',
  margin: '0 auto',
  padding: theme.spacing(6), // More padding
  borderRadius: theme.shape.borderRadius * 3, // More rounded
  background: 'rgba(30, 30, 30, 0.85)', // Hardcoded dark background for content box
  backdropFilter: 'blur(10px)', // Increased blur
  boxShadow: '0 15px 40px rgba(0,0,0,0.8), 0 0 25px rgba(255,255,255,0.15)', // Hardcoded dark shadow
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(4), // Gap between sections within the content box
}));

const ContactInfoItem = styled(motion(Box))(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  color: theme.palette.text.primary,
  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
  fontWeight: 500,
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.light, // Icon color
    fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
  },
}));

const SocialIconsContainer = styled(motion(Box))(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3), // Spacing between icons
  mt: theme.spacing(3),
  mb: theme.spacing(2),
}));

const AnimatedTypography = motion(Typography);
const AnimatedButton = motion(Button);
const AnimatedIconButton = motion(IconButton);

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
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
      damping: 12,
      stiffness: 100,
    },
  },
};

const iconButtonVariants = {
  hover: { scale: 1.2, rotate: 10 },
  tap: { scale: 0.9 },
};

const mailButtonVariants = {
  hover: { scale: 1.05, boxShadow: '0px 0px 8px rgba(144, 202, 249, 0.6)' },
  tap: { scale: 0.95 },
};

// --- Contact Data (from your resume and common platforms) ---
const contactInfo = {
  email: 'harishpchavre@gmail.com',
  phone: '+91-9834017806',
  linkedin: 'https://linkedin.com/in/harish-chavre-470666354',
  github: 'https://github.com/yourusername', // TODO: Replace with your actual GitHub URL
  gitlab: 'https://gitlab.com/yourusername', // TODO: Replace with your actual GitLab URL
};

// --- ContactSection Component ---
export default function ContactSection() {
  const theme = useMemo(() => getAppTheme(), []);

  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  // Three.js setup and animation (consistent with other sections)
  const initThreeJs = useCallback(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

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

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      particles.rotation.x += 0.0005;
      particles.rotation.y += 0.0008;
      renderer.render(scene, camera);
    };

    animate();

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [theme]);

  useEffect(() => {
    initThreeJs();
  }, [initThreeJs]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ContactSectionWrapper>
        <ThreeCanvas ref={canvasRef} />
        <ContentBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} style={{ width: '100%', textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 4,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                textShadow: '0 0 10px rgba(144, 202, 249, 0.4)',
              }}
            >
              Get in Touch
            </Typography>
          </motion.div>

          {/* Contact Information */}
          <ContactInfoItem variants={itemVariants}>
            <EmailIcon />
            <Link href={`mailto:${contactInfo.email}`} color="inherit" sx={{ textDecoration: 'none' }}>
              <Typography variant="body1">{contactInfo.email}</Typography>
            </Link>
          </ContactInfoItem>

          <ContactInfoItem variants={itemVariants}>
            <Typography variant="body1" sx={{ ml: '2.5rem' }}>
              {contactInfo.phone}
            </Typography>
          </ContactInfoItem>

          {/* Social Media Icons */}
          <SocialIconsContainer variants={itemVariants}>
            <AnimatedIconButton
              component={Link}
              href={contactInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              whileHover="hover"
              whileTap="tap"
              variants={iconButtonVariants}
            >
              <LinkedInIcon fontSize="large" />
            </AnimatedIconButton>
            <AnimatedIconButton
              component={Link}
              href={contactInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              whileHover="hover"
              whileTap="tap"
              variants={iconButtonVariants}
            >
              <GitHubIcon fontSize="large" />
            </AnimatedIconButton>
            <AnimatedIconButton
              component={Link}
              href={contactInfo.gitlab}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitLab"
              whileHover="hover"
              whileTap="tap"
              variants={iconButtonVariants}
            >
              <CodeIcon fontSize="large" /> {/* Using CodeIcon for GitLab */}
            </AnimatedIconButton>
          </SocialIconsContainer>

          {/* Mail Me Button */}
          <AnimatedButton
            variant="contained"
            color="primary"
            size="large"
            href={`mailto:${contactInfo.email}`}
            sx={{
              padding: '12px 30px',
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: '10px',
              boxShadow: '0 5px 15px rgba(144, 202, 249, 0.3)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 20px rgba(144, 202, 249, 0.4)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
            variants={mailButtonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Mail Me
          </AnimatedButton>
        </ContentBox>
      </ContactSectionWrapper>
    </ThemeProvider>
  );
}
