const User = require("../models/User");
const imageUploadingHelper = require("./imageuploadinghelper");
const imageUploading = async ({ imagePath, proofOfAddress, proofOfIdentity, passportsizephoto, proofOfIdentityforcompany, certification, moa, aoa, boardResolution, userId }) => {
  const imgHash = await imageUploadingHelper(imagePath);
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
