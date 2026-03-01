/**
 * Theme Constants
 * Centralized styling, spacing, colors, and standard patterns for the entire application
 * Follow these standards across all components for consistency
 */

// Colors
export const COLORS = {
  primary: "#fff",
  secondary: "#bbb",
  dark: "#111",
  darker: "#000",
  border: "rgba(255,255,255,0.12)",
  borderLight: "rgba(255,255,255,0.18)",
  borderHeavy: "rgba(255,255,255,0.24)",
  bgDark: "rgba(17, 17, 17, 0.35)",
  bgDarker: "rgba(17, 17, 17, 0.5)",
  bgLight: "rgba(255,255,255,0.04)",
  bgLighter: "rgba(255,255,255,0.08)",
  textOpacity: "rgba(255,255,255,0.7)",
  textMuted: "rgba(255,255,255,0.5)",
  success: "#4caf50",
  error: "#f44336",
  warning: "#ff9800",
};

// Spacing
export const SPACING = {
  xs: 0.5,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  xxl: 6,
};

// Breakpoints (responsive)
export const BREAKPOINTS = {
  xs: "max-width: 480px",
  sm: "max-width: 768px",
  md: "max-width: 1024px",
  lg: "max-width: 1280px",
  xl: "max-width: 1536px",
};

// Standard Field Styling
export const FIELD_SX = {
  "& .MuiInputBase-root": {
    height: 40,
  },
  "& .MuiOutlinedInput-root": {
    paddingRight: "8px",
    color: "#fff",
    bgcolor: COLORS.bgDark,
    borderRadius: 2,
    "& fieldset": {
      borderColor: COLORS.border,
    },
    "&:hover fieldset": {
      borderColor: COLORS.borderLight,
    },
    "&.Mui-focused fieldset": {
      borderColor: "#fff",
      boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.14)",
    },
  },
  "& input": {
    height: "40px",
    padding: "0 14px",
    boxSizing: "border-box",
  },
  "& input[type='date']": {
    paddingRight: "14px",
  },
  "& .MuiSvgIcon-root": {
    color: "rgba(255,255,255,0.85)",
  },
  "& input:-webkit-autofill": {
    WebkitTextFillColor: "#fff",
    caretColor: "#fff",
    WebkitBoxShadow: "0 0 0 1000px rgba(17, 17, 17, 0.35) inset",
    transition: "background-color 9999s ease-in-out 0s",
  },
};

// Label Props
export const LABEL_PROPS = {
  sx: { color: COLORS.textOpacity },
};

// Standard Button Styling
export const BUTTON_HOVER = {
  transition: "all 0.2s ease",
  "&:hover": {
    bgcolor: COLORS.bgLighter,
    borderColor: COLORS.borderLight,
    transform: "translateY(-1px)",
  },
  "&:active": {
    transform: "translateY(0px) scale(0.98)",
  },
};

// Standard Loading Spinner
export const SPINNER_SX = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "60vh",
};

// Standard Container Styling
export const CONTAINER_SX = {
  bgcolor: COLORS.bgLight,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 4,
  p: { xs: 2, md: 3 },
  backdropFilter: "blur(8px)",
};

// Standard Card Styling
export const CARD_SX = {
  bgcolor: COLORS.bgLight,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 2,
  p: 2,
  color: "#fff",
  ...BUTTON_HOVER,
};

// Standard Dialog Styling
export const DIALOG_PAPER_SX = {
  bgcolor: "rgba(15, 15, 15, 0.92)",
  border: `1px solid ${COLORS.borderLight}`,
  borderRadius: 3,
  boxShadow: "0 20px 70px rgba(0,0,0,0.65)",
  backdropFilter: "blur(14px)",
  color: "#fff",
};

// Standard NavBar Styling
export const NAVBAR_SX = {
  background: "rgba(0,0,0,0.65)",
  backdropFilter: "blur(10px)",
};

// Loading States
export const LOADING_STATE = {
  initial: "initial",
  loading: "loading",
  success: "success",
  error: "error",
};

// Standard Sizes
export const SIZES = {
  icon: {
    sm: 18,
    md: 24,
    lg: 32,
  },
  avatar: {
    sm: 32,
    md: 40,
    lg: 56,
  },
};

// Standard Transitions
export const TRANSITIONS = {
  fast: "150ms ease",
  normal: "250ms ease",
  slow: "350ms ease",
};
