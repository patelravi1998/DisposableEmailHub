import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Loader } from "lucide-react";
import moment from 'moment';
import { decryptData } from "./encryption"; // Import decryption
import { useNavigate } from "react-router-dom";
import ReactConfetti from 'react-confetti';
import { downloadInvoice } from "./InvoiceTemplate";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

declare global {
    interface Window {
        Razorpay: any;
    }
}

export const EmailOrderForm = ({ tempEmail }: { tempEmail: string }) => {
    const [weeks, setWeeks] = useState(1);
    const [showCelebration, setShowCelebration] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pricePerWeek = 7;
    const amount = weeks * pricePerWeek;
    const freeTrialDays = 7;
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in when component mounts
        const authToken = localStorage.getItem("authToken");
        setIsLoggedIn(!!authToken);
    }, []);

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

    // Calculate expiry date based on current expiry + purchased weeks
    const calculateExpiryDate = (weeks: number) => {
        const currentExpiry = localStorage.getItem(`emailExpiration_${tempEmail}`);
        const startDate = currentExpiry ? new Date(currentExpiry) : new Date();
        
        if (!currentExpiry) {
            startDate.setDate(startDate.getDate() + freeTrialDays);
        }
        
        const expiryDate = new Date(startDate);
        expiryDate.setDate(expiryDate.getDate() + (weeks * 7));
        
        return moment(expiryDate).format("MMMM Do, YYYY");
    };

    const handlePurchaseClick = () => {
        if (!isLoggedIn) {
            toast.error("Please login first to purchase subscription");
            navigate("/signup");
            return;
        }
    };

    const createOrder = async () => {
        if (!isLoggedIn) {
            toast.error("Please login first to purchase subscription");
            navigate("/signup");
            return;
        }
    
        setIsProcessing(true);
        try {
            const weeksToAdd = Number(weeks);
            const currentExpiry = localStorage.getItem(`emailExpiration_${tempEmail}`);
            let expiryDate = currentExpiry ? new Date(currentExpiry) : new Date();
            
            if (!currentExpiry) {
                expiryDate.setDate(expiryDate.getDate() + freeTrialDays);
            }
            
            expiryDate.setDate(expiryDate.getDate() + (weeksToAdd * 7));
            const formattedExpiryDate = expiryDate.toISOString().split("T")[0];
            
            const getCookie = (name: string) => {
                return (
                  document.cookie
                    .split("; ")
                    .find((row) => row.startsWith(name + "="))
                    ?.split("=")[1] || null
                );
            };
    
            const storedIp = getCookie("userIp");
            const purchasedEmails = JSON.parse(localStorage.getItem('purchasedEmails') || '[]');
            let ipaddress = "";
            
            if (purchasedEmails.length > 0) {
                for(let res of purchasedEmails) {
                    if(res.email === tempEmail) {
                        ipaddress = res.ipaddress;
                        break;
                    }
                }
            }
    
            // Make the API request
            const res = await fetch(`${API_BASE_URL}/users/create-order`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({
                    email: tempEmail,
                    days: weeksToAdd,
                    amount,
                    expiry_date: formattedExpiryDate,
                    ipaddress: ipaddress
                }),
            });
    
            // First check if response is OK
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Failed to create order");
            }
    
            // Then try to parse as JSON
            const data = await res.json();
            
            // Additional validation
            if (!data || !data.data || !data.data.razorpay_order_id) {
                console.error("Invalid response structure:", data);
                throw new Error("Invalid response from server");
            }
    
            const Razorpay: any = await loadRazorpay();
            if (!Razorpay) {
                throw new Error("Razorpay SDK failed to load");
            }
    
            // Open payment modal
            setShowPaymentModal(true);
    
            const options = {
                key: "rzp_live_WpeHJkKPRwn0Pa",
                amount: amount * 100,
                currency: "INR",
                name: "Temporary Email Service",
                description: `Email extension for ${weeks} week(s)`,
                order_id: data.data.razorpay_order_id,
                handler: async function (response: any) {
                    try {
                        // Verify payment with backend
                        const verifyRes = await fetch(
                            `${API_BASE_URL}/users/payment_status?razorpay_order_id=${data.data.razorpay_order_id}`,
                            {
                                method: "GET",
                                headers: { 
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                                },
                            }
                        );
    
                        if (!verifyRes.ok) {
                            throw new Error("Payment verification failed");
                        }
    
                        const verifyData = await verifyRes.json();
                        
                        if (verifyData?.data === true) {
                            // Payment verified
                            localStorage.setItem(`emailExpiration_${tempEmail}`, expiryDate.toString());
                            
                            setShowCelebration(true);
                            toast.success(`Payment successful! Your email is extended for ${weeks} week(s)`);
                            
                            downloadInvoice(
                                tempEmail,
                                data.data.razorpay_order_id,
                                amount,
                                weeks,
                                expiryDate.toString()
                            );
                            
                            setTimeout(() => {
                                setShowCelebration(false);
                                window.location.reload();
                            }, 5000);
                        } else {
                            toast.error("Payment verification failed. Please contact support.");
                        }
                    } catch (err) {
                        console.error("Payment verification error:", err);
                        toast.error("Payment verification failed. Please contact support.");
                    } finally {
                        setShowPaymentModal(false);
                    }
                },
                theme: { color: "#4F46E5" },
                modal: {
                    ondismiss: () => {
                        setShowPaymentModal(false);
                        toast.info("Payment window closed");
                    }
                }
            };
    
            const rzp = new Razorpay(options);
            rzp.open();
    
        } catch (err) {
            console.error("Error in createOrder:", err);
            toast.error(err.message || "Something went wrong while creating order");
            setShowPaymentModal(false);
        } finally {
            setIsProcessing(false);
            setWeeks(1);
        }
    };

    return (
        <>
            {/* Celebration Modal (shown after successful payment) */}
            {showCelebration && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <ReactConfetti
                        width={window.innerWidth}
                        height={window.innerHeight}
                        recycle={false}
                        numberOfPieces={500}
                    />
                    <div className="text-4xl font-bold text-white bg-indigo-600 p-8 rounded-lg shadow-xl z-10">
                        � Congratulations! Payment Successful! 🎉
                    </div>
                </div>
            )}
    
            {/* Payment Processing Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99]">
                    <div className="bg-white p-6 rounded-lg max-w-md">
                        <h3 className="text-lg font-medium mb-4">Processing Payment...</h3>
                        <p className="mb-4">Please complete the payment in the Razorpay window.</p>
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Your existing Sheet component */}
            <Sheet>
                <SheetTrigger>
                    <button 
                        className="bg-green-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all"
                        onClick={handlePurchaseClick}
                    >
                        Extend Email Subscription
                    </button>
                </SheetTrigger>
                {isLoggedIn ? (
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Extend Your Temporary Email</SheetTitle>
                            <SheetDescription className="text-sm text-gray-600">
                                Purchase additional weeks to keep your email active (minimum 1 week)
                            </SheetDescription>
                        </SheetHeader>
                        <div className="space-y-4 mt-6">
                            <div className="bg-gray-50 p-3 rounded-lg border">
                                <p className="text-sm text-gray-600 mb-1">Your current email:</p>
                                <p className="font-medium text-blue-600 break-all">{tempEmail}</p>
                            </div>
    
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Weeks to Extend
                                    <span className="ml-2 text-xs text-gray-500">
                                        (Minimum 1 week)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={52}
                                    placeholder="Enter number of weeks"
                                    value={weeks}
                                    onChange={(e) => setWeeks(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Each week costs ₹{pricePerWeek}
                                </p>
                            </div>
    
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Total Amount:</span>
                                    <span className="text-xl font-bold text-blue-600">₹{amount}</span>
                                </div>
                                <div className="mt-2 text-sm text-blue-700">
                                    <p>Your email will be valid until:</p>
                                    <p className="font-semibold">{calculateExpiryDate(weeks)}</p>
                                    {!localStorage.getItem(`emailExpiration_${tempEmail}`) && (
                                        <p className="text-xs mt-1">(Includes {freeTrialDays} days free trial)</p>
                                    )}
                                </div>
                            </div>
    
                            <button
                                onClick={createOrder}
                                disabled={!weeks || isProcessing}
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
                ) : (
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Login Required</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6 text-center">
                            <p className="text-lg mb-4">Please login to purchase email subscription</p>
                            <button
                                onClick={() => navigate("/signup")}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium"
                            >
                                Go to Signup Page
                            </button>
                        </div>
                    </SheetContent>
                )}
            </Sheet>
        </>
    );
    
};