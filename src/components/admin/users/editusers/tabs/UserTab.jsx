import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const UserTab = ({ user, onSave }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    programCode: "",
    country: "",
    state: "",
    password: "",
    confirmPassword: "",
    forcePasswordChange: true,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // 🔹 set initial data from user prop
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        programCode: user.programCode || "",
        country: user.country || "",
        state: user.state || "",
        password: "",
        confirmPassword: "",
        forcePasswordChange: user.forcePasswordChange ?? true,
      });

      if (user.photo) {
        setPreview(user.photo);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    onSave({ ...form, profileImage });
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="p-6">
       

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-2">
            <Input label="Firstname*" name="firstName" value={form.firstName} onChange={handleChange} layout="row" />
            <Input label="Lastname*" name="lastName" value={form.lastName} onChange={handleChange} layout="row" />
            <Input label="Email*" name="email" value={form.email} onChange={handleChange} layout="row" />
            <Input label="Phone no*" name="phone" value={form.phone} onChange={handleChange} layout="row" />
            <Input label="Program code*" name="programCode" value={form.programCode} onChange={handleChange} layout="row" />

            <Select
              label="Country*"
              name="country"
              value={form.country}
              onChange={handleChange}
              layout="row"
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
              options={[
                { label: "Tamil Nadu", value: "Tamil Nadu" },
                { label: "Karnataka", value: "Karnataka" },
              ]}
            />

            <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} layout="row" />
            <Input label="Confirm password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} layout="row" />

            <label className="flex items-center gap-2 mt-4 text-sm">
              <input
                type="checkbox"
                checked={form.forcePasswordChange}
                onChange={(e) =>
                  setForm({ ...form, forcePasswordChange: e.target.checked })
                }
              />
              Must change password at next login
            </label>

            {/* SAVE */}
            <button
              onClick={handleSave}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded"
            >
              Save user
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
