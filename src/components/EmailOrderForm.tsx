import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Loader } from "lucide-react";
import moment from 'moment';
import { decryptData } from "./encryption";
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
  const [mobileNumber, setMobileNumber] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [userInput, setUserInput] = useState(false)
  const [isPaymentPageLoading, setIsPaymentPageLoading] = useState(false);
  const pricePerWeek = 10;
  const amount = weeks * pricePerWeek;
  const freeTrialDays = 7;
  const navigate = useNavigate();
  const razorpayRef = useRef<any>(null);
  const paymentButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!authToken);
    
    const checkIfMobile = () => {
      const isMobile = window.innerWidth <= 768;
      setIsMobileView(isMobile);
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    // Preload Razorpay immediately
    loadRazorpay().then(() => setRazorpayLoaded(true));
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      if (razorpayRef.current) {
        razorpayRef.current.close();
      }
    };
  }, []);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
        return;
      }
      
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        const checkLoaded = () => {
          if (window.Razorpay) {
            resolve(window.Razorpay);
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }
      
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log("Razorpay script loaded successfully");
        resolve(window.Razorpay);
      };
      
      script.onerror = () => {
        toast.error("Failed to load Razorpay SDK");
        console.error("Failed to load Razorpay script");
      };
      
      document.body.appendChild(script);
    });
  };

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

    setUserInput(true)
  };

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileNumber(e.target.value);
  };

  const validateInputs = () => {
    if (isMobileView && !mobileNumber) {
      toast.error("Please enter your mobile number");
      return false;
    }
    if (!weeks || weeks < 1) {
      toast.error("Please select at least 1 week");
      return false;
    }
    return true;
  };

  const initializePayment = async (orderData: any, expiryDate: Date) => {
    setIsPaymentPageLoading(true);
    
    try {
      // Add delay to ensure mobile page is fully loaded
      await new Promise(resolve => setTimeout(resolve, isMobileView ? 1000 : 300));
      
      const options = {
        key: "rzp_live_WpeHJkKPRwn0Pa",
        amount: amount * 100,
        currency: "INR",
        name: "Temporary Email Service",
        description: `Email extension for ${weeks} week(s)`,
        order_id: orderData.razorpay_order_id,
        prefill: {
          contact: mobileNumber,
          email: tempEmail
        },
        notes: {
          mobileNumber: mobileNumber
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(
              `${API_BASE_URL}/users/payment_status?razorpay_order_id=${orderData.razorpay_order_id}`,
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
              localStorage.setItem(`emailExpiration_${tempEmail}`, expiryDate.toString());
              
              setShowCelebration(true);
              toast.success(`Payment successful! Your email is extended for ${weeks} week(s)`);
              
              downloadInvoice(
                tempEmail,
                orderData.razorpay_order_id,
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
            setIsPaymentPageLoading(false);
          }
        },
        theme: { color: "#4F46E5" },
        modal: {
          ondismiss: () => {
            setShowPaymentModal(false);
            setIsPaymentPageLoading(false);
            toast.info("Payment window closed");
          },
          escape: false,
          backdropclose: false,
        },
        config: {
          display: {
            hide: [{ method: 'contact' }],
            preferences: {
              show_default_blocks: true,
            }
          }
        },
        "external": {
          "wallets": ["phonepe", "paytm", "gpay", "bhim"]
        },
        "method": {
          "netbanking": true,
          "card": true,
          "upi": true,
          "wallet": true,
          "paylater": true
        },
        "timeout": 300,
        "retry": {
          "enabled": true,
          "max_count": 4
        }
      };

      if (razorpayRef.current) {
        razorpayRef.current.close();
      }
      
      razorpayRef.current = new window.Razorpay(options);
      
      if (isMobileView) {
        razorpayRef.current.on('payment.failed', function(response: any) {
          console.error("Payment failed:", response);
          toast.error("Payment failed. Please try again.");
          setShowPaymentModal(false);
          setIsPaymentPageLoading(false);
        });
        
        razorpayRef.current.on('payment.error', function(error: any) {
          console.error("Payment error:", error);
          toast.error("Payment error occurred. Please try again.");
          setShowPaymentModal(false);
          setIsPaymentPageLoading(false);
        });
      }
      
      setShowPaymentModal(true);
      
      // Additional delay for mobile to ensure everything is ready
      if (isMobileView) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      razorpayRef.current.open();
      
    } catch (err) {
      console.error("Payment initialization error:", err);
      toast.error("Failed to initialize payment. Please try again.");
      setIsPaymentPageLoading(false);
    }
  };

  const createOrder = async () => {
    if (!isLoggedIn) {
      toast.error("Please login first to purchase subscription");
      navigate("/signup");
      return;
    }
    
    if (!validateInputs()) {
      return;
    }
  
    setIsProcessing(true);

    setUserInput(false)
    try {
      if (!razorpayLoaded) {
        await loadRazorpay();
        setRazorpayLoaded(true);
      }

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

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create order");
      }

      const data = await res.json();
      
      if (!data || !data.data || !data.data.razorpay_order_id) {
        throw new Error("Invalid response from server");
      }

      await initializePayment(data.data, expiryDate);
      
    } catch (err) {
      console.error("Error in createOrder:", err);
      toast.error(err.message || "Something went wrong while creating order");
      setShowPaymentModal(false);
      setIsPaymentPageLoading(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
          />
          <div className="text-4xl font-bold text-white bg-indigo-600 p-8 rounded-lg shadow-xl z-10">
            🎉 Congratulations! Payment Successful! 🎉
          </div>
        </div>
      )}
    
      {/* Payment Loading Overlay for Mobile */}
      {isPaymentPageLoading && isMobileView && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[999]">
          <div className="bg-white p-6 rounded-lg max-w-xs text-center">
            <div className="flex justify-center mb-4">
              <Loader className="animate-spin h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Preparing Payment</h3>
            <p className="text-sm text-gray-600">
              Please wait while we set up your secure payment...
            </p>
          </div>
        </div>
      )}
    
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99]">
          <div className="bg-white p-6 rounded-lg max-w-md w-[90%]">
            <h3 className="text-lg font-medium mb-4">Processing Payment...</h3>
            <p className="mb-4">Please complete the payment in the Razorpay window.</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
            <button
              onClick={() => {
                if (razorpayRef.current) {
                  razorpayRef.current.close();
                }
                setShowPaymentModal(false);
                setIsPaymentPageLoading(false);
              }}
              className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      )}
    
      <Sheet>
        <SheetTrigger>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all"
            onClick={handlePurchaseClick}
          >
            Extend Email Subscription
          </button>
        </SheetTrigger>
        {isLoggedIn && userInput ? (
          <SheetContent className="overflow-y-auto max-h-screen">
            <SheetHeader>
              <SheetTitle>Extend Your Temporary Email</SheetTitle>
              <SheetDescription className="text-sm text-gray-600">
                Purchase additional weeks to keep your email active (minimum 1 week)
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              createOrder();
            }} className="space-y-4 mt-6">
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
                <div className="flex items-center">
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={weeks}
                    onChange={(e) => setWeeks(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  {isMobileView && (
                    <div className="ml-2 flex flex-col">
                      <button 
                        type="button"
                        onClick={() => setWeeks(prev => Math.min(52, prev + 1))}
                        className="px-3 py-1 bg-gray-200 rounded-t-md"
                      >
                        +
                      </button>
                      <button 
                        type="button"
                        onClick={() => setWeeks(prev => Math.max(1, prev - 1))}
                        className="px-3 py-1 bg-gray-200 rounded-b-md"
                      >
                        -
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Each week costs ₹{pricePerWeek}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number {isMobileView && '*'}
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={handleMobileNumberChange}
                  placeholder="Enter mobile number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required={isMobileView}
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit mobile number"
                />
                {!isMobileView && (
                  <p className="mt-1 text-xs text-gray-500">
                    Required for UPI payments on mobile
                  </p>
                )}
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
                type="submit"
                disabled={isProcessing || isPaymentPageLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50"
              >
                {isProcessing || isPaymentPageLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="animate-spin h-4 w-4" />
                    {isPaymentPageLoading ? "Preparing Payment..." : "Processing..."}
                  </span>
                ) : (
                  "Proceed to Secure Payment"
                )}
              </button>
            </form>
          </SheetContent>
        ) : (
          // <SheetContent>
          // <SheetHeader>
          //     <SheetTitle>Login Required</SheetTitle>
          //   </SheetHeader>
          //   <div className="mt-6 text-center">
          //     <p className="text-lg mb-4">Please login to purchase email subscription</p>
          //     <button
          //       onClick={() => navigate("/signup")}
          //       className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium"
          //     >
          //       Go to Signup Page
          //     </button>
          //   </div>
          // </SheetContent>
          <></>
        )}
      </Sheet>
    </>
  );
};