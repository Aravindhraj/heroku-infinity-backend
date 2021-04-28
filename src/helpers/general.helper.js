exports.getUniqueId = (type, id) => {
  if (id < 10) {
    return type + "00" + id;
  } else if (id < 100) {
    return type + "0" + id;
  } else {
    return type + id;
  }
};
