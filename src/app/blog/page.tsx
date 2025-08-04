'use client';

import React, { useState, createContext, useMemo, useContext, useEffect, useRef, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  CssBaseline,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea, // For clickable cards
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';

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
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px', // Consistent rounded corners for cards
          },
        },
      },
    },
  });

// --- Navbar Styled Components (replicated for this page) ---
const NavLinksContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '2rem',
  alignItems: 'center',
  marginLeft: 'auto',
  '@media (max-width: 900px)': {
    display: 'none',
  },
}));

const LogoWrapper = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(45deg, #2a2a2a, #3a3a3a)',
  color: theme.palette.primary.main,
  padding: '0.45rem 1.2rem',
  borderRadius: '16px',
  fontWeight: 700,
  fontSize: '1.6rem',
  letterSpacing: '1.5px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.6), 0 0 12px rgba(255,255,255,0.18)',
  transition: 'all 0.4s ease-in-out',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',

  '& .logo-text': {
    textShadow: '0 0 8px rgba(144, 202, 249, 0.7), 0 0 15px rgba(144, 202, 249, 0.4)',
    transition: 'text-shadow 0.4s ease-in-out',
  },

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '16px',
    padding: '2px',
    background: 'transparent',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    transition: 'background 0.4s ease-in-out',
  },

  '&:hover': {
    transform: 'translateY(-5px) rotate(1deg)',
    boxShadow: '0 12px 25px rgba(0,0,0,0.7), 0 0 18px rgba(255,255,255,0.25)',
    background: 'linear-gradient(45deg, #3a3a3a, #4a4a4a)',

    '&::before': {
      background: 'linear-gradient(45deg, #90CAF9, #BBDEFB)',
    },
    '& .logo-text': {
      textShadow: '0 0 12px rgba(144, 202, 249, 0.9), 0 0 20px rgba(144, 202, 249, 0.6)',
    },
  },
}));

const NavButton = styled(motion(Button))(({ theme }) => ({
  position: 'relative',
  fontWeight: 600,
  fontSize: '1.05rem',
  color: theme.palette.text.secondary,
  padding: '0.5rem 0.8rem',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '0%',
    height: '2px',
    bottom: '-5px',
    left: '0',
    backgroundColor: theme.palette.primary.main,
    transition: 'width 0.3s ease-in-out',
  },
  '&:hover::after': {
    width: '100%',
  },
}));

const MotionAppBar = motion(AppBar);

