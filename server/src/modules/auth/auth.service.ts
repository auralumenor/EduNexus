import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserModel } from './auth.model';
import { LoginDto, RegisterDto, AuthResponse } from './auth.types';
import { ENV } from '../../config/env';
import { sendEmail } from '../../utils/email';

const signToken = (id: string, role: string): string =>
  jwt.sign({ id, role }, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN } as jwt.SignOptions);

export const register = async (dto: RegisterDto): Promise<AuthResponse> => {
  const existing = await UserModel.findOne({ email: dto.email });
  if (existing) throw Object.assign(new Error('Email already in use'), { statusCode: 409 });

  const user = await UserModel.create(dto);
  const token = signToken(String(user._id), user.role);

  return {
    token,
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
  };
};

export const login = async (dto: LoginDto): Promise<AuthResponse> => {
  const user = await UserModel.findOne({ email: dto.email }).select('+password');
  if (!user || !(await user.comparePassword(dto.password))) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  }

  const token = signToken(String(user._id), user.role);

  return {
    token,
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
  };
};

export const getMe = async (id: string) => {
  const user = await UserModel.findById(id).select('-password');
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  return user;
};

export const forgotPassword = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw Object.assign(new Error('There is no user with that email address.'), { statusCode: 404 });
  }

  // Generate random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash it and store in db
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save({ validateBeforeSave: false });

  // Create reset url (this assumes frontend runs on localhost:3000 in dev)
  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw Object.assign(new Error('There was an error sending the email. Try again later!'), { statusCode: 500 });
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  // Hash URL token to compare with DB
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await UserModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw Object.assign(new Error('Token is invalid or has expired'), { statusCode: 400 });
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
};

export const updateMe = async (id: string, data: { name?: string, email?: string }) => {
  const user = await UserModel.findById(id);
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

  if (data.email && data.email !== user.email) {
    const existing = await UserModel.findOne({ email: data.email });
    if (existing) throw Object.assign(new Error('Email already in use'), { statusCode: 409 });
  }

  if (data.name) user.name = data.name;
  if (data.email) user.email = data.email;
  
  await user.save();
  return { id: String(user._id), name: user.name, email: user.email, role: user.role };
};

export const updatePassword = async (id: string, currentPass: string, newPass: string) => {
  const user = await UserModel.findById(id).select('+password');
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

  if (!(await user.comparePassword(currentPass))) {
    throw Object.assign(new Error('Incorrect current password'), { statusCode: 401 });
  }

  user.password = newPass;
  await user.save();
};

export const deleteMe = async (id: string) => {
  await UserModel.findByIdAndDelete(id);
};
