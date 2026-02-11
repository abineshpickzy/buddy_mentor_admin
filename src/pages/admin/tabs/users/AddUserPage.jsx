import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "@/features/users/userThunk";
import { addToast } from "@/features/toast/toastSlice";
import { showLoader, hideLoader } from "@/features/loader/loaderSlice";
import Input from "@/components/ui/Input";
import Select from "../../../../components/ui/Select";
import md5 from "md5";

const AddUserPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email_id: "",
        mobile_number: "",
        programCode: "",
        country: "",
        state: "",
        password: "",
        confirmPassword: "",
        forcePasswordChange: true,
    });

    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

 const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setProfileImage(file);
  setPreview(URL.createObjectURL(file));

  const fd = new FormData();

  // add normal form as JSON
  fd.append("inputs", JSON.stringify(form));

  // add image as binary
  fd.append("image", file);
  console.log(fd.get("image"));
};

    const validateForm = () => {
        const newErrors = {};
        
        if (!form.first_name.trim()) newErrors.first_name = "First name is required";
        if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
        if (!form.email_id.trim()) newErrors.email_id = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_id)) newErrors.email_id = "Invalid email format";
        if (!form.mobile_number.trim()) newErrors.mobile_number = "Mobile number is required";
        if (!form.programCode.trim()) newErrors.programCode = "Program code is required";
        if (!form.country) newErrors.country = "Country is required";
        if (!form.state) newErrors.state = "State is required";
        if (!form.password) newErrors.password = "Password is required";
        else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const {user} = useSelector((state) => state.auth);
    const {users} = useSelector((state) => state.users);
    


    const handleCreate = async () => {
        console.log("Create button clicked");
        console.log("Form data:", form);
        
        if (!validateForm()) {
            console.log("Validation failed:", errors);
            return;
        }
        
        console.log("Validation passed, creating user...");
        
        const userData = {
            first_name: form.first_name,
            last_name: form.last_name,
            email_id: form.email_id,
            mobile_number: Number(form.mobile_number),
            programCode: form.programCode,
            country: form.country,
            state: form.state,
            password: md5(form.password),
            forcePasswordChange: form.forcePasswordChange
        };
        
        console.log("User data to send:", userData);
         const fd = new FormData();
        fd.append("inputs", JSON.stringify(userData));
        fd.append("image", profileImage);
         console.log(fd)
        dispatch(showLoader());
        try {
            await dispatch(createUser({...userData})).unwrap();
            dispatch(addToast({ type: "success", message: "User created successfully!" }));
             const user= users?.find((u) => u._email_id ===userData.email_id);
            navigate(`/admin/users/edit/${user._id}/roles`);
        } catch (error) {
            console.error("Failed to create user:", error);
            dispatch(addToast({ type: "error", message: "Failed to create user. Please try again." }));
        } finally {
            dispatch(hideLoader());
        }
    };




    return (
        <div className="p-6 bg-gray-50">
            {/* Breadcrumb */}
            <h2 className="text-sm text-gray-500 mb-4 ">Users &gt; New user</h2>

            {/* Card */}
            <div className="  p-6 ">
                {/* Top Tab */}
                <div className="mb-6 border-b border-gray-300">
                    <button className="px-8 py-1 text-primary border border-gray-300 border-b-white rounded-t-md bg-white font-medium">
                        User
                    </button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* LEFT – FORM */}
                    <div className="md:col-span-2 space-y-2">
                        <Input label="Firstname*" name="first_name" value={form.first_name} onChange={handleChange} layout="row" error={errors.first_name} />
                        
                        <Input label="Lastname*" name="last_name" value={form.last_name} onChange={handleChange} layout="row" error={errors.last_name} />
                        
                        <Input label="Email*" name="email_id" value={form.email_id} onChange={handleChange} layout="row" error={errors.email_id} />
                        
                        <Input label="Mobile no*" name="mobile_number" type="number" value={form.mobile_number} onChange={handleChange} layout="row" error={errors.mobile_number} />
                        
                        <Input label="Program code*" name="programCode" value={form.programCode} onChange={handleChange} layout="row" error={errors.programCode} />

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
                            label="Password*"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            layout="row"
                            error={errors.password}
                        />

                        <Input
                            label="Confirm password*"
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            layout="row"
                            error={errors.confirmPassword}
                        />

                        {/* Checkbox */}
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

                        {/* Create Button */}
                        <button
                            onClick={handleCreate}
                            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded"
                        >
                            Create user
                        </button>

                    </div>



                    {/* RIGHT – PROFILE PHOTO */}
                    <div className="flex flex-col items-center">
                        <span className="text-sm font-medium mb-2">User photo</span>

                        <label className="w-40 h-40 border-2 border-dashed rounded 
    flex items-center justify-center cursor-pointer overflow-hidden">

                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Profile preview"
                                    className="w-full h-full object-fill"
                                />
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

export default AddUserPage;
