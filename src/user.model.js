import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

userSchema.pre("save", async function (next) {
  if(!this.isModified("password"))  return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

/**
 * Checks if the provided password matches the user's stored password.
 * @param {string} password - The password to check against the user's stored password.
 * @returns {boolean} - Returns true if the provided password matches the user's stored password, false otherwise.
 */

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

/**
 * Generates an access token for the user.
 * 
 * @returns {string} The generated access token.
 */
userSchema.methods.generateAccessToken = async function () {
  const tokenPayload = {
    _id: this._id,
    fullName: this.fullName,
    username: this.username
  };
  return jwt.sign(
    tokenPayload,
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

/**
 * Generates a refresh token for the user.
 * 
 * @returns {string} The generated refresh token.
 */
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.Refresh_TOKEN_SECRET,
    {
      expiresIn: process.env.Refresh_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User", userSchema)