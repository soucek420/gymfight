// frontend/src/api/apiErrorUtils.js

export const handleApiError = (error) => {
  console.error("API Error:", error.toJSON ? error.toJSON() : error);

  if (error.response) {
    const status = error.response.status;
    const apiMessage = error.response.data?.message;
    let userMessage;

    switch (status) {
      case 401:
        userMessage = apiMessage || "Authentication failed. Please log in again.";
        break;
      case 403:
        userMessage = apiMessage || "You do not have permission to access this resource.";
        break;
      case 404:
        userMessage = apiMessage || "Requested resource not found.";
        break;
      case 500:
        userMessage = apiMessage || "An unexpected server error occurred. Please try again later.";
        break;
      default:
        userMessage = apiMessage || `Request failed with status ${status}.`;
    }
    throw { status, message: userMessage, data: error.response.data, isOperational: true };
  } else if (error.request) {
    throw { message: "Network error. Could not connect to the server. Please check your internet connection.", isOperational: true, isNetworkError: true };
  } else {
    throw { message: error.message || "An unexpected error occurred.", isOperational: true };
  }
};
