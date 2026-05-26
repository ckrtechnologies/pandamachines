import { createContext, useContext, useState } from "react";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const [checkoutMode, setCheckoutMode] = useState(null);
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [notes, setNotes] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const resetCheckout = () => {
        setCheckoutMode(null);
        setCheckoutItems([]);
        setSelectedAddress(null);
        setPaymentMethod("COD");
        setNotes("");
    };

    return (
        <CheckoutContext.Provider
            value={{
                // State
                checkoutMode,
                checkoutItems,
                selectedAddress,
                paymentMethod,
                notes,
                isLoading,

                // Setters
                setCheckoutMode,
                setCheckoutItems,
                setSelectedAddress,
                setPaymentMethod,
                setNotes,
                setIsLoading,

                // Actions
                resetCheckout,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => useContext(CheckoutContext);