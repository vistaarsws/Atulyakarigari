import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Product name cannot exceed 200 characters'],
        index: true

    },
    detailDescription: {
        type: [
            {
                title: { type: String, required: true },
                content: { type: String, required: true }
            }
        ],
        // required: [true, 'Product description is required'],
        trim: true,
        maxlength: [1000, 'Product description cannot exceed 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    discountPercentage: {
        type: Number,
        min: [0, 'Discounted  cannot be negative'],
        required: [true, 'Discount percentage is required']
    },
    priceAfterDiscount: {
        type: Number,
        min: [0, 'Price cannot be negative'],
        required: [true, 'Price after discount is required']
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
    sku: {
        type: String,
        required: [true, 'SKU ID is required'],
        maxlength: [20, 'SKU ID cannot exceed 20 characters'],
        index: true

    },
    weight: {
        type: Number,
        required: [true, 'Weight cannot be negative'],
        min: [0, 'Weight is required'],

    },
    length: {
        type: Number,
        required: [true, 'Length cannot be negative'],
        min: [0, 'Length is required'],

    },
    width: {
        type: Number,
        required: [true, 'Width cannot be negative'],
        min: [0, 'Width is required'],

    },
    height: {
        type: Number,
        required: [true, 'Height cannot be negative'],
        min: [0, 'Height is required'],

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
    },
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RatingAndReviews',
        },
    ],
    questions:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
        },
    ]
}, {
    timestamps: true
});

export default mongoose.model('Product', ProductSchema);