'use client';

import React, { useState, createContext, useMemo, useContext, useEffect, useRef, useCallback } from 'react';
import {
  Typography,
  Box,
  CssBaseline,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

// Import Three.js
import * as THREE from 'three';

// --- Static Theme Definition ---
// The theme is now static (dark mode) as theme changing is removed.
// This theme is necessary for MUI components and styled components within HeroSection.
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
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px', // Consistent rounded corners for cards
          },
        },
      },
    },
  });

// --- Project Section Specific Styled Components ---
const ProjectSectionWrapper = styled(Box)(({ theme }) => ({
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

const ContentBox = styled(motion.div)(({ theme }) => ({ // Changed to motion.div for animation
  position: 'relative',
  zIndex: 1,
  maxWidth: '1400px', // Wider content box for more projects
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
  gap: theme.spacing(4), // Increased gap between elements
}));

const StyledCard = styled(motion(Card))(({ theme }) => ({
  background: theme.palette.background.paper,
  boxShadow: '0 8px 25px rgba(0,0,0,0.5)', // Initial shadow for cards
  transition: 'all 0.3s ease-in-out',
  height: '100%', // Ensure cards in a row have same height
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)', // More pronounced lift and scale on hover
    boxShadow: '0 15px 40px rgba(0,0,0,0.7), 0 0 20px rgba(144, 202, 249, 0.3)', // Glow effect on hover
  },
}));

const CardImage = styled(CardMedia)({
  height: 200, // Fixed height for images
  objectFit: 'cover', // Ensure images cover the area well
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
});

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  flexGrow: 1, // Allows content to take available space
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between', // Pushes actions to bottom
}));

const CardActionsStyled = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  justifyContent: 'flex-end', // Align buttons to the right
  gap: theme.spacing(2),
}));


// --- Framer Motion Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Stagger for project cards
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 80, opacity: 0 }, // More pronounced initial hidden state
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

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: '0px 0px 8px rgba(144, 202, 249, 0.6)' },
  tap: { scale: 0.95 },
};

// --- Project Data ---
const projects = [
  {
    id: 1,
    title: 'Curocity Tech Website',
    description: 'Developed and deployed a full-stack website using React.js, Node.js, and MySQL. Implemented secure form handling and integrated REST APIs for seamless data flow. Managed Dockerized deployments with Nginx and GitLab CI/CD on a VPS server.',
    image: 'https://placehold.co/600x400/3498db/FFFFFF?text=Curocity+Tech', // Placeholder image
    projectLink: '#', // Placeholder link
    codeLink: '#', // Placeholder link
  },
  {
    id: 2,
    title: 'Hospital Management System',
    description: 'Built a comprehensive hospital management system with role-based dashboards for patients, doctors, and admins using React.js and Material UI. Ensured dynamic routing and secure user authentication using context API and route guards.',
    image: 'https://placehold.co/600x400/2ecc71/FFFFFF?text=Hospital+System', // Placeholder image
    projectLink: '#',
    codeLink: '#',
  },
  {
    id: 3,
    title: 'Farmwise - Smart Agriculture Dashboard',
    description: 'Developed a smart agriculture dashboard with React.js, integrating ML Weather APIs for crop disease detection, yield prediction, and forecasting. Visualized insights using custom charts and responsive layouts with Tailwind CSS.',
    image: 'https://placehold.co/600x400/e67e22/FFFFFF?text=Farmwise', // Placeholder image
    projectLink: '#',
    codeLink: '#',
  },
  {
    id: 4,
    title: 'KnowFood - Nutrition Info App',
    description: 'Created a nutrition insight application using React.js and third-party APIs to display search-based food data. Features include macro/micro-nutrient charts, filtering options, and a responsive design for various devices.',
    image: 'https://placehold.co/600x400/9b59b6/FFFFFF?text=KnowFood+App', // Placeholder image
    projectLink: '#',
    codeLink: '#',
  },
  {
    id: 5,
    title: 'Research Paper Submission System',
    description: 'Engineered a robust research paper submission system with secure form handling and REST API integration. Focused on a streamlined user experience for submissions and administrative review processes.',
    image: 'https://placehold.co/600x400/f1c40f/000000?text=Research+System', // Placeholder image
    projectLink: '#',
    codeLink: '#',
  },
];

// --- ProjectSection Component ---
export default function ProjectSection() {
  // Theme is static (dark mode)
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
      <ProjectSectionWrapper>
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
                mb: 4,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                textShadow: '0 0 10px rgba(144, 202, 249, 0.4)', // Hardcoded dark mode text shadow
              }}
            >
              My Projects
            </Typography>
          </motion.div>

          <Grid container spacing={4} justifyContent="center">
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={6} lg={6} key={project.id}> {/* Adjusted breakpoints for 2 columns */}
                <StyledCard variants={itemVariants}>
                  <CardImage
                    image={project.image}
                    title={project.title}
                  />
                  {/* TODO: Replace the 'image' prop above with your actual project image URL. */}
                  {/* Example: image="/images/my-project-screenshot-1.jpg" */}

                  <CardContentStyled>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {project.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                      {project.description}
                    </Typography>
                  </CardContentStyled>

                  <CardActionsStyled>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      component={motion.a}
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                    >
                      View Project
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      href={project.codeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      component={motion.a}
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                    >
                      View Code
                    </Button>
                  </CardActionsStyled>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </ContentBox>
      </ProjectSectionWrapper>
    </ThemeProvider>
  );
}
