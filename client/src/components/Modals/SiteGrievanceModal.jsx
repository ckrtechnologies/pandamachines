import { useState } from "react";
import axios from "axios";
import ModalWrapper from "./ModalWrapper";
import toast from "react-hot-toast";

const SiteGrievanceModal = ({ open, onClose }) => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/grievance`,
                form
            );

            //  success
            toast.success(response?.data?.message || "Submitted successfully");

            setForm({
                name: "",
                email: "",
                mobile: "",
                message: "",
            });

            onClose();

        } catch (error) {
            console.error("Grievance submit error:", error);

            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to submit";

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    return (
        <ModalWrapper isOpen={open} onClose={onClose}>
            <h2 className="text-xl font-bold mb-4">Raise a Concern</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full border p-2 rounded"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                    required
                />
                <input
                    type="tel"
                    placeholder="Mobile Number"
                    className="w-full border p-2 rounded"
                    value={form.mobile}
                    onChange={(e) =>
                        setForm({ ...form, mobile: e.target.value })
                    }
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                />
                <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full border p-2 rounded"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />

                <textarea
                    placeholder="Describe your issue..."
                    className="w-full border p-2 rounded"
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                    }
                    required
                />

                <button
                    disabled={loading}
                    className="w-full bg-primaryBtnColor text-white py-2 rounded hover:opacity-90"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </ModalWrapper>
    );
};

export default SiteGrievanceModal;