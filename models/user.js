const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["user", "company"]
    },
    forAnyTypeOfUser: {
      type: String,
      enum: ["projectOwner", "trader"]
    },
    fullName: String,
    googleId: String,
    companyName: String,
    selectCompany: String,
    profilePicture: String,
    emailId: {
      type: String,
      unique: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    password: String,
    mobileNo: Number,
    country: String,
    companysize: String,
    // USER kyc
    userKyc: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: false
      },
      // aadhar
      proofOfAddress: {
        url: String,
        status: {
          type: Boolean,
          default: false
        }
      },
      // pan
      proofOfIdentity: {
        url: String,
        status: {
          type: Boolean,
          default: false
        }
      },
      passportsizephoto: {
        url: String,
        status: {
          type: Boolean,
          default: false
        }
      },
      verificationdone: {
        type: Boolean,
        default: false
      }
    },

    // kyc for companyy
    companyKyc: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: false
      },
      proofOfIdentity: {
        url: String,
        status: {
          type: Boolean,
          default: false
        }
      },
      // Certificate of Incorporation/ Company Registration Certificate
      certification: {
        url: String,
        status: {
          type: Boolean,
          default: false
        }
      },
      // Memorandum of Association (MOA)
      moa: {
        url: String,
        status: {
          type: Boolean,
          default: false
        }
      },
      // Articles of Association (AOA)
      aoa: {
        url: String,
        status: {
          type: Boolean,
          default: false
        }
      },
      // Board Resolution or Letter of Authorization
      boardResolution: {
        url: String,
        status: {
          type: Boolean,
          default: false
        }
      },
      verificationdone: {
        type: Boolean,
        default: false
      }
    }
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("User", UserSchema);
