exports.apiSuccess = (res, data = [], message = "success", toast = false, status = 200) => {
  res.send({ status, message, toast, data });
};

exports.apiError = (res, error = "error", toast = false, status = 500) => {
  res.send({ status, error, toast });
};
