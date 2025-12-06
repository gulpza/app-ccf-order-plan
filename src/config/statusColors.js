// Status color configuration
export const STATUS_COLORS = {
  'รอส่ง': '#efd846ff',
  'ส่งแล้ว': '#4caf50',
  'รับแล้ว': '#9b59b6',
  'ยกเลิก': '#ef5350',
  'ทั้งหมด': '#4074e3ff'
};

// Additional color variants for different UI elements
export const STATUS_COLOR_VARIANTS = {
  'รอส่ง': {
    primary: '#efd846ff',
    shadow: 'rgba(222, 202, 75, 0.4)'
  },
  'ส่งแล้ว': {
    primary: '#4caf50',
    shadow: 'rgba(76, 175, 80, 0.4)'
  },
  'รับแล้ว': {
    primary: '#9b59b6',
    shadow: 'rgba(155, 89, 182, 0.4)'
  },
  'ยกเลิก': {
    primary: '#ef5350',
    shadow: 'rgba(239, 83, 80, 0.4)'
  },
  'ทั้งหมด': {
    primary: '#4074e3ff',
    shadow: 'rgba(64, 116, 227, 0.4)'
  }
};

// Get header background color based on status
export const getHeaderBackgroundColor = (status) => {
  return STATUS_COLORS[status] || '#e4f4e2ff';
};

// Get status color (alias for backward compatibility)
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || '#e4f4e2ff';
};

// Get gradient background for mobile summary cards
export const getGradientBackground = (status, isSelected) => {
  const color = STATUS_COLORS[status] || STATUS_COLORS['ทั้งหมด'];
  if (isSelected) {
    return `linear-gradient(to bottom, ${color} 100%, #f8f9fa 100%)`;
  } else {
    return `linear-gradient(to bottom, ${color} 50%, #ffffff 50%)`;
  }
};

// Get shadow color for selected status cards
export const getShadowColor = (status) => {
  return STATUS_COLOR_VARIANTS[status]?.shadow || STATUS_COLOR_VARIANTS['ทั้งหมด'].shadow;
};