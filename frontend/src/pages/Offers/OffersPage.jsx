import { Tag, CalendarDays, Gift } from "lucide-react";
import Navbar from "../../components/Layout/Navbar";

const OffersPage = () => {
    const offers = [
        {
            id: 1,
            title: "Mega Festive Sale",
            description:
                "Save big this festive season! Discounts up to 50% on top electronics and accessories.",
            validUntil: "31st October 2025",
            code: "FEST50",
        },
        {
            id: 2,
            title: "Buy 1 Get 1 Free",
            description:
                "Applicable on select fashion and accessories. Limited time offer!",
            validUntil: "15th November 2025",
            code: "B1G1FREE",
        },
        {
            id: 3,
            title: "New User Welcome Offer",
            description:
                "Flat 25% off on your first purchase. Sign up and claim your reward today.",
            validUntil: "Ongoing",
            code: "WELCOME25",
        },
    ];

    return (
        <div className="space-y-10">
            <Navbar />
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Exclusive Offers</h1>
                    <p className="text-gray-600 mt-2 mb-4">
                        Don’t miss out on these limited-time deals just for you!
                    </p>
                </div>

                {/* Offer Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center mb-3">
                                    <Tag className="text-blue-600 mr-2" size={22} />
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                        {offer.title}
                                    </h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <CalendarDays className="mr-2 text-blue-600" size={18} />
                                    Valid Until: {offer.validUntil}
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-2 flex items-center justify-between">
                                    <span className="font-semibold text-blue-700">
                                        Code: {offer.code}
                                    </span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(offer.code)}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium flex items-center justify-center">
                                    <Gift className="mr-2" size={18} /> Claim Offer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OffersPage;
