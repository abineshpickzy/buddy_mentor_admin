import { use, useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import CaptchaBox from "./CaptchaBox";
import { loginAdmin } from "../../features/auth/authThunk";
import { addToast } from "@/features/toast/toastSlice";
import { resetBootstrap } from "@/features/app/appSlice";
import md5 from "md5";
import axios from "axios";

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


  const { isAuthenticated } = useSelector((state) => state.auth);
  const {error} = useSelector((state) => state.auth); 
  const { loading } = useSelector((state) => state.auth);

  //  SHAKE STATE
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard/overview");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    const hashedPassword = md5(password);

    console.log("Dispatching login with:", {email_id: email, password: hashedPassword});

    try {
      await dispatch(loginAdmin({email_id: email, password: hashedPassword})).unwrap();
      dispatch(resetBootstrap()); // Reset bootstrap to trigger data fetch
      dispatch(addToast({ type: "success", message: "Login successful!" }));
      setAttempts(0);
      setShowCaptcha(false);
      setLoginError(false);
      setCaptchaError(false);
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Invalid email or password" }));
      setLoginError(true);
      
      setShake(true);
      setTimeout(() => setShake(false), 300);

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) setShowCaptcha(true);
    }
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

  const handleSubmit = (e) => {

    e.preventDefault();
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
    if (password.length < 3) return "Password must be at least 6 characters";
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

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
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

              <Button type="submit" loading={loading} text="Login"/>
            </div>
          </form>
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
