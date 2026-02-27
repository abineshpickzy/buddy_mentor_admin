import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { viewUserImage } from "@/features/users/userThunk";
import NoImageAvailable from "@/assets/No_Image_Available.jpg";

const ViewUserTab = () => {
  const { user } = useOutletContext();
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email_id: "",
    mobile_number: "",
    country: "",
    state: "",
    forcePasswordChange: false,
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email_id: user.email_id || "",
        mobile_number: user.mobile_number || "",
        country: user.country || "",
        state: user.state || "",
        forcePasswordChange: user.forcePasswordChange ?? false,
      });

      if (user.profile_image && user.profile_image !== 'null' && user.profile_image !== null) {
        dispatch(viewUserImage({ file: user.profile_image })).unwrap()
          .then(blob => {
            if (blob) {
              setPreview(URL.createObjectURL(blob));
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

  return (
    <div className="p-6 bg-gray-50">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-2">
            <Input
              label="Firstname*"
              name="first_name"
              value={form.first_name}
              layout="row"
              disabled
            />
            <Input
              label="Lastname*"
              name="last_name"
              value={form.last_name}
              layout="row"
              disabled
            />
            <Input
              label="Email*"
              name="email_id"
              value={form.email_id}
              layout="row"
              disabled
            />
            <Input
              label="Mobile no*"
              type="number"
              name="mobile_number"
              value={form.mobile_number}
              layout="row"
              disabled
            />

            <Select
              label="Country*"
              name="country"
              value={form.country}
              layout="row"
              options={[
                { label: "India", value: "India" },
                { label: "USA", value: "USA" },
              ]}
              disabled
            />

            <Select
              label="State*"
              name="state"
              value={form.state}
              layout="row"
              options={[
                { label: "Tamil Nadu", value: "Tamil Nadu" },
                { label: "Karnataka", value: "Karnataka" },
              ]}
              disabled
            />

            <label className="flex items-center gap-2 mt-4 text-sm">
              <input
                type="checkbox"
                checked={form.forcePasswordChange}
                disabled
              />
              Must change password at next login
            </label>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-sm font-medium mb-2">User photo</span>
            <div className="w-40 h-40 border-2 border-dashed rounded flex items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview} alt="Profile" className="w-full h-full object-fill" />
              ) : (
                <span className="text-xs text-gray-400 text-center px-4">
                  No image
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserTab;
