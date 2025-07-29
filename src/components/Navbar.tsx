'use client';

import React, { useMemo } from 'react'; // Removed useState, createContext, useContext as theme is static
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  CssBaseline,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';
// Removed LightModeIcon and DarkModeIcon as theme toggle is removed

// --- Static Theme Definition ---
// The theme is now static (dark mode) as theme changing is removed.
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
    },
  });

// --- Styled Components ---
const NavLinksContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '2rem', // Increased gap for better spacing
  alignItems: 'center',
  marginLeft: 'auto',
  '@media (max-width: 900px)': { // Adjusted breakpoint for tablet/smaller desktops
    display: 'none',
  },
}));

// Enhanced LogoWrapper for gradient, border, and advanced animations
const LogoWrapper = styled(motion.div)(({ theme }) => ({
  position: 'relative', // Needed for pseudo-elements
  // Background gradient (hardcoded for dark mode)
  background: 'linear-gradient(45deg, #2a2a2a, #3a3a3a)',
  color: theme.palette.primary.main, // Still uses theme for primary color
  padding: '0.45rem 1.2rem',
  borderRadius: '16px',
  fontWeight: 700,
  fontSize: '1.6rem',
  letterSpacing: '1.5px',
  // Initial box shadow (hardcoded for dark mode)
  boxShadow: '0 8px 20px rgba(0,0,0,0.6), 0 0 12px rgba(255,255,255,0.18)',
  transition: 'all 0.4s ease-in-out',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden', // Hide overflow for border animation

  // Text shadow/glow (hardcoded for dark mode)
  '& .logo-text': {
    textShadow: '0 0 8px rgba(144, 202, 249, 0.7), 0 0 15px rgba(144, 202, 249, 0.4)',
    transition: 'text-shadow 0.4s ease-in-out',
  },

  // Dynamic border effect using pseudo-element
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '16px',
    padding: '2px', // Border thickness
    background: 'transparent', // Initial transparent background
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    transition: 'background 0.4s ease-in-out',
  },

  '&:hover': {
    transform: 'translateY(-5px) rotate(1deg)',
    // Hover box shadow (hardcoded for dark mode)
    boxShadow: '0 12px 25px rgba(0,0,0,0.7), 0 0 18px rgba(255,255,255,0.25)',
    // Gradient shift on hover (hardcoded for dark mode)
    background: 'linear-gradient(45deg, #3a3a3a, #4a4a4a)',

    '&::before': {
      // Border gradient on hover (hardcoded for dark mode)
      background: 'linear-gradient(45deg, #90CAF9, #BBDEFB)',
    },
    '& .logo-text': {
      // Text shadow on hover (hardcoded for dark mode)
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
  { label: 'Home', href: '#home' }, // Unique hrefs for keys
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '#blog' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  // Theme is now static, no need for mode state or ColorModeContext
  const theme = useMemo(() => getAppTheme(), []);

  return (
    <ThemeProvider theme={theme}> {/* ThemeProvider is necessary for MUI styled components */}
      <CssBaseline /> {/* Apply baseline CSS */}
      <MotionAppBar
        position="sticky"
        elevation={0}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        sx={{
          // Hardcoded dark mode background and border
          background: 'rgba(18, 18, 18, 0.9)',
          backdropFilter: 'blur(15px)',
          paddingY: 1.8,
          borderBottom: '1px solid rgba(60, 60, 60, 0.6)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ maxWidth: '1200px', width: '100%', margin: '0 auto', paddingX: { xs: 2, sm: 3 } }}>
          {/* Logo */}
          <LogoWrapper
            component="a"
            href="#home" // Link to home section
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

          {/* Navigation Links */}
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

          {/* Mobile menu icon */}
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

          {/* Removed Theme Toggle Button and its Box wrapper */}
        </Toolbar>
      </MotionAppBar>
    </ThemeProvider>
  );
}
