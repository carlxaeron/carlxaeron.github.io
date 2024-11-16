const httpResponses = ({ data, message, errCode }) => ({
  success: {
    status: 200,
    message: message || "Success",
    data: data || {}
  },
  error: {
    status: 400,
    message: message || "Error",
    data: data || {},
    errCode: errCode || "",
  }
});

const sendError = ({ request, response }, data) => {
  response.status(400).send(httpResponses(data).error);
}

const sendSuccess = ({ request, response }, data) => {
  response.status(200).send(httpResponses(data).success);
}

module.exports = {
  sendError,
  sendSuccess,
};