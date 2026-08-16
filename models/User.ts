import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    default: 'user', // user, admin
  },
  savedDestinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  }]
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', UserSchema)
