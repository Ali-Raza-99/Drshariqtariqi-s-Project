import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import bgImage from "../../assets/5.png";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../firebase/firestore";
import { firebaseErrorMessage } from "../../utils/firebaseErrorMessage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setSubmitError("");
    setSubmitting(true);
    try {
      const user = await login(email, password);
      try {
        const profile = await getUserProfile(user?.uid);
        if (profile?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setSubmitError(firebaseErrorMessage(err, "Login failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#0b0b0b",
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: { xs: "center", md: "flex-end" },
        px: { xs: 3.5, sm: 5.5, md: 11 },
      }}
    >
      {/* Login Card */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 340,
          ml: { xs: 0, md: 0 },
          mr: { xs: 0, md: "120px" },
          bgcolor: "rgba(15, 15, 15, 0.32)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          borderRadius: 3,
          boxShadow: "0 8px 30px rgba(0,0,0,.75)",
          backdropFilter: "blur(14px)",
          px: { xs: 2.5, sm: 3 },
          py: { xs: 3, sm: 3.5 },
          color: "#fff",

          "& input:-webkit-autofill": {
            WebkitTextFillColor: "#fff",
            caretColor: "#fff",
            WebkitBoxShadow: "0 0 0 1000px rgba(17, 17, 17, 0.35) inset",
            transition: "background-color 9999s ease-in-out 0s",
          },
          "& input:-webkit-autofill:hover": {
            WebkitTextFillColor: "#fff",
            caretColor: "#fff",
            WebkitBoxShadow: "0 0 0 1000px rgba(17, 17, 17, 0.35) inset",
          },
          "& input:-webkit-autofill:focus": {
            WebkitTextFillColor: "#fff",
            caretColor: "#fff",
            WebkitBoxShadow: "0 0 0 1000px rgba(17, 17, 17, 0.35) inset",
          },
          "& input:-moz-autofill": {
            boxShadow: "0 0 0 1000px rgba(17, 17, 17, 0.35) inset",
            WebkitTextFillColor: "#fff",
          },
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={0.5}>
          Welcome!
        </Typography>

        <Typography
          variant="body2"
          color="#fff"
          mb={2.5}
          sx={{ fontSize: 13, opacity: 0.65 }}
        >
          Login to continue.
        </Typography>

        {submitError ? (
          <Typography variant="body2" color="error" mb={1.5} sx={{ fontSize: 12.5 }}>
            {submitError}
          </Typography>
        ) : null}

        {/* Email */}
        <Typography variant="caption" color="#fff" sx={{ opacity: 0.72 }}>
          Email
        </Typography>
        <TextField
          fullWidth
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            mt: 0.5,
            mb: 1.8,
            input: { color: "#fff", fontSize: 13 },
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(17, 17, 17, 0.35)",
              borderRadius: 2,
              height: 40,
              transition: "all .25s ease",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.12)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.18)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "rgba(255, 255, 255, 0.65)",
                boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.10)",
              },
            },
          }}
        />

        {/* Password */}
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="caption" color="#fff" sx={{ opacity: 0.72 }}>
            Password
          </Typography>
          <Typography
            variant="caption"
            color="#fff"
            sx={{ cursor: "pointer" }}
          >
            Forgot password?
          </Typography>
        </Box>

        <TextField
          fullWidth
          placeholder="Your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <VisibilityOutlinedIcon sx={{ color: "#777" }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2.5,
            input: { color: "#fff", fontSize: 13 },
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(17, 17, 17, 0.35)",
              borderRadius: 2,
              height: 40,
              transition: "all .25s ease",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.12)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.18)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "rgba(255, 255, 255, 0.65)",
                boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.10)",
              },
            },
          }}
        />

        <Button
          fullWidth
          disabled={submitting || !email || !password}
          onClick={handleLogin}
          sx={{
            height: 42,
            bgcolor: "#fff",
            color: "#5b5757ff",
            borderRadius: 4,
            textTransform: "none",
            fontSize: 15,
            fontWeight: 700,
            mb: 1.8,
            "&:hover": { bgcolor: "grey.800", color: "#fff" },
            "&.Mui-disabled": {
              bgcolor: "rgba(255, 255, 255, 0.35)",
              color: "rgba(0, 0, 0, 0.45)",
            },
          }}
        >
          Login
        </Button>

        <Typography align="center" variant="body2" color="#fff" fontSize={12.5}>
          Don&apos;t have an account?{" "}
          <Box
            component={RouterLink}
            to="/signup"
            sx={{
              color: "#fff",
              cursor: "pointer",
              textDecoration: "none",
              display: "inline",
            }}
          >
            Sign up
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
