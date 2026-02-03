import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
// import { login } from '@/features/auth/authSlice';
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import CaptchaBox from "./CaptchaBox";

const generateCaptcha = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [attempts, setAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [validationError, setValidationError] = useState("");

  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  //  SHAKE STATE
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    const isValidUser = email === "a@a.com" && password === "password";

    if (!isValidUser) {
      setLoginError(true);

      //  trigger shake
      setShake(true);
      setTimeout(() => setShake(false), 300);

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) setShowCaptcha(true);
      return;
    }

    // success
    setAttempts(0);
    setShowCaptcha(false);
    setLoginError(false);
    setCaptchaError(false);
    // dispatch(login({ email }));
    navigate("/dashboard/overview");
  };

  const validateCaptcha = () => {
    if (captchaInput !== captcha) {
      setCaptchaError(true);

      //  shake on captcha failure
      setShake(true);
      setTimeout(() => setShake(false), 300);

      setCaptcha(generateCaptcha());
      setCaptchaInput("");
      return false;
    }

    setCaptchaError(false);
    return true;
  };

  const handleSubmit = () => {
    const validationResult = formValidation();
    if (validationResult) {
      setValidationError(validationResult);
      setShake(true);
      setTimeout(() => setShake(false), 300);
      return;
    }
    
    setValidationError("");
    if (showCaptcha && !validateCaptcha()) return;
    handleLogin();
  };

  const formValidation = () => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
    if (!password.trim()) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-12 w-full max-w-5xl px-4">

      {/* LOGIN CARD */}
      <div
        className={`w-full max-w-md border bg-white shadow-md
        ${shake ? "animate-shake" : ""}`}
      >
        <div className="p-8 space-y-5">
          {validationError && (
            <Alert text={validationError} />
          )}
          {loginError && !showCaptcha && !validationError && (
            <Alert text="Invalid user name or password" />
          )}

          <h2 className="text-center text-xl font-semibold">
            Login
          </h2>

          <Input
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="space-y-1 ">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-700 font-medium">
                Password
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline font-medium">
                Forgot Password
              </a>
            </div>

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button text="Login" onClick={handleSubmit} />
        </div>
      </div>

      {/* CAPTCHA */}
      {showCaptcha && (
        <div className="w-full max-w-md md:mt-6">
          <CaptchaBox
            captcha={captcha}
            captchaInput={captchaInput}
            setCaptchaInput={setCaptchaInput}
            captchaError={captchaError}
          />
        </div>
      )}
    </div>
  );
};

export default LoginForm;
