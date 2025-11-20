import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function OAuthSuccess() {
    const navigate = useNavigate();
    const { login } = useAuth()
    const { addToast } = useToast()

    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");
            const encodedUser = params.get("user");

            if (!encodedUser) {
                console.log("No encoded user in query string");
                return;
            }

            // First decode the URI component (undo encodeURIComponent on server)
            const uriDecoded = decodeURIComponent(encodedUser);

            // then atob to get the JSON string
            const jsonString = atob(uriDecoded);

            // finally parse JSON
            const user = JSON.parse(jsonString);

            if (token) {
                login(token, user);
                addToast('Login successful! Welcome back.', 'success');
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("OAuth success parsing error:", err);
            addToast('OAuth success parsing error', 'error')
        }
    }, []);

    return <p>Logging in...</p>;
}
