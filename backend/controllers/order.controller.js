import mongoose from "mongoose";
import Order from "../models/order.js";
import User from "../models/user.js";
import Address from "../models/Address.js";
import Payment from "../models/payment.js";
import {
  createShiprocketOrder,
  cancelShiprocketOrder,
  ReturnShiprocketOrder,
  getShiprocketPickupLocations,
} from "../utils/shiprocket-service/shiprocket.js";
import Product from "../models/product.js";

const handleOrderNotFound = (res) => {
  return res.status(404).json({ message: "Order not found" });
};

export const createOrder = async (req, res) => {
  try {
    const { loginId, _id } = req.user;
    const { paymentOrderId } = req.body;
   
    const userId = _id;
  

    const payment = await Payment.findOne({ paymentOrderId, userId });
    if (!payment || payment.status !== "COMPLETED") {
      return res.status(400).json({ error: "Invalid or incomplete payment" });
    }

    const productIds = payment.productIds;
    const productsData = await Product.find({ _id: { $in: productIds } });

    if (productsData.length !== productIds.length) {
      return res.status(400).json({ error: "Invalid product(s) in payment" });
    }

    const products = productsData.map((product) => ({
      productId: product._id,
      name: product.name,
      quantity: product.quantity || 1, 
      price: product.price,
      totalPrice: product.price,
    }));
    const addressId = payment.addressId;
    const address = await Address.findOne({ _id: addressId, userId });

    if (!address) {
      return res.status(400).json({ error: "Invalid shipping address" });
    }

    const pickupDetails = await getShiprocketPickupLocations();
    
    const payload = {
      userId,
      email: loginId,
      products,
      address,
      payment,
      pickupAddress: pickupDetails?.data?.shipping_address[0],
    };

    const shiprocketResponse = await createShiprocketOrder(payload);
    console.log(shiprocketResponse, 'ship response')
    if (!shiprocketResponse || !shiprocketResponse.order_id) {
      return res
        .status(500)
        .json({ error: "Shiprocket order creation failed" });
    }

    const newOrder = await Order.create({
      orderId: payment.paymentOrderId,
      userId,
      products,
      totalMRP: payment.totalMRP,
      discountAmount: payment.totalDiscount,
      shippingCost: 0,
      donationAmount: payment.donationAmounts || 0,
      totalAmount: payment.amount,
      orderStatus: "Processing",
      shippingAddress: {
        fullName: address.fullName,
        phone: address.mobileNumber,
        addressLine1: address.address,
        addressLine2: address.addressLine2 || "",
        city: address.city,
        state: address.state,
        postalCode: address.pincode,
        country: address.country || "India",
      },
      billingAddress: {
        fullName: address.fullName,
        phone: address.mobileNumber,
        addressLine1: address.address,
        addressLine2: address.addressLine2 || "",
        city: address.city,
        state: address.state,
        postalCode: address.pincode,
        country: address.country || "India",
      },
      shippingMethod: "Standard",
      paymentMethod: payment.paymentMethod || "Cash on Delivery",
      transactionId: payment.transactionId || null,
      isPaid: true,
      paidAt: new Date(),
      shiprocketOrderId: shiprocketResponse.order_id,
      trackingId: shiprocketResponse.tracking_id || null,
      courierName: shiprocketResponse.courier_name || null,
      estimatedDelivery: shiprocketResponse.estimated_delivery_date || null,
      shippedAt: null,
      deliveredAt: null,
      cancelledAt: null,
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId", "name price");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Order ID is required" });

    const order = await Order.findById(id);

    if (!order) return handleOrderNotFound(res);

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const returnOrder = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id) return res.status(400).json({ message: "Order ID is required" });

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    );
    const response = await ReturnShiprocketOrder(payload);

    if (!updatedOrder) return handleOrderNotFound(res);

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id) return res.status(400).json({ message: "Order ID is required" });

    const response = await cancelShiprocketOrder(id);
    const deletedOrder = await Order.findByIdAndUpdate(id, {
      orderStatus: status,
    });

    if (!deletedOrder) return handleOrderNotFound(res);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try{
    const { loginId, _id } = req.user;
    let userDetails = await User.findById(_id)
    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }
    let matchQuery = {
      userId: new mongoose.Types.ObjectId(req.user._id)
    }
    const agg = [
      {
        $match: matchQuery
      },
      {
        $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData"
        }
      },
      {
        $unwind:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
          path: "$userData",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
          path: "$products",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $unwind:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
          path: "$productDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group:
        /**
         * _id: The id of the group.
         * fieldN: The first field name.
         */
        {
          _id: {
            orderId: "$orderId",
            productId: "$products.productId",
            quantity: "$products.quantity",
            price: "$products.price",
            totalPrice: "$products.totalPrice",
            totalMRP: "$totalMRP",
            discountAmount: "$discountAmount",
            donationAmount: "$donationAmount",
            totalAmount: "$totalAmount",
            shippingCost: "$shippingCost"
          },
          productDetails: {
            $first: "$productDetails"
          },
          shippingAddress: {
            $first: "$shippingAddress"
          },
          billingAddress: {
            $first: "$billingAddress"
          },
          shiprocketOrderId: {
            $first: "$shiprocketOrderId"
          },
          transactionId: {
            $first: "$transactionId"
          },
          paymentMethod: {
            $first: "$paymentMethod"
          },
          orderStatus: {
            $first: "$orderStatus"
          },
          shippingMethod: {
            $first: "$shippingMethod"
          },
          paidAt: {
            $first: "$paidAt"
          },
          isPaid: {
            $first: "$isPaid"
          },
          trackingId: {
            $first: "$trackingId"
          },
          paymentMethod: {
            $first: "$paymentMethod"
          },
          courierName: {
            $first: "$courierName"
          },
          estimatedDelivery: {
            $first: "$estimatedDelivery"
          },
          shippedAt: {
            $first: "$shippedAt"
          },
          deliveredAt: {
            $first: "$deliveredAt"
          },
          cancelledAt: {
            $first: "$cancelledAt"
          },
          cancellationReason: {
            $first: "$cancellationReason"
          },
          canceledBy: {
            $first: "$canceledBy"
          },
          returnRequest: {
            $first: "$returnRequest"
          },
          returnReason: {
            $first: "$deliveredAt"
          },
          returnStatus: {
            $first: "$deliveredAt"
          },
          returnedAt: {
            $first: "$deliveredAt"
          },
          createdAt: {
            $first: "$createdAt"
          }
        }
      },
      {
        $sort:
        /**
         * Provide any number of field/order pairs.
         */
        {
          createdAt: 1
        }
      }
    ]
    const orders = await Order.aggregate(agg);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success : false ,data :[] });
    }
    return res.status(200).json({
      success: true,
      data : orders
    })
  }
  catch(error){
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: error.message });
  }
}