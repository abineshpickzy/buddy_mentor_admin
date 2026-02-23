import { useState, useEffect } from "react";
import { useNavigate ,NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createUser, checkUserEmail } from "@/features/users/userThunk";
import { addToast } from "@/features/toast/toastSlice";

import Input from "@/components/ui/Input";
import Select from "../../../../components/ui/Select";
import md5 from "md5";

const AddUserPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [errors, setErrors] = useState({});
    const [emailAvailable, setEmailAvailable] = useState(null);
    const [emailMessage, setEmailMessage] = useState("");

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email_id: "",
        mobile_number: "",
        country: "",
        state: "",
        password: "",
        confirmPassword: "",
        forcePasswordChange: true,
    });

    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
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
    }, [form.email_id, dispatch]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setProfileImage(file);
        setPreview(URL.createObjectURL(file));

        const fd = new FormData();
        fd.append("inputs", JSON.stringify(form));
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
        if (!form.country) newErrors.country = "Country is required";
        if (!form.state) newErrors.state = "State is required";
        if (!form.password) newErrors.password = "Password is required";
        else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = async () => {
        console.log("Create button clicked");
        console.log("Form data:", form);
        
        if (!validateForm()) {
            console.log("Validation failed:", errors);
            return;
        }
        if (!emailAvailable) {
            dispatch(addToast({ type: "error", message: emailMessage || "Email is not available" }));
            return;
        }
        if (!profileImage) {
            dispatch(addToast({ type: "error", message: "Please select a profile image." }));
            return;
        }
        
        console.log("Validation passed, creating user...");
        
        const userData = {
            first_name: form.first_name,
            last_name: form.last_name,
            email_id: form.email_id,
            mobile_number: Number(form.mobile_number),
            country: form.country,
            state: form.state,
            password: md5(form.password),
        };
        
        console.log("User data to send:", userData);
        const fd = new FormData();
        Object.keys(userData).forEach(key => {
            fd.append(key, userData[key]);
        });
        fd.append("profile_image", profileImage);
        console.log(fd)
        try {
            const response = await dispatch(createUser(fd)).unwrap();
            dispatch(addToast({ type: "success", message: "User created successfully!" }));
            console.log("API response:", response);
            const id=response.data.user_id;
            navigate(`/admin/users/edit/${id}/roles`);
        } catch (error) {
            console.error("Failed to create user:", error);
            dispatch(addToast({ type: "error", message: "Failed to create user. Please try again." }));
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-sm text-gray-500 mb-3">
                <NavLink to="/admin/users" className="text-primary hover:underline p-2">Users</NavLink> &gt; New user
            </h2>

            <div className="mb-6">
                <div className="flex">
                    <button className="px-8 py-1 text-primary border border-gray-300 border-b-white rounded-t-sm bg-white font-medium">
                        User
                    </button>
                </div>
            </div>

            <div className="p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-2">
                        <Input label="Firstname*" name="first_name" value={form.first_name} onChange={handleChange} layout="row" error={errors.first_name} />
                        
                        <Input label="Lastname*" name="last_name" value={form.last_name} onChange={handleChange} layout="row" error={errors.last_name} />
                        
                        <Input label="Email*" name="email_id" value={form.email_id} onChange={handleChange} layout="row" error={errors.email_id} mailError={emailAvailable} mailErrormessage={emailMessage} />
                        <Input label="Mobile no*" name="mobile_number" type="number" value={form.mobile_number} onChange={handleChange} layout="row" error={errors.mobile_number} />

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

                        <button
                            onClick={handleCreate}
                            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Create user
                        </button>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-sm font-medium mb-2">User photo</span>

                        <label className="w-40 h-40 border-2 border-dashed rounded flex items-center justify-center cursor-pointer overflow-hidden">
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
