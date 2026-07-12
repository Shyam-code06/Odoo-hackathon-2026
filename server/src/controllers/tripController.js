const tripService = require('../services/tripService');

const getTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getTrips(req.query);
    return res.status(200).json(trips);
  } catch (err) {
    next(err);
  }
};

const getTripById = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    return res.status(200).json(trip);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

const createTrip = async (req, res, next) => {
  try {
    const { source, destination, cargoWeight, plannedDistance, vehicleId, driverId } = req.body;
    if (!source || !destination || cargoWeight === undefined || plannedDistance === undefined || !vehicleId || !driverId) {
      return res.status(400).json({ error: 'Missing required trip fields.' });
    }
    const trip = await tripService.createTrip(req.body);
    return res.status(201).json(trip);
  } catch (err) {
    if (err.message.includes('exceeds')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const updateTrip = async (req, res, next) => {
  try {
    const trip = await tripService.updateTrip(req.params.id, req.body);
    return res.status(200).json(trip);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('exceeds') || err.message.includes('DRAFT')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const dispatchTrip = async (req, res, next) => {
  try {
    const trip = await tripService.dispatchTrip(req.params.id);
    return res.status(200).json(trip);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (
      err.message.includes('cannot be dispatched') ||
      err.message.includes('already') ||
      err.message.includes('expired') ||
      err.message.includes('exceeds') ||
      err.message.includes('DRAFT')
    ) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const completeTrip = async (req, res, next) => {
  try {
    const { actualDistance } = req.body;
    const trip = await tripService.completeTrip(req.params.id, actualDistance);
    return res.status(200).json(trip);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('DISPATCHED')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const cancelTrip = async (req, res, next) => {
  try {
    const trip = await tripService.cancelTrip(req.params.id);
    return res.status(200).json(trip);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('DRAFT or DISPATCHED')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const deleteTrip = async (req, res, next) => {
  try {
    await tripService.deleteTrip(req.params.id);
    return res.status(200).json({ message: 'Trip deleted successfully.' });
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('active or completed')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

module.exports = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
  deleteTrip,
};
