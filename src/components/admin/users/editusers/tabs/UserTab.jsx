import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useParams, useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { editUser, checkUserEmail } from "@/features/users/userThunk";
import { addToast } from "@/features/toast/toastSlice";
import { viewUserImage } from "@/features/users/userThunk";
import md5 from "md5";
import NoImageAvailable from "@/assets/No_Image_Available.jpg";

const UserTab = () => {
  const { user, refetchUser } = useOutletContext();

  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email_id: user?.email_id || "",
    mobile_number: user?.mobile_number || "",
    country: user?.country || "",
    state: user?.state || "",
    password: "",
    confirmPassword: "",
    forcePasswordChange: user?.forcePasswordChange ?? true,
  });

  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [initialForm, setInitialForm] = useState({});
  const { userId } = useParams();
  const dispatch = useDispatch();

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [emailMessage, setEmailMessage] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  useEffect(() => {
    if (user) {
      const formData = {
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email_id: user.email_id || "",
        mobile_number: user.mobile_number || "",
        country: user.country || "",
        state: user.state || "",
        password: "",
        confirmPassword: "",
        forcePasswordChange: user.forcePasswordChange ?? true,
      };

      setForm(formData);
      setInitialForm(formData);
      setOriginalEmail(user.email_id || "");
      setHasChanges(false);

      if (user.profile_image && user.profile_image !== 'null' && user.profile_image !== null) {
        dispatch(viewUserImage({ file: user.profile_image })).unwrap()
          .then(blob => {
            if (blob) {
              const imageUrl = URL.createObjectURL(blob);
              setPreview(imageUrl);
            }
          })
          .catch(error => {
            console.error("Error loading profile image:", error);
            setPreview(NoImageAvailable);
          });
      } else {
        setPreview(NoImageAvailable);
      }
    }
  }, [user]);

  useEffect(() => {
    if (form.email_id === originalEmail) {
      setEmailAvailable(null);
      setEmailMessage("");
      return;
    }

    if (!form.email_id.trim()) {
      setEmailAvailable(null);
      setEmailMessage("");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email_id)) {
      setEmailAvailable(null);
      setEmailMessage("");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const result = await dispatch(checkUserEmail(form.email_id.trim())).unwrap();
        setEmailAvailable(result.success);
        setEmailMessage(result.message);
      } catch (error) {
        setEmailAvailable(null);
        setEmailMessage("");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.email_id, originalEmail, dispatch]);

  const handleChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);

    const hasFormChanges = JSON.stringify(newForm) !== JSON.stringify(initialForm);
    setHasChanges(hasFormChanges);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
    setHasChanges(true);
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

    if (form.password) {
      if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      };
    }

    setErrors(newErrors);
    console.log("Errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    if (form.email_id !== originalEmail && !emailAvailable) {
      dispatch(addToast({ type: "error", message: emailMessage || "Email is not available" }));
      return;
    }

    try {
      const userData = { ...form };
      delete userData.forcePasswordChange;

      userData.mobile_number = Number(userData.mobile_number);

      if (form.password) {
        userData.password = md5(form.password);
        delete userData.confirmPassword;
      } else {
        delete userData.password;
        delete userData.confirmPassword;
      }

      const fd = new FormData();
      if (profileImage) {
        fd.append("profile_image", profileImage);
      }
      Object.keys(userData).forEach(key => {
        fd.append(key, userData[key]);
      });

      const result = await dispatch(editUser({ userId: user._id, userData: fd })).unwrap();
      console.log("API result:", result);
      dispatch(addToast({ type: "success", message: "User updated successfully!" }));
      await refetchUser();
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to update user:", error);
      dispatch(addToast({ type: "error", message: "Failed to update user. Please try again." }));
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              mailError={emailAvailable}
              mailErrormessage={emailMessage}
            />
            <Input
              label="Mobile no*"
              type="number"
              name="mobile_number"
              value={form.mobile_number}
              onChange={handleChange}
              layout="row"
              error={errors.mobile_number}
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
                { label: "Andhra Pradesh", value: "Andhra Pradesh" },
                { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
                { label: "Assam", value: "Assam" },
                { label: "Bihar", value: "Bihar" },
                { label: "Chhattisgarh", value: "Chhattisgarh" },
                { label: "Goa", value: "Goa" },
                { label: "Gujarat", value: "Gujarat" },
                { label: "Haryana", value: "Haryana" },
                { label: "Himachal Pradesh", value: "Himachal Pradesh" },
                { label: "Jharkhand", value: "Jharkhand" },
                { label: "Karnataka", value: "Karnataka" },
                { label: "Kerala", value: "Kerala" },
                { label: "Madhya Pradesh", value: "Madhya Pradesh" },
                { label: "Maharashtra", value: "Maharashtra" },
                { label: "Manipur", value: "Manipur" },
                { label: "Meghalaya", value: "Meghalaya" },
                { label: "Mizoram", value: "Mizoram" },
                { label: "Nagaland", value: "Nagaland" },
                { label: "Odisha", value: "Odisha" },
                { label: "Punjab", value: "Punjab" },
                { label: "Rajasthan", value: "Rajasthan" },
                { label: "Sikkim", value: "Sikkim" },
                { label: "Tamil Nadu", value: "Tamil Nadu" },
                { label: "Telangana", value: "Telangana" },
                { label: "Tripura", value: "Tripura" },
                { label: "Uttar Pradesh", value: "Uttar Pradesh" },
                { label: "Uttarakhand", value: "Uttarakhand" },
                { label: "West Bengal", value: "West Bengal" },
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

            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save user
            </button>
          </div>

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
