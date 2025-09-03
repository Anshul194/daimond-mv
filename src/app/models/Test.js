import mongoose from 'mongoose'

const TestSchema = new mongoose.Schema({
  name: String,
})

export default mongoose.models.Test || mongoose.model('Test', TestSchema)
