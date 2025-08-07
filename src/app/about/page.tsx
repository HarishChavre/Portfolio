// app/about/page.tsx
'use client';

import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  CssBaseline,
  Divider,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const getAppTheme = () =>
  createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90CAF9',
        light: '#BBDEFB',
        dark: '#64B5F6',
      },
      secondary: {
        main: '#CE93D8',
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
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: 'rgba(255, 255, 255, 0.1)',
            margin: '2rem 0',
          },
        },
      },
    },
  });

const AboutSectionWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
  padding: theme.spacing(8, 2),
  overflow: 'hidden',
  background: 'linear-gradient(180deg, #1a1a1a 0%, #121212 100%)',
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

const MotionTypography = motion(Typography);

const ContentBox = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  maxWidth: '900px',
  width: '100%',
  margin: '0 auto',
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 3,
  background: 'rgba(30, 30, 30, 0.85)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 15px 40px rgba(0,0,0,0.8), 0 0 25px rgba(255,255,255,0.15)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  textAlign: 'left',
}));

const SectionTitle = styled(MotionTypography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  fontSize: '2.2rem',
  textShadow: '0 0 8px rgba(144, 202, 249, 0.3)',
  width: '100%',
  textAlign: 'left',
}));

const SectionText = styled(MotionTypography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '1.05rem',
  lineHeight: 1.7,
  marginBottom: theme.spacing(2),
  width: '100%',
}));

const ListItemText = styled(MotionTypography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '1rem',
  lineHeight: 1.6,
  marginBottom: theme.spacing(1),
  width: '100%',
  '&::before': {
    content: '"• "',
    color: theme.palette.primary.light,
    fontWeight: 'bold',
    display: 'inline-block',
    width: '1em',
    marginLeft: '-1em',
  },
}));

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
      type: 'spring',
      damping: 12,
      stiffness: 100,
    },
  },
};

export default function About() {
  const theme = useMemo(() => getAppTheme(), []);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

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
    const cleanup = initThreeJs();
    return cleanup;
  }, [initThreeJs]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AboutSectionWrapper>
        <ThreeCanvas ref={canvasRef} />
        <ContentBox variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} style={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="h3" component="h2" sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 4,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              textShadow: '0 0 10px rgba(144, 202, 249, 0.4)',
            }}>
              About Me
            </Typography>
          </motion.div>

          <SectionTitle variants={itemVariants}>Who I Am</SectionTitle>
          <SectionText variants={itemVariants}>
            Hi, I'm Harish Chavre, a passionate Full Stack Developer based in Nagpur, Maharashtra, India. With a Master's in Computer Application, I thrive on bringing innovative ideas to life through code. I specialize in crafting robust, scalable, and intuitive web applications that deliver exceptional user experiences.
          </SectionText>
          <Divider sx={{ width: '100%' }} />

          <SectionTitle variants={itemVariants}>What I Do</SectionTitle>
          <SectionText variants={itemVariants}>
            I build dynamic UIs with React.js and MUI, powerful backend APIs with Node.js and Express.js, and manage data using MongoDB and MySQL. I practice DevOps with Docker, Nginx, and GitLab CI/CD, always aiming for clean, maintainable code.
          </SectionText>
          <Divider sx={{ width: '100%' }} />

          <SectionTitle variants={itemVariants}>My Experience</SectionTitle>
          <SectionText variants={itemVariants} component="div">
            <strong>Full Stack Developer Intern, Clustor Computing</strong> (Jan-Jun 2025)
            <ListItemText variants={itemVariants}>Built full-stack sites like Curocity Tech using React, Node, MySQL.</ListItemText>
            <ListItemText variants={itemVariants}>Created a paper submission system with secure forms and REST APIs.</ListItemText>
            <ListItemText variants={itemVariants}>Managed VPS deployment using Docker, GitLab CI/CD, and Nginx.</ListItemText>
          </SectionText>

          <SectionText variants={itemVariants} component="div">
            <strong>Web Developer Intern, Blastoserve Scientific</strong> (Jan-Apr 2023)
            <ListItemText variants={itemVariants}>Built a hospital dashboard system with React and Tailwind CSS.</ListItemText>
            <ListItemText variants={itemVariants}>Integrated auth using Context API and protected routes.</ListItemText>
            <ListItemText variants={itemVariants}>Designed reusable components using MUI.</ListItemText>
          </SectionText>

          <SectionText variants={itemVariants} component="div">
            <strong>Open Source Contributions (GSoC & Debian)</strong>
            <ListItemText variants={itemVariants}>Enhanced Debian Med CI pipelines and autopkgtest scripts.</ListItemText>
            <ListItemText variants={itemVariants}>Maintained node packages (e.g., node-zrender, node-sqlite).</ListItemText>
          </SectionText>
          <Divider sx={{ width: '100%' }} />

          <SectionTitle variants={itemVariants}>My Education</SectionTitle>
          <SectionText variants={itemVariants} component="div">
            <strong>Master in Computer Application</strong>
            <ListItemText variants={itemVariants}>G H Raisoni University, Nagpur</ListItemText>
            <ListItemText variants={itemVariants}>CGPA: 7.1/10.0</ListItemText>
            <ListItemText variants={itemVariants}>Graduation: July 2025</ListItemText>
          </SectionText>
          <Divider sx={{ width: '100%' }} />

          <SectionTitle variants={itemVariants}>Community & Philosophy</SectionTitle>
          <SectionText variants={itemVariants}>
            Active in FOSS. Presented at DebConf21. Believes in learning, collaboration, and making tech impactful.
          </SectionText>
        </ContentBox>
      </AboutSectionWrapper>
    </ThemeProvider>
  );
}