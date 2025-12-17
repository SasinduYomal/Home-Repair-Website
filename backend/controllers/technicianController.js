const Technician = require('../models/Technician');

// @desc    Get all technicians
// @route   GET /api/technicians
// @access  Public
const getTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.find({ status: 'Active' });
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get technician by ID
// @route   GET /api/technicians/:id
// @access  Public
const getTechnicianById = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);
    
    if (technician) {
      res.json(technician);
    } else {
      res.status(404).json({ message: 'Technician not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new technician
// @route   POST /api/technicians
// @access  Private/Admin
const createTechnician = async (req, res) => {
  try {
    const { name, email, phone, specialization, experience, rating, bio, image, skills, certifications, availability } = req.body;

    // Check if technician already exists
    const technicianExists = await Technician.findOne({ email });
    
    if (technicianExists) {
      return res.status(400).json({ message: 'Technician already exists' });
    }

    const technician = new Technician({
      name,
      email,
      phone,
      specialization,
      experience,
      rating: rating || 0,
      bio,
      image,
      skills: skills || [],
      certifications: certifications || [],
      availability: availability || 'Available',
      status: 'Active'
    });

    const createdTechnician = await technician.save();
    res.status(201).json(createdTechnician);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a technician
// @route   PUT /api/technicians/:id
// @access  Private/Admin
const updateTechnician = async (req, res) => {
  try {
    const { name, email, phone, specialization, experience, rating, bio, image, skills, certifications, availability, status } = req.body;

    const technician = await Technician.findById(req.params.id);

    if (technician) {
      technician.name = name || technician.name;
      technician.email = email || technician.email;
      technician.phone = phone || technician.phone;
      technician.specialization = specialization || technician.specialization;
      technician.experience = experience || technician.experience;
      technician.rating = rating !== undefined ? rating : technician.rating;
      technician.bio = bio || technician.bio;
      technician.image = image || technician.image;
      technician.skills = skills || technician.skills;
      technician.certifications = certifications || technician.certifications;
      technician.availability = availability || technician.availability;
      technician.status = status || technician.status;

      const updatedTechnician = await technician.save();
      res.json(updatedTechnician);
    } else {
      res.status(404).json({ message: 'Technician not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a technician
// @route   DELETE /api/technicians/:id
// @access  Private/Admin
const deleteTechnician = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);

    if (technician) {
      await technician.deleteOne();
      res.json({ message: 'Technician removed' });
    } else {
      res.status(404).json({ message: 'Technician not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnician,
  deleteTechnician
};