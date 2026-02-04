import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { editUser } from "@/features/users/userThunk";
import { addToast } from "@/features/toast/toastSlice";
import md5 from "md5";

const UserTab = ({ user, onSave }) => {
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email_id: user?.email_id || "",
    mobile_number: user?.mobile_number || "",
    programCode: user?.programCode || "",
    country: user?.country || "",
    state: user?.state || "",
    password: "",
    confirmPassword: "",
    forcePasswordChange: user?.forcePasswordChange ?? true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialForm, setInitialForm] = useState({});
  const { userId } = useParams();
  const dispatch = useDispatch();

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // 🔹 set initial data from user prop
  useEffect(() => {
    if (user) {
      const formData = {
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email_id: user.email_id || "",
        mobile_number: user.mobile_number || "",
        programCode: user.programCode || "",
        country: user.country || "",
        state: user.state || "",
        password: "",
        confirmPassword: "",
        forcePasswordChange: user.forcePasswordChange ?? true,
      };

      setForm(formData);
      setInitialForm(formData);
      setHasChanges(false);

      if (user.photo) {
        setPreview(user.photo);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);

    // Check if form has changes
    const hasFormChanges = JSON.stringify(newForm) !== JSON.stringify(initialForm);
    setHasChanges(hasFormChanges);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.first_name.trim()) newErrors.first_name = "First name is required";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!form.email_id.trim()) {
      newErrors.email_id = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email_id)) {
      newErrors.email_id = "Email is invalid";
    }
    if (!form.mobile_number.trim()) newErrors.mobile_number = "Mobile number is required";
    if (!form.programCode.trim()) newErrors.programCode = "Program code is required";
    if (!form.country) newErrors.country = "Country is required";
    if (!form.state) newErrors.state = "State is required";

    // Password validation
    if (form.password) {
      if (!form.confirmPassword) {
        newErrors.confirmPassword = "Confirm password is required";
      } else if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    console.log("Save button clicked");
    console.log("Form validation:", validateForm());
    console.log("Has changes:", hasChanges);
    console.log("Form data:", form);
    console.log("User ID:", user?._id);
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userData = { ...form };

      // Hash password with MD5 if provided
      if (form.password) {
        userData.password = md5(form.password);
        delete userData.confirmPassword;
      } else {
        delete userData.password;
        delete userData.confirmPassword;
      }

      console.log("Sending userData:", userData);
      const result = await dispatch(editUser({ userId: user._id, userData })).unwrap();
      console.log("API result:", result);
      dispatch(addToast({ type: "success", message: "User updated successfully!" }));
      onSave?.(userData);
    } catch (error) {
      console.error("Failed to update user:", error);
      dispatch(addToast({ type: "error", message: "Failed to update user. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="p-6">


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-2">
            <Input
              label="Firstname*"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              layout="row"
              error={errors.first_name}
            />
            <Input
              label="Lastname*"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              layout="row"
              error={errors.last_name}
            />
            <Input
              label="Email*"
              name="email_id"
              value={form.email_id}
              onChange={handleChange}
              layout="row"
              error={errors.email_id}
            />
            <Input
              label="Mobile no*"
              name="mobile_number"
              value={form.mobile_number}
              onChange={handleChange}
              layout="row"
              error={errors.mobile_number}
            />
            <Input
              label="Program code*"
              name="programCode"
              value={form.programCode}
              onChange={handleChange}
              layout="row"
              error={errors.programCode}
            />

            <Select
              label="Country*"
              name="country"
              value={form.country}
              onChange={handleChange}
              layout="row"
              error={errors.country}
              options={[
                { label: "India", value: "India" },
                { label: "USA", value: "USA" },
              ]}
            />

            <Select
              label="State*"
              name="state"
              value={form.state}
              onChange={handleChange}
              layout="row"
              error={errors.state}
              options={[
                { label: "Tamil Nadu", value: "Tamil Nadu" },
                { label: "Karnataka", value: "Karnataka" },
              ]}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              layout="row"
            />
            <Input
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              layout="row"
              error={errors.confirmPassword}
            />

            <label className="flex items-center gap-2 mt-4 text-sm">
              <input
                type="checkbox"
                checked={form.forcePasswordChange}
                onChange={(e) => {
                  const newForm = { ...form, forcePasswordChange: e.target.checked };
                  setForm(newForm);
                  const hasFormChanges = JSON.stringify(newForm) !== JSON.stringify(initialForm);
                  setHasChanges(hasFormChanges);
                }}
              />
              Must change password at next login
            </label>

            {/* SAVE */}
            <button
              onClick={handleSave}
              disabled={loading || !hasChanges}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save user"}
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium mb-2">User photo</span>

            <label className="w-40 h-40 border-2 border-dashed rounded flex items-center justify-center cursor-pointer overflow-hidden">
              {preview ? (
                <img src={preview} alt="Profile" className="w-full h-full object-fill" />
              ) : (
                <span className="text-xs text-gray-400 text-center px-4">
                  Click to upload
                </span>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTab;
