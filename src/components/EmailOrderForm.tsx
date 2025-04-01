import { useState } from "react";
import { toast } from "sonner";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Loader } from "lucide-react";
import moment from 'moment'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

declare global {
    interface Window {
        Razorpay: any;
    }
}

export const EmailOrderForm = ({ tempEmail }: { tempEmail: string }) => {
    const [days, setDays] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const amountPerDay = 1; // ₹1 per day
    const amount = days * amountPerDay;

    // Function to load Razorpay dynamically
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(window.Razorpay);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(window.Razorpay);
            script.onerror = () => toast.error("Failed to load Razorpay SDK");
            document.body.appendChild(script);
        });
    };

    // Calculate expiry date (starts counting from tomorrow)
    const calculateExpiryDate = (days: number) => {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + days + 1); // Add 1 extra day (starts from tomorrow)
         let expiryDate=expiry.toLocaleDateString();
         return moment(expiryDate).format("YYYY-MM-DD")
    };

    const createOrder = async () => {
        setIsProcessing(true);
        try {
            const daysToAdd = Number(days);
            const expiryDate = new Date();
            
            // Set expiry date to tomorrow + purchased days
            expiryDate.setDate(expiryDate.getDate() + daysToAdd + 1);
            const formattedExpiryDate = expiryDate.toISOString().split("T")[0];

            const res = await fetch(`${API_BASE_URL}/users/create-order`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({
                    email: tempEmail,
                    days: daysToAdd,
                    amount,
                    expiry_date: formattedExpiryDate
                }),
            });

            const data = await res.json();

            if (!data?.data?.razorpay_order_id) {
                throw new Error("Failed to create order");
            }

            const Razorpay:any = await loadRazorpay();
            if (!Razorpay) {
                throw new Error("Razorpay SDK failed to load");
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: amount * 100,
                currency: "INR",
                name: "Temporary Email Service",
                description: `Email extension for ${days} day(s)`,
                order_id: data.data.razorpay_order_id,
                handler: function (response: any) {
                    toast.success(`Payment successful! Your email is extended for ${days} day(s)`);
                    window.location.reload();
                },
                theme: { color: "#4F46E5" },
            };

            const rzp = new Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
            toast.error(err.message || "Something went wrong");
        } finally {
            setIsProcessing(false);
            setDays(1);
        }
    };

    return (
        <Sheet>
            <SheetTrigger>
                <button className="bg-green-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all">
                    Purchase Email Extension
                </button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Extend Your Temporary Email</SheetTitle>
                    <SheetDescription className="text-sm text-gray-600">
                        Purchase additional days to keep your email active
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                    <div className="bg-gray-50 p-3 rounded-lg border">
                        <p className="text-sm text-gray-600 mb-1">Your current email:</p>
                        <p className="font-medium text-blue-600 break-all">{tempEmail}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Days to Extend
                            <span className="ml-2 text-xs text-gray-500">
                                (Minimum 1 day)
                            </span>
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={365}
                            placeholder="Enter number of days"
                            value={days}
                            onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Each day costs ₹{amountPerDay}
                        </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Total Amount:</span>
                            <span className="text-xl font-bold text-blue-600">₹{amount}</span>
                        </div>
                        <div className="mt-2 text-xs text-blue-700">
                            Your email will be valid until: {calculateExpiryDate(days)}
                        </div>
                    </div>

                    <button
                        onClick={createOrder}
                        disabled={!days || isProcessing}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader className="animate-spin h-4 w-4" />
                                Processing...
                            </span>
                        ) : (
                            "Proceed to Secure Payment"
                        )}
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    );
};