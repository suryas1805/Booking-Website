import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            <motion.h1
                className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                404
            </motion.h1>

            <motion.p
                className="mt-4 text-2xl font-semibold"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                Oops! Page Not Found
            </motion.p>

            <motion.p
                className="mt-2 text-gray-400 max-w-md text-center"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </motion.p>

            <motion.button
                onClick={() => navigate("/login")}
                className="mt-8 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Back to Login
            </motion.button>
        </div>
    );
};

export default NotFoundPage;
