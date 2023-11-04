import sentOtp from "../Helpers/sentOtp.js";
import UserModel from "../Models/userModel.js";
import UrlModel from "../Models/urlModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

var salt = bcrypt.genSaltSync(10);

export async function userSignup(req, res) {
  try {
    const { email } = req.body;
    console.log(req.body);
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.json({ err: true, message: "User Already Exist" });
    }

    let otp = Math.ceil(Math.random() * 1000000);
    console.log(otp);
    let otpSent = await sentOtp(email, otp);
    const token = jwt.sign(
      {
        otp: otp,
      },
      "myjwtsecretkey"
    );
    return res
      .cookie("tempToken", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 10,
        sameSite: "none",
      })
      .json({ err: false });
  } catch (err) {
    console.log(err);
    res.json({ err: true, err });
  }
}

export async function userOtpVerify(req, res) {
  try {
    const { name, email, password, phoneNo, otp } = req.body;
    const tempToken = req.cookies.tempToken;

    if (!tempToken) {
      return res.json({ err: true, message: "OTP Session Timed Out" });
    }

    const verifiedTempToken = jwt.verify(tempToken, "myjwtsecretkey");

    if (otp != verifiedTempToken.otp) {
      return res.json({ err: true, message: "Invalid OTP" });
    }

    const hashPassword = bcrypt.hashSync(password, salt);

    const newUser = new UserModel({
      name,
      email,
      password: hashPassword,
      phoneNo,
    });
    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      "myjwtsecretkey"
    );
    return res
      .cookie("userToken", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "none",
      })
      .json({ err: false });
  } catch (err) {
    console.log(err);
    res.json({ error: err, err: true, message: "something went wrong" });
  }
}

export const checkUserLoggedIn = async (req, res) => {
  try {
    const token = req.cookies.userToken;
    if (!token) {
      return res.json({
        loggedIn: false,
        error: true,
        message: "no User Token",
      });
    }
    const verifiedJWT = jwt.verify(token, "myjwtsecretkey");
    const user = await UserModel.findById(verifiedJWT.id, { password: 0 });
    if (!user) {
      return res.json({ loggedIn: false });
    }
    return res.json({ user, loggedIn: true });
  } catch (err) {
    console.log(err);
    return res.json({ loggedIn: false, error: err });
  }
};

export async function userLogout(req, res) {
  res
    .cookie("userToken", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    })
    .json({ message: "logged out", error: false });
  console.log("logged in");
}

export async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ error: true, message: "No such user found" });
    }

    if (user.block) {
      return res.json({ error: true, message: "You are blocked" });
    }

    const validUser = bcrypt.compareSync(password, user.password);
    if (!validUser) {
      return res.json({ error: true, message: "Wrong Password" });
    }
    console.log(user);
    const token = jwt.sign(
      {
        id: user._id,
      },
      "myjwtsecretkey"
    );

    return res
      .cookie("userToken", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "none",
      })
      .json({ error: false });
  } catch (err) {
    console.log(err);
    return res.json({ error: true, error: err });
  }
}

export async function  urlSubmit(req, res) {
  try {
    const { title, shortUrl, id } = req.body;
    const userId = id;
    const longUrl = `http://localhost:3000/${nanoid(6)}`;
    console.log(longUrl);
    const newUrl = new UrlModel({ title, shortUrl, longUrl, userId });
    await newUrl.save();
    res.json({ err: false });
  } catch (err) {
    res.json({ err: true });
    console.log(err);
  }
}

export async function getViewUrls(req, res) {
  try {
    const id = req.params.id;

    const urls = await UrlModel.find({ userId: id })
      .sort({ _id: -1 })
      .populate("userId")
      .lean();
    res.json({ error: false, urls });
  } catch (err) {
    res.json({ error: true });
  }
}

export async function getLongUrl(req, res) {
  try {
    const id = req.params.id;
    console.log(id);
    const longUrl = `http://localhost:3000/${id}`;
    const url = await UrlModel.findOne({ longUrl: longUrl });
    console.log(url);
    res.json({ err: false, url });
  } catch (err) {}
}

export async function getDeleteUrl(req, res) {
  try {
    const id = req.params.id;
    await UrlModel.findByIdAndDelete(id);
    res.json({ err: false });
  } catch (err) {}
}
