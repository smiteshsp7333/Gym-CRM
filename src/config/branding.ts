/**
 * Centralized Gym Branding Configuration
 * 
 * Replace placeholders like "[GYM NAME]" with the prospect gym's name.
 * Any updates here automatically reflect across the entire app:
 * Navbar, Sidebar, Member Login, Invoice PDFs, Birthday wishes, and WhatsApp followups.
 */

export interface GymBrandingConfig {
  name: string;
  tagline: string;
  shortName: string;
  city: string;
  fullAddress: string;
  phone: string;
  email: string;
  trainerName: string;
  logoDark: string;
  logoLight: string;
  currency: string;
  websiteUrl?: string;
  adminCredentials: {
    username: string;
    email: string;
    password: string;
    pin: string;
  };
}

export const GYM_BRANDING: GymBrandingConfig = {
  name: "[GYM NAME]",
  tagline: "Fitness & Wellness Club",
  shortName: "[GYM NAME]",
  city: "Bengaluru",
  fullAddress: "100 Feet Road, Indiranagar, Bengaluru, Karnataka, India - 560038",
  phone: "+91 98201 12345",
  email: "contact@gymdemo.in",
  trainerName: "Head Coach & Training Team",
  logoDark: "/logo.png",
  logoLight: "/logo-light.png",
  currency: "₹",
  adminCredentials: {
    username: "admin",
    email: "admin@gymdemo.in",
    password: "admin123",
    pin: "0987",
  },
};

