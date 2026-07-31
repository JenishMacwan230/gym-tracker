// Centralized Regex Validation Utility

export const REGEX = {
  // Name: letters, spaces, hyphens, apostrophes (2 to 50 characters)
  NAME: /^[a-zA-Z\s\-']{2,50}$/,
  
  // Email: standard RFC 5322 compliant email pattern
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // Phone: mobile number format (+1 555-123-4567, 10-15 digits, spaces/hyphens allowed)
  PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  
  // Serial Number: alphanumeric, hyphens, underscores (2 to 30 characters)
  SERIAL_NUMBER: /^[a-zA-Z0-9\-_]{2,30}$/,
  
  // Admin Username: alphanumeric, underscores (3 to 30 characters)
  USERNAME: /^[a-zA-Z0-9_]{3,30}$/
};

export const validateName = (name) => {
  if (!name || typeof name !== 'string') return false;
  return REGEX.NAME.test(name.trim());
};

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return REGEX.EMAIL.test(email.trim());
};

export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  return REGEX.PHONE.test(phone.trim());
};

export const validateSerialNumber = (sn) => {
  if (!sn || typeof sn !== 'string') return true; // Serial number optional, but if typed must match regex
  if (sn.trim() === '') return true;
  return REGEX.SERIAL_NUMBER.test(sn.trim());
};

export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') return false;
  return REGEX.USERNAME.test(username.trim());
};
