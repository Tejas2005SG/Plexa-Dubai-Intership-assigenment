
import { User } from "../Models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateTokenAndCookie } from "../utils/generateTokenAndCookie.js";
import { sendVerificationEmail } from "../Mailtrap/emails.js";
import { sendWelcomeEmail } from "../Mailtrap/emails.js";
import { sendPasswordResetEmail } from "../Mailtrap/emails.js";
import {sendResetSuccessEmail} from "../Mailtrap/emails.js";

export const signup = async (req, res) => {
  const { firstName,lastName,email, password,  confirmPassword, phoneNumber,panCardNumber } = req.body;


  try {
    if (!firstName || !lastName || !email || !password || !confirmPassword || !phoneNumber || !panCardNumber) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  
 

    
 

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      confirmPassword:hashedPassword,
      phoneNumber,
      panCardNumber,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    
    generateTokenAndCookie(res, user._id);


    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
        confirmPassword:undefined,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: `${error}` });
  }
};

export const verifyemail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or experied verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified Successfully ",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Failed to verify the  Email Account : ${error}`,
    });
  
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    generateTokenAndCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Login Failes : ${error}`,
    });
    
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged-Out Successfully",
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found !!!",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hrs

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password Reset Link Send ton your email",
    });

   
  } catch (error) {

    res.status(400).json({
      success: false,
      message: `error in sending email : ${error}`,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({
      success:true,
      message:"Reset Successful Email send Successfully!!!",
    });


  } catch (error) {
 
    res.status(400).json({
      success:false,
      message:`${error}`
    })
  }
};
