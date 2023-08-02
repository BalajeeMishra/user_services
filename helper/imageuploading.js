const axios = require("axios");
const User = require("../models/user");
const FormData = require("form-data");
const fs = require("fs");

const imageUploading = async (imagePath, proofOfAddress, proofOfIdentity, passportsizephoto, proofOfIdentityforcompany, certification, moa, aoa, boardResolution, userId) => {
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
  const imgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  if (proofOfAddress) {
    const userUpdateResponse = await User.findByIdAndUpdate(userId, { $set: { "userKyc.proofOfAddress.url": imgHash } }, { new: true });
    return userUpdateResponse;
  } else if (proofOfIdentity) {
    const userUpdateResponse = await User.findByIdAndUpdate(userId, { $set: { "userKyc.proofOfIdentity.url": imgHash } }, { new: true });
    return userUpdateResponse;
  } else if (passportsizephoto) {
    const userUpdateResponse = await User.findByIdAndUpdate(userId, { $set: { "userKyc.passportsizephoto.url": imgHash } }, { new: true });
    return userUpdateResponse;
  } else if (proofOfIdentityforcompany) {
    const userUpdateResponse = await User.findByIdAndUpdate(userId, { $set: { "companyKyc.proofOfIdentity.url": imgHash } }, { new: true });
    return userUpdateResponse;
  } else if (certification) {
    const userUpdateResponse = await User.findByIdAndUpdate(userId, { $set: { "companyKyc.certification.url": imgHash } }, { new: true });
    return userUpdateResponse;
  } else if (moa) {
    const userUpdateResponse = await User.findByIdAndUpdate(userId, { $set: { "companyKyc.moa.url": imgHash } }, { new: true });
    return userUpdateResponse;
  } else if (aoa) {
    const userUpdateResponse = await User.findByIdAndUpdate(userId, { $set: { "companyKyc.aoa.url": imgHash } }, { new: true });
    return userUpdateResponse;
  } else if (boardResolution) {
    const userUpdateResponse = await User.findByIdAndUpdate(userId, { $set: { "companyKyc.boardResolution.url": imgHash } }, { new: true });
    return userUpdateResponse;
  }
  return;
};

module.exports = imageUploading;
