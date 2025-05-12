// Utility functions for email and phone validation

exports.isEmail = (value) => /\S+@\S+\.\S+/.test(value);
exports.isPhone = (value) => /^\+?[1-9]\d{9,14}$/.test(value);
