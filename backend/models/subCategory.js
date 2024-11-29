import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subcategory name is required'],
        trim: true,
        maxlength: [100, 'Subcategory name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Subcategory description cannot exceed 500 characters']
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Parent category is required']
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
export default mongoose.model('SubCategory', SubcategorySchema);