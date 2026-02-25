const Address = require("../model/address");

exports.createAddress = async (req, res) => {
  try {
    const address = new Address(req.body);
    await address.save();
    res.status(201).json({ success: true, data: address });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getAddressesByUser = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.params.userId });
    res.status(200).json({ success: true, data: addresses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address)
      return res
        .status(404)
        .json({ success: false, error: "Address not found" });

    res.status(200).json({ success: true, data: address });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!address)
      return res
        .status(404)
        .json({ success: false, error: "Address not found" });

    res.status(200).json({ success: true, data: address });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address)
      return res
        .status(404)
        .json({ success: false, error: "Address not found" });

    res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.setDefaultAddress = async (req, res) => {
  const addressId = req.params.id;

  try {
    const address = await Address.findById(addressId);
    if (!address)
      return res
        .status(404)
        .json({ success: false, error: "Address not found" });
    await Address.updateMany(
      { user: address.user },
      { $set: { isDefault: false } }
    );
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      message: "Default address set successfully",
      data: address,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
