const fs = require("fs");
const path = require("path");

exports.upload = async (file, directoryName) => {
  const fileName = file.name;
  const nameArray = fileName.split(".");
  const extension = nameArray[nameArray.length - 1];
  const name = Date.now() + "_" + nameArray[0] + "." + extension;

  const directoryPath = path.join(__dirname, "./../../public/uploads/" + directoryName);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  const uploadPath = directoryPath + "/" + name;

  const res = await file.mv(uploadPath);
  if (res) {
    return false;
  }
  return path.join('uploads', directoryName, '/', name);
};
