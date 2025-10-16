import { Mail, Phone, MessageCircle, HelpCircle, Info } from "lucide-react";
import Navbar from "../../components/Layout/Navbar";

const HelpCenter = () => {
    const faqs = [
        {
            question: "How can I track my order?",
            answer:
                "Go to 'My Orders' in your dashboard, select your order, and click 'Track Order' to view the delivery status.",
        },
        {
            question: "Can I cancel or modify my order?",
            answer:
                "Orders can be modified or canceled before they are shipped. Once shipped, you can request a return or exchange.",
        },
        {
            question: "How do I return a product?",
            answer:
                "Visit 'My Orders', select the product you want to return, and click 'Request Return'. Follow the on-screen steps.",
        },
        {
            question: "What payment methods do you accept?",
            answer:
                "We accept credit/debit cards, UPI, wallets, and net banking. Cash on delivery is available for select locations.",
        },
    ];

    return (
        <div className="space-y-10">
            <Navbar />
            {/* Header */}
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
                    <p className="text-gray-600 mt-2 mb-4">
                        Find answers to your questions or reach out for support.
                    </p>
                </div>

                {/* Contact Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition">
                        <Phone className="text-blue-600 mx-auto mb-3" size={36} />
                        <h3 className="font-semibold text-gray-900 mb-1">Call Support</h3>
                        <p className="text-gray-600 text-sm mb-2">+1 (800) 555-0123</p>
                        <button className="text-blue-600 font-medium text-sm hover:text-blue-800">
                            Call Now →
                        </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition">
                        <Mail className="text-blue-600 mx-auto mb-3" size={36} />
                        <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                        <p className="text-gray-600 text-sm mb-2">support@shopnow.com</p>
                        <button className="text-blue-600 font-medium text-sm hover:text-blue-800">
                            Send Email →
                        </button>
                    </div>
                </div>

                {/* FAQs */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <div className="flex items-center mb-6">
                        <HelpCircle className="text-blue-600 mr-2" size={24} />
                        <h2 className="text-xl font-semibold text-gray-900">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                            >
                                <h3 className="font-medium text-gray-900">{faq.question}</h3>
                                <p className="text-gray-600 text-sm mt-2">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex items-start space-x-4 mt-6">
                    <Info className="text-blue-600 mt-1" size={28} />
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                            Still need help?
                        </h3>
                        <p className="text-gray-700 text-sm">
                            Reach out to our support team for personalized assistance with
                            orders, returns, or account issues.
                        </p>
                        <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
