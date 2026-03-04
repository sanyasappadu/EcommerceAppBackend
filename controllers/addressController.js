const Address = require('../models/Address');
const User = require('../models/User');

exports.createAddress = async (req, res) => {
    try {
        const { name, street, city, state, zipCode, country, phone } = req.body;

        const address = await Address.create({
            userId: req.user._id,
            name, street, city, state, zipCode, country, phone
        });

        // Push address to user's addresses array
        req.user.addresses.push(address._id);

        // If this is the first address, auto set as default
        if (req.user.addresses.length === 1) {
            req.user.defaultAddress = address._id;
        }

        await req.user.save();
        res.status(201).json(address);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ userId: req.user._id });
        res.status(200).json(addresses);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) return res.status(404).json({ message: 'Address not found' });

        // Make sure buyer can only update their own address
        if (address.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this address' });
        }

        const updated = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.makeDefaultAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) return res.status(404).json({ message: 'Address not found' });

        if (address.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Set all addresses isDefault to false
        await Address.updateMany({ userId: req.user._id }, { isDefault: false });

        // Set selected address as default
        address.isDefault = true;
        await address.save();

        // Update defaultAddress on user
        req.user.defaultAddress = address._id;
        await req.user.save();

        res.status(200).json({ message: 'Default address updated', address });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) return res.status(404).json({ message: 'Address not found' });

        if (address.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this address' });
        }

        await address.deleteOne();

        // Remove from user's addresses array
        req.user.addresses = req.user.addresses.filter(
            addrId => addrId.toString() !== req.params.id
        );

        // If deleted address was the default, set new default to first remaining address
        if (req.user.defaultAddress?.toString() === req.params.id) {
            req.user.defaultAddress = req.user.addresses[0] || null;

            // Update isDefault on the new default address
            if (req.user.defaultAddress) {
                await Address.findByIdAndUpdate(req.user.defaultAddress, { isDefault: true });
            }
        }

        await req.user.save();
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};