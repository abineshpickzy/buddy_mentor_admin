import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import md5 from "md5";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { loginAdmin } from "@/features/auth/authThunk";
import { addToast } from "@/features/toast/toastSlice";
import { resetBootstrap } from "@/features/app/appSlice";

const SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  const [shake, setShake] = useState(false);

  const { isAuthenticated, loading, captchaRequired, error } =
    useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard/overview");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation → toast
    if (!email || !password) {
       setShake(true);
       setTimeout(() => setShake(false), 300);
      dispatch(
        addToast({ type: "error", message: "Email and password are required" })
      );
      return;
    }

    if (captchaRequired && !captchaToken) {
       setShake(true);
       setTimeout(() => setShake(false), 300);
      dispatch(
        addToast({ type: "error", message: "Please complete the captcha" })
      );
      return;
    }

    try {
      await dispatch(
        loginAdmin({
          email_id: email,
          password: md5(password),
          captchaToken: captchaRequired ? captchaToken : "",
        })
      ).unwrap();

      dispatch(resetBootstrap());
      dispatch(addToast({ type: "success", message: "Login successful" }));
    } catch (err) {
      // backend error → toast
      dispatch(
        addToast({
          type: "error",
          message: err?.message || "Login failed",
        })
      );
       setShake(true);
       setTimeout(() => setShake(false), 300);


      // reset captcha on failure
      recaptchaRef.current?.reset();
      setCaptchaToken("");
    }
  };

  return (
<div
  className={`w-full max-w-md border bg-white shadow-md p-8
    ${shake ? "animate-shake" : ""}`}
>
      <h2 className="text-xl font-semibold text-center mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {captchaRequired && (
          <div className="flex justify-start ">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={SITE_KEY}
              onChange={(token) => setCaptchaToken(token)}
            />
          </div>
        )}

        <Button type="submit" loading={loading} text="Login" />
      </form>
    </div>
  );
};

export default LoginForm;
