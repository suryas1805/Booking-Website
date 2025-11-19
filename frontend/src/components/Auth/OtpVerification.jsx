import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { useState, useRef, useEffect } from "react";
import { otpVerificationService } from "../../features/Auth/services";

const OtpVerification = () => {

    const OTP_DURATION = 90;
    const { addToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const receivedData = location.state?.data;
    const token = receivedData?.token;
    const email = receivedData?.email;
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
    const [expired, setExpired] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        let savedExpiry = localStorage.getItem("otpExpiryTime");

        if (!savedExpiry) {
            // Set new expiry time
            const newExpiry = Date.now() + OTP_DURATION * 1000;
            localStorage.setItem("otpExpiryTime", newExpiry);
            savedExpiry = newExpiry;
        }

        const interval = setInterval(() => {
            const remaining = Math.floor((savedExpiry - Date.now()) / 1000);

            if (remaining <= 0) {
                setExpired(true);
                setTimeLeft(0);
                clearInterval(interval);
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Format time
    const formatTime = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setErrors("");

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const validateOtp = () => {
        const otpValue = otp.join("");
        if (!otpValue || otpValue.length < 6) {
            setErrors("Please enter the 6-digit OTP.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (expired) {
            addToast("OTP expired. Please request a new one.", "error");
            return;
        }

        if (!validateOtp()) return;

        setLoading(true);
        try {
            const response = await otpVerificationService({
                email,
                otp: otp.join(""),
                token
            });

            if (response?.status === 200) {
                addToast("OTP verified successfully!", "success");

                // Clear expiry timer after success
                localStorage.removeItem("otpExpiryTime");

                navigate("/change-password", {
                    state: { email }
                });
            } else {
                addToast(response?.msg || "Invalid OTP", "error");
            }
        } catch (err) {
            addToast("Invalid or expired OTP. Try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAgain = () => {
        localStorage.removeItem("otpExpiryTime");
        navigate('/email-verify')
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-10">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-md sm:max-w-lg md:max-w-xl">

                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                    OTP Verification
                </h2>

                <p className="text-center text-gray-600 mb-1">
                    Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>
                </p>

                <p className="text-center text-purple-600 font-bold text-lg mb-4">
                    Time Left: {formatTime(timeLeft)}
                </p>

                {expired && (
                    <p className="text-center text-red-600 mb-4 font-semibold">
                        OTP expired. Please request a new one.
                    </p>
                )}

                {!expired && receivedData?.otp && (
                    <p className="text-center text-red-600 mb-4 font-semibold">
                        OTP: {receivedData?.otp}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                disabled={expired}
                                className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold border rounded-lg 
                                    focus:outline-none focus:ring-2 
                                    ${errors ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-indigo-300"}
                                `}
                            />
                        ))}
                    </div>

                    {errors && <p className="text-red-500 text-center text-sm">{errors}</p>}

                    <button
                        type="submit"
                        className={`w-full ${!expired ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gray-500'} text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition`}
                        disabled={loading || expired}
                    >
                        {expired ? "OTP Expired" : loading ? "Verifying..." : "Verify OTP"}
                    </button>
                    {expired && <button onClick={handleVerifyAgain} className="w-full">
                        <p className="text-center text-blue-600 mb-4 font-semibold">Verify again</p>
                    </button>}
                </form>
            </div>
        </div>
    );
};

export default OtpVerification;
