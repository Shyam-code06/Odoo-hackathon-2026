import Badge from './Badge';
import { 
  VEHICLE_STATUS, 
  DRIVER_STATUS, 
  TRIP_STATUS, 
  MAINTENANCE_STATUS 
} from '@/constants';

// Config mapping state values to standard design system variants
const statusMapping = {
  // Vehicle State Configurations
  [VEHICLE_STATUS.ACTIVE]: { variant: 'success', label: 'Active' },
  [VEHICLE_STATUS.MAINTENANCE]: { variant: 'warning', label: 'In Maintenance' },
  [VEHICLE_STATUS.OUT_OF_SERVICE]: { variant: 'danger', label: 'Out of Service' },

  // Driver State Configurations
  [DRIVER_STATUS.AVAILABLE]: { variant: 'success', label: 'Available' },
  [DRIVER_STATUS.ON_TRIP]: { variant: 'info', label: 'On Trip' },
  [DRIVER_STATUS.OFF_DUTY]: { variant: 'neutral', label: 'Off Duty' },
  [DRIVER_STATUS.SUSPENDED]: { variant: 'danger', label: 'Suspended' },

  // Trip State Configurations
  [TRIP_STATUS.PENDING]: { variant: 'neutral', label: 'Pending' },
  [TRIP_STATUS.DISPATCHED]: { variant: 'info', label: 'Dispatched' },
  [TRIP_STATUS.IN_TRANSIT]: { variant: 'primary', label: 'In Transit' },
  [TRIP_STATUS.COMPLETED]: { variant: 'success', label: 'Completed' },
  [TRIP_STATUS.DELAYED]: { variant: 'warning', label: 'Delayed' },
  [TRIP_STATUS.CANCELLED]: { variant: 'danger', label: 'Cancelled' },

  // Maintenance State Configurations
  [MAINTENANCE_STATUS.SCHEDULED]: { variant: 'neutral', label: 'Scheduled' },
  [MAINTENANCE_STATUS.IN_PROGRESS]: { variant: 'warning', label: 'In Progress' },
  [MAINTENANCE_STATUS.COMPLETED]: { variant: 'success', label: 'Completed' },
  [MAINTENANCE_STATUS.OVERDUE]: { variant: 'danger', label: 'Overdue' },
};

/**
 * Enterprise chip that translates constants to pre-styled status indicators.
 */
export function StatusChip({ status, className }) {
  const mapping = statusMapping[status] || { variant: 'neutral', label: status || 'Unknown' };
  
  return (
    <Badge variant={mapping.variant} className={className}>
      {mapping.label}
    </Badge>
  );
}

export default StatusChip;
