import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Product name cannot exceed 200 characters']

    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        maxlength: [1000, 'Product description cannot exceed 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    priceAfterDiscount: {
        type: Number,
        min: [0, 'Discounted price cannot be negative']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory'
    },
    attributes: [
        {
            key: { type: mongoose.Schema.Types.Mixed, required: true },
            value: { type: mongoose.Schema.Types.Mixed, required: true },
        }
    ],
    images: [{
        type: String,
        validate: {
            validator: function (v) {
                return /^(https?:\/\/).*\.(jpg|jpeg|png|gif)$/i.test(v);
            },
            message: 'Invalid image URL'
        }
    }],
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative']
    },
    status: {
        type: String,
        enum: ['Draft', 'Published'],
        required: [true, 'Product status is required'],
    },
    artisanName: {
        type: String,
        required: [true, 'Artisan name is required'],
        trim: true,
        maxlength: [200, 'Artisan name cannot exceed 200 characters']
    },
    artisanAbout: {
        type: String,
        required: [true, 'Artisan about is required'],
        trim: true,
        maxlength: [1000, 'Artisan about cannot exceed 1000 characters']
    },
    artisanImage: {
        type: String,
        required: [true, 'Artisan image is required'],
        validate: {
            validator: function (v) {
                return /^(https?:\/\/).*\.(jpg|jpeg|png|gif)$/i.test(v);
            },
            message: 'Invalid image URL'
        }
    }
}, {
    timestamps: true
});

export default mongoose.model('Product', ProductSchema);