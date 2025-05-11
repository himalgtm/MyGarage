const Car = require('../models/car');
const User = require('../models/user');

// Middleware: verify token
async function verifyUser(req, res, next) {
  const { username, token } = req.params;
  const user = await User.findOne({ username: username});
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
}

// Add a car
exports.addCar = [verifyUser, async (req, res) => {
  const car = new Car({ ...req.body, username: req.user.username });
  await car.save();
  res.status(201).json(car);
}];

// Get all cars
exports.getCars = [verifyUser, async (req, res) => {
  const cars = await Car.find({ username: req.user.username });
  res.json(cars);
}];

exports.updateCar = [
  verifyUser,
  async (req, res) => {
    const { id } = req.params;
    const updatedCar = await Car.findOneAndUpdate(
      { _id: id, username: req.user.username },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedCar) {
      // no doc found that matches both id + username
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json(updatedCar);
  }
];

// Delete a car
exports.deleteCar = [verifyUser, async (req, res) => {
  const { id } = req.params;
  await Car.deleteOne({ _id: id, username: req.user.username });
  res.json({ message: 'Car deleted' });
}];
