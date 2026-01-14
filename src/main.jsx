import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./date-picker-fix.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000",
    },
  },
  typography: {
    fontFamily: "'Josefin Sans', sans-serif",
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "rgba(255, 255, 255, 0.72)",
          "&.Mui-focused": {
            color: "#fff",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: "rgba(17, 17, 17, 0.35)",
          borderRadius: theme.shape.borderRadius * 2,
          "& fieldset": {
            borderColor: "rgba(255, 255, 255, 0.12)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(255, 255, 255, 0.18)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#fff",
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.14)",
          },
        }),
        input: {
          color: "#fff",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "rgba(255, 255, 255, 0.72)",
          "&.Mui-focused": {
            color: "#fff",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "input:-webkit-autofill": {
          WebkitTextFillColor: "#fff",
          caretColor: "#fff",
          WebkitBoxShadow: "0 0 0 1000px rgba(17, 17, 17, 0.35) inset",
          transition: "background-color 9999s ease-in-out 0s",
        },
        "input:-webkit-autofill:hover": {
          WebkitTextFillColor: "#fff",
          caretColor: "#fff",
          WebkitBoxShadow: "0 0 0 1000px rgba(17, 17, 17, 0.35) inset",
        },
        "input:-webkit-autofill:focus": {
          WebkitTextFillColor: "#fff",
          caretColor: "#fff",
          WebkitBoxShadow: "0 0 0 1000px rgba(17, 17, 17, 0.35) inset",
        },
        "input:-moz-autofill": {
          boxShadow: "0 0 0 1000px rgba(17, 17, 17, 0.35) inset",
          WebkitTextFillColor: "#fff",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
