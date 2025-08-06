// app.config.js
module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
    },
  };
};