const navItems = [
  { label: 'Home', href: '/' }, // Assuming '/' is your home page
  { label: 'Skills', href: '/skills' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' }, // This page
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// --- Navbar Component (replicated for this page) ---
function Navbar() {
  const theme = useMemo(() => getAppTheme(), []); // Get static theme

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MotionAppBar
        position="sticky"
        elevation={0}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        sx={{
          background: 'rgba(18, 18, 18, 0.9)',
          backdropFilter: 'blur(15px)',
          paddingY: 1.8,
          borderBottom: '1px solid rgba(60, 60, 60, 0.6)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ maxWidth: '1200px', width: '100%', margin: '0 auto', paddingX: { xs: 2, sm: 3 } }}>
          <LogoWrapper
            component="a"
            href="/" // Link to home
            sx={{ textDecoration: 'none' }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <Typography variant="h6" component="span" className="logo-text" sx={{ fontWeight: 'inherit', color: 'inherit' }}>
              {'<HC>'}
            </Typography>
          </LogoWrapper>

          <NavLinksContainer>
            {navItems.map((item) => (
              <NavButton
                key={item.href}
                href={item.href}
                color="inherit"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
              >
                {item.label}
              </NavButton>
            ))}
          </NavLinksContainer>

          <Box sx={{ display: { xs: 'block', md: 'none' }, marginLeft: 'auto' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </MotionAppBar>
    </ThemeProvider>
  );
}

// --- Blog Page Specific Styled Components ---
const BlogPageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: 'calc(100vh - 64px)', // Full viewport height minus AppBar height
  textAlign: 'center',
  padding: theme.spacing(8, 2),
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
  maxWidth: '1200px', // Wider content box for blog cards
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
  gap: theme.spacing(4),
}));

const StyledBlogCard = styled(motion(Card))(({ theme }) => ({
  background: theme.palette.background.paper,
  boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
  transition: 'all 0.3s ease-in-out',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer', // Indicate clickable
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 15px 40px rgba(0,0,0,0.7), 0 0 20px rgba(144, 202, 249, 0.3)',
  },
}));

const CardImage = styled(CardMedia)({
  height: 200, // Fixed height for images
  objectFit: 'cover',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
});

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 80, opacity: 0 },
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

// --- Sample Blog Data ---
const blogPosts = [
  {
    id: 1,
    title: 'Mastering React Hooks: A Deep Dive',
    description: 'Explore the power of React Hooks, from useState and useEffect to custom hooks. Learn how they simplify state management and side effects in functional components.',
    image: 'https://placehold.co/600x400/FFD700/000000?text=React+Hooks', // Yellow
    slug: 'mastering-react-hooks', // Unique slug for navigation
  },
  {
    id: 2,
    title: 'Building RESTful APIs with Node.js and Express',
    description: 'A comprehensive guide to creating robust and scalable RESTful APIs using Node.js and the Express framework. Covers routing, middleware, and database integration.',
    image: 'https://placehold.co/600x400/32CD32/FFFFFF?text=Node.js+API', // Lime Green
    slug: 'building-restful-apis',
  },
  {
    id: 3,
    title: 'Dockerizing Your Full Stack Application',
    description: 'Learn how to containerize your React and Node.js applications using Docker. Streamline your development workflow and simplify deployments with Docker Compose.',
    image: 'https://placehold.co/600x400/1E90FF/FFFFFF?text=Docker+Fullstack', // Dodger Blue
    slug: 'dockerizing-fullstack-app',
  },
  {
    id: 4,
    title: 'Demystifying MongoDB: A NoSQL Database Guide',
    description: 'Understand the fundamentals of MongoDB, a popular NoSQL database. Explore its flexible schema, document-oriented nature, and common use cases for modern web apps.',
    image: 'https://placehold.co/600x400/FF4500/FFFFFF?text=MongoDB+NoSQL', // Orange Red
    slug: 'demystifying-mongodb',
  },
  {
    id: 5,
    title: 'CI/CD with GitLab: Automating Your Deployment Pipeline',
    description: 'Set up a continuous integration and continuous delivery pipeline using GitLab CI/CD. Automate testing, building, and deploying your projects efficiently.',
    image: 'https://placehold.co/600x400/9400D3/FFFFFF?text=GitLab+CI/CD', // Dark Violet
    slug: 'ci-cd-gitlab',
  },
];

// --- BlogPage Component ---
export default function BlogPage() {
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

  // Function to simulate opening a blog post
  const handleCardClick = (slug) => {
    // In a real Next.js app, you would use router.push(`/blog/${slug}`);
    // For this environment, we'll simulate a navigation or show a message.
    console.log(`Navigating to blog post: /blog/${slug}`);
    // You could also open a new tab with a placeholder URL if desired:
    // window.open(`/blog/${slug}`, '_blank');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: theme.palette.background.default }}>
        <Navbar /> {/* Integrated Navbar component */}
        <BlogPageWrapper>
          <ThreeCanvas ref={canvasRef} />
          <ContentBox
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} style={{ width: '100%', textAlign: 'center' }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 4,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  textShadow: '0 0 10px rgba(144, 202, 249, 0.4)',
                }}
              >
                My Blog
              </Typography>
            </motion.div>

            <Grid container spacing={4} justifyContent="center">
              {blogPosts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post.id}> {/* 3 columns on desktop, 2 on tablet, 1 on mobile */}
                  <StyledBlogCard
                    variants={itemVariants}
                    onClick={() => handleCardClick(post.slug)} // Make the whole card clickable
                  >
                    <CardActionArea> {/* Makes the card content clickable */}
                      <CardImage
                        image={post.image}
                        title={post.title}
                      />
                      {/* TODO: Replace the 'image' prop above with your actual blog post image URL. */}
                      {/* Example: image="/images/blog/my-blog-post-1.jpg" */}

                      <CardContentStyled>
                        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {post.description}
                        </Typography>
                      </CardContentStyled>
                    </CardActionArea>
                  </StyledBlogCard>
                </Grid>
              ))}
            </Grid>
          </ContentBox>
        </BlogPageWrapper>
      </Box>
    </ThemeProvider>
  );
}
