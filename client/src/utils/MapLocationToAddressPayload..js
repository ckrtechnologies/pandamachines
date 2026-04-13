export const mapLocationToAddressPayload = (location) => {
    const userData = localStorage.getItem("pm-user-data");
    const user = userData ? JSON.parse(userData) : null;

    if (!user || !user._id) {
        throw new Error("User not found");
    }

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return {
        user: user._id,

        fullName: fullName || "",
        phone: user.phone || "",

        addressLine1: location.full || "",
        addressLine2: "",

        city: location.city || "",
        state: location.state || "",
        postalCode: location.pincode || "",

        country: "India",

        landmark: location.name || "",

        addressType: "Home",
        isDefault: true,

        coordinates: location.coordinates || [],
    };
};