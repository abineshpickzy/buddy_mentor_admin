import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

const CaptchaBox = ({
  captcha,
  captchaInput,
  setCaptchaInput,
  captchaError,
}) => {
  return (
 <div className="w-full max-w-md space-y-4">
      <Alert text="Invalid user name or password" />

      <p className="text-xs text-gray-600">
        Please enter the text shown in the image
      </p>

      <div className="flex items-center gap-3">
        <div className="rounded bg-gray-200 px-4 py-2 font-bold tracking-widest">
          {captcha}
        </div>

        <Input
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
          placeholder="Enter captcha"
        />
      </div>

      {captchaError && (
        <Alert text="Incorrect captcha text" type="info" />
      )}
    </div>
  );
};

export default CaptchaBox;
