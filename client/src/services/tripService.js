import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockTrips from '@/data/trips.json';
import { exportLocalData, downloadApiBlob } from '@/utils/exportUtils';
import dayjs from 'dayjs';

// Helper to map DB trip format to frontend format
const mapTripDbToFrontend = (t) => {
  if (!t) return null;
  
  // Map backend status to frontend status
  let status = 'pending'; // default DRAFT
  if (t.status === 'DRAFT') status = 'pending';
  else if (t.status === 'DISPATCHED') status = 'in_transit';
  else if (t.status === 'COMPLETED') status = 'completed';
  else if (t.status === 'CANCELLED') status = 'cancelled';
  
  // Construct timeline based on status and timestamps
  const timeline = [
    {
      id: 'evt-1',
      type: 'created',
      title: 'Trip Initialized',
      description: 'Shipment cargo specs registered and validated.',
      timestamp: t.createdAt ? dayjs(t.createdAt).format('hh:mm A') : '09:00 AM'
    }
  ];
  
  if (t.vehicle) {
    timeline.push({
      id: 'evt-2',
      type: 'vehicle_assigned',
      title: 'Truck Assigned',
      description: `${t.vehicle.make || ''} ${t.vehicle.model || ''} (${t.vehicle.registrationNumber || ''}) secured.`,
      timestamp: t.createdAt ? dayjs(t.createdAt).format('hh:mm A') : '09:05 AM'
    });
  }
  
  if (t.driver) {
    timeline.push({
      id: 'evt-3',
      type: 'driver_assigned',
      title: 'Driver Dispatched',
      description: `${t.driver.name} Class A CDL verification accepted.`,
      timestamp: t.createdAt ? dayjs(t.createdAt).format('hh:mm A') : '09:10 AM'
    });
  }
  
  if (t.dispatchTime) {
    timeline.push({
      id: 'evt-4',
      type: 'started',
      title: 'Trip Dispatched',
      description: `Dispatched from ${t.source} towards ${t.destination}.`,
      timestamp: dayjs(t.dispatchTime).format('hh:mm A')
    });
  }
  
  if (t.status === 'COMPLETED' && t.completionTime) {
    timeline.push({
      id: 'evt-5',
      type: 'completed',
      title: 'Trip Completed',
      description: 'Shipment arrived at destination terminal. Cargo checks clean.',
      timestamp: dayjs(t.completionTime).format('hh:mm A')
    });
  } else if (t.status === 'CANCELLED') {
    timeline.push({
      id: 'evt-5',
      type: 'maintenance_alert',
      title: 'Trip Cancelled',
      description: 'Shipment cancellation authorized by terminal operations command.',
      timestamp: t.updatedAt ? dayjs(t.updatedAt).format('hh:mm A') : 'Just now'
    });
  }

  return {
    id: t.id,
    tripNumber: t.tripNumber,
    tripName: t.vehicle ? `${t.vehicle.make} ${t.vehicle.model} Route` : 'Cargo Dispatch',
    vehiclePlate: t.vehicle ? t.vehicle.registrationNumber : '',
    vehicleName: t.vehicle ? `${t.vehicle.make} ${t.vehicle.model}` : '',
    driverName: t.driver ? t.driver.name : '',
    origin: t.source,
    destination: t.destination,
    distance: t.actualDistance || t.plannedDistance,
    status,
    startedAt: t.dispatchTime,
    completedAt: t.completionTime,
    timeline,
    cargoWeight: t.cargoWeight,
    cargoType: 'Industrial Equipment', // fallback
    priority: 'Normal', // fallback
    notes: '', // fallback
    vehicleId: t.vehicleId,
    driverId: t.driverId,
    revenue: parseFloat(t.revenue || 0),
  };
};

/**
 * Trip Dispatch Operations Service
 */
export const tripService = {
  getAll: async (filters = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockTrips;
    }
    const response = await axiosInstance.get('/trips', { params: filters });
    return response.data.map(mapTripDbToFrontend);
  },

  getById: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return mockTrips.find((t) => t.id === id) || null;
    }
    const response = await axiosInstance.get(`/trips/${id}`);
    return mapTripDbToFrontend(response.data);
  },

  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newTrip = { id: `trp-${Date.now()}`, ...data };
      mockTrips.push(newTrip);
      return newTrip;
    }
    
    // Map fields to DB format
    const payload = {
      source: data.source,
      destination: data.destination,
      cargoWeight: Number(data.cargoWeight),
      plannedDistance: Number(data.distance),
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      revenue: data.revenue || (Number(data.distance) * 2.85)
    };

    // 1. Create draft trip (defaults to DRAFT in backend)
    const response = await axiosInstance.post('/trips', payload);
    const createdTrip = response.data;

    // 2. If status was requested as dispatched/in_transit, dispatch immediately
    if (data.status === 'dispatched' || data.status === 'in_transit') {
      const dispatchResponse = await axiosInstance.put(`/trips/${createdTrip.id}/dispatch`);
      return mapTripDbToFrontend(dispatchResponse.data);
    }

    return mapTripDbToFrontend(createdTrip);
  },

  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const index = mockTrips.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Trip not found');
      mockTrips[index] = { ...mockTrips[index], ...data };
      return mockTrips[index];
    }

    // Check for status machine transitions
    if (data.status === 'completed') {
      const response = await axiosInstance.put(`/trips/${id}/complete`, {
        actualDistance: Number(data.distance || data.actualDistance)
      });
      return mapTripDbToFrontend(response.data);
    }
    if (data.status === 'cancelled') {
      const response = await axiosInstance.put(`/trips/${id}/cancel`);
      return mapTripDbToFrontend(response.data);
    }

    // Default general update
    const payload = {};
    if (data.source) payload.source = data.source;
    if (data.destination) payload.destination = data.destination;
    if (data.cargoWeight !== undefined) payload.cargoWeight = Number(data.cargoWeight);
    if (data.distance !== undefined) payload.plannedDistance = Number(data.distance);
    if (data.vehicleId) payload.vehicleId = data.vehicleId;
    if (data.driverId) payload.driverId = data.driverId;
    if (data.revenue !== undefined) payload.revenue = Number(data.revenue);

    const response = await axiosInstance.put(`/trips/${id}`, payload);
    return mapTripDbToFrontend(response.data);
  },

  delete: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockTrips.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Trip not found');
      mockTrips.splice(index, 1);
      return { success: true };
    }
    const response = await axiosInstance.delete(`/trips/${id}`);
    return response.data;
  },

  /**
   * Export trip records to a downloadable file.
   * Mock mode: generates CSV/JSON locally in the browser.
   * Production mode: streams the file from the backend API.
   *
   * @param {'csv'|'json'} format - Output format (default: 'csv')
   * @returns {Promise<string>} - The downloaded filename
   */
  export: async (format = 'csv') => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return exportLocalData(mockTrips, 'trip_report', format);
    }
    const response = await axiosInstance.get('/trips/export', {
      params: { format },
      responseType: 'blob',
    });
    return downloadApiBlob(response, 'trip_report', format);
  },

  statistics: async () => {
    return {};
  }
};

export default tripService;
