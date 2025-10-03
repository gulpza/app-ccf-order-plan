// Date formatting utilities

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear() + 543; // Convert to Buddhist era
  
  const monthNames = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  
  return `${day} ${monthNames[month]} ${year}`;
};

export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear() + 543; // Convert to Buddhist era
  const shortYear = year.toString().slice(-2); // ✅ เหลือ 2 หลักสุดท้าย
  
  const monthNames = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  
  return `${day} ${monthNames[month]} ${shortYear}`;
};

// Convert date to Buddhist era format for input field (YYYY-MM-DD with Buddhist year)
export const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear() + 543; // Convert to Buddhist era
  
  return `${year}-${month}-${day}`;
};

// Convert date to Buddhist era format with Thai month names for display
export const formatDateForInputThai = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.getMonth();
  const year = date.getFullYear() + 543; // Convert to Buddhist era
  
  const monthNamesFull = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  
  return `${day} ${monthNamesFull[month]} ${year}`;
};

// Convert Buddhist era date back to Gregorian for processing
export const convertBuddhistToGregorian = (buddhistDateString) => {
  if (!buddhistDateString) return '';
  
  const [year, month, day] = buddhistDateString.split('-');
  const gregorianYear = parseInt(year) - 543; // Convert back to Gregorian
  
  return `${gregorianYear}-${month}-${day}`;
};