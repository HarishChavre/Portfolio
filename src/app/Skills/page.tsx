'use client';

import React, { useState, createContext, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Typography,
  Box,
  CssBaseline,
  Grid,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

// Import Three.js for the background
import * as THREE from 'three';

// --- Theme Context and Setup (unchanged from previous version) ---
export const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: 'dark' });

const getAppTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#90CAF9' : '#1976D2',
        light: mode === 'dark' ? '#BBDEFB' : '#42A5F5',
        dark: mode === 'dark' ? '#64B5F6' : '#1565C0',
      },
      secondary: {
        main: mode === 'dark' ? '#CE93D8' : '#9C27B0',
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
      fontFamily: 'Inter, sans-serif',
    },
  });

// --- Skill Section Specific Styled Components ---
const SkillSectionWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
  padding: theme.spacing(8, 2),
  overflow: 'hidden',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(180deg, #1a1a1a 0%, #121212 100%)'
    : 'linear-gradient(180deg, #E0E0E0 0%, #F5F5F5 100%)',
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

const ContentBox = styled(motion(Box))(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  maxWidth: '1200px',
  width: '100%',
  margin: '0 auto',
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 3,
  background: theme.palette.mode === 'dark'
    ? 'rgba(30, 30, 30, 0.85)'
    : 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 15px 40px rgba(0,0,0,0.8), 0 0 25px rgba(255,255,255,0.15)'
    : '0 15px 40px rgba(0,0,0,0.2), 0 0 25px rgba(0,0,0,0.08)',
}));

const SkillCard = styled(motion(Box))(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? theme.palette.background.paper
    : theme.palette.grey[50],
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 15px rgba(0,0,0,0.5)'
    : '0 4px 15px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  cursor: 'default',
  transition: 'all 0.3s ease-in-out',
  // FIX: Corrected template literal syntax for border
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(90, 90, 90, 0.3)' : 'rgba(200, 200, 200, 0.5)'}`,
  '&:hover': {
    transform: 'translateY(-5px) scale(1.02)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 25px rgba(0,0,0,0.6), 0 0 15px rgba(144, 202, 249, 0.2)'
      : '0 8px 25px rgba(0,0,0,0.15), 0 0 15px rgba(25, 118, 210, 0.1)',
  },
  minHeight: 180, // Ensure a consistent card height
}));

const SkillIconWrapper = styled(motion(Box))(({ theme }) => ({
  width: 80, // Larger icon size
  height: 80,
  borderRadius: '50%',
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255,255,255,0.05)'
    : 'rgba(0,0,0,0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: theme.palette.mode === 'dark'
    ? 'inset 0 0 10px rgba(255,255,255,0.1)'
    : 'inset 0 0 10px rgba(0,0,0,0.1)',
  // FIX: Corrected template literal syntax for border
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.2)'}`,
}));

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

// Continuous rotation animation for the icons
const rotate = {
  rotate: 360,
  transition: {
    repeat: Infinity,
    ease: "linear",
    duration: 15,
  }
};

// --- Skill Data with Public Folder Paths ---
// The paths are relative to the public folder.
const skills = [
  { name: 'JavaScript', icon: '/js.png' },
  { name: 'React.js', icon: '/react.png' },
  { name: 'Node.js', icon: '/nodejs.png' },
  { name: 'C++', icon: '/C++.png' },
  { name: 'C', icon: '/c.png' },
  { name: 'Java', icon: '/java.png' },
  { name: 'MySQL', icon: '/mysql.png' },
  { name: 'Docker', icon: '/docker.png' },
  { name: 'Nginx', icon: '/nginx.png' },
  { name: 'Linux', icon: '/linux.png' },
  { name: 'Debian', icon: '/debian.png' },
  { name: 'DevOps', icon: '/devops.png' },
  { name: 'Git', icon: '/github.png' }, // Assuming github.png is for Git
  { name: 'GitLab CI/CD', icon: '/gitlab.png' },
];

// --- SkillSection Component ---
export default function SkillSection() {
  const [mode, setMode] = useState('dark');
  const theme = useMemo(() => getAppTheme(mode), [mode]);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  // Three.js background animation setup
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
      <SkillSectionWrapper>
        <ThreeCanvas ref={canvasRef} />
        <ContentBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 6,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                textShadow: theme.palette.mode === 'dark' ? '0 0 10px rgba(144, 202, 249, 0.4)' : '0 0 8px rgba(25, 118, 210, 0.2)',
              }}
            >
              Technologies I Work With
            </Typography>
          </motion.div>

          <Grid container spacing={4} justifyContent="center">
            {skills.map((skill) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={skill.name}>
                <SkillCard variants={itemVariants}>
                  <SkillIconWrapper animate={rotate}>
                    <img
                      src={skill.icon}
                      alt={`${skill.name} icon`}
                      style={{ width: '70%', height: '70%', objectFit: 'contain' }}
                    />
                  </SkillIconWrapper>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      textAlign: 'center',
                    }}
                  >
                    {skill.name}
                  </Typography>
                </SkillCard>
              </Grid>
            ))}
          </Grid>
        </ContentBox>
      </SkillSectionWrapper>
    </ThemeProvider>
  );
}
