const Address = require('../model/address');

// Create a new address
exports.createAddress = async (req, res) => {
  try {
    const address = new Address(req.body);
    await address.save();
    res.status(201).json({ success: true, data: address });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get all addresses for a user
exports.getAddressesByUser = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.params.userId });
    res.status(200).json({ success: true, data: addresses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a specific address by ID
exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) return res.status(404).json({ success: false, error: 'Address not found' });

    res.status(200).json({ success: true, data: address });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update an address
exports.updateAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!address) return res.status(404).json({ success: false, error: 'Address not found' });

    res.status(200).json({ success: true, data: address });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) return res.status(404).json({ success: false, error: 'Address not found' });

    res.status(200).json({ success: true, message: 'Address deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.setDefaultAddress = async (req, res) => {
  const addressId = req.params.id;

  try {
    const address = await Address.findById(addressId);
    if (!address) return res.status(404).json({ success: false, error: 'Address not found' });

    // Unset all default addresses for the user
    await Address.updateMany(
      { user: address.user },
      { $set: { isDefault: false } }
    );

    // Set the selected address as default
    address.isDefault = true;
    await address.save();

    res.status(200).json({ success: true, message: 'Default address set successfully', data: address });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
