const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true 
    },
    role: {
        type: String,
        enum: ['vendor', 'superadmin'],
        default: 'vendor'
    },
    storeName: {
        type: String,
        trim: true,
        required: function() { return this.role === 'vendor'; },
    },
    contactNumber: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true 
});

// Compound index for username and email (optional, if you query both together)
AdminSchema.index({ username: 1, email: 1 });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
export default Admin;