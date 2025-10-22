// const ChatBotInquiry = require("../model/chatBotInquiries");

// exports.createChatBotInquiry = async (req, res) => {
//   try {
//     const { name, email, phone, message, product } = req.body;

//     if (!name || !email || !phone || !product) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please fill all required fields." });
//     }

//     const newInquiry = new ChatBotInquiry({
//       name,
//       email,
//       phone,
//       message: message || "I want to know more about this product.",
//       product,
//     });

//     await newInquiry.save();

//     res.status(201).json({
//       success: true,
//       message: "ChatBot inquiry submitted successfully.",
//       data: newInquiry,
//     });
//   } catch (error) {
//     console.error("Error creating chatbot inquiry:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };

// exports.getAllChatBotInquiries = async (req, res) => {
//   try {
//     const inquiries = await ChatBotInquiry.find()
//       .populate("product", "name price image")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, data: inquiries });
//   } catch (error) {
//     console.error("Error fetching inquiries:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };

const ChatBotInquiry = require("../model/chatBotInquiries");

exports.createChatBotInquiry = async (req, res) => {
  try {
    const { name, email, phone, message, product } = req.body;

    if (!name || !email || !phone || !product) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all required fields." });
    }

    const newInquiry = new ChatBotInquiry({
      name,
      email,
      phone,
      message: message || "I want to know more about this product.",
      product, // now just a string
    });

    await newInquiry.save();

    res.status(201).json({
      success: true,
      message: "ChatBot inquiry submitted successfully.",
      data: newInquiry,
    });
  } catch (error) {
    console.error("Error creating chatbot inquiry:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getAllChatBotInquiries = async (req, res) => {
  try {
    // no need for .populate() since product is now a string
    const inquiries = await ChatBotInquiry.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: inquiries });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
