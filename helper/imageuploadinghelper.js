const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const imageUploadingHelper = async (imagePath) => {
  const pinataAPIKey = process.env.PINATA_API_KEY;
  const pinataSecretKey = process.env.PINATA_API_SECRET;
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  //we gather a local file for this example, but any valid readStream source will work here.
  let data = new FormData();
  data.append("file", fs.createReadStream(imagePath));
  const response = await axios.post(url, data, {
    maxContentLength: "Infinity", //this is needed to prevent axios from erroring out with large files
    headers: {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      pinata_api_key: pinataAPIKey,
      pinata_secret_api_key: pinataSecretKey
    }
  });
  return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
};

module.exports = imageUploadingHelper;
