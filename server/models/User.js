import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({

  name: {
    type: String,
    required: true,
    default: null
  },
  userID: {
    type: String,
    required: true,
    default: null,
    unique: true
  },
  email: {
    type: String,
    required: true,
    default: null,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 8
  },
  joinDate: {
    type: Date,
  }
});

const User = mongoose.model("User", userSchema);

export default User;
