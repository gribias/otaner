import Order from "../mongodb/models/order.js";
import Product from "../mongodb/models/product.js";
import User from "../mongodb/models/user.js";

import mongoose from "mongoose";
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET

// });

// const getAllProducts = async (req, res) => {

//     const {_end, _order, _start, _sort, reference_like = "", 
//     material=""} = req.query;

//     const query = {};

//     if(material !== ''){
//         query.material= material;
//     }

//     if(reference_like){
//         query.reference = { $regex: reference_like, $options: 'i'};
//     }

//     try {

//         const count = await Product.countDocuments({query});
        
//         const products = await Product
//         .find(query)
//         .limit(_end)
//         .skip(_start)
//         .sort({ [_sort]: _order })

//         res.header('x-total-count', count);
//         res.header('Access-Control-Expose-Headers',
//         'x-total-count');




//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }

// };




// const getProductDetail = async(req, res) => {};

// const createOrder = async(req, res) => {

//     try {
//         const {cartItems,email} = req.body;
        
//             //Start a new session...
        
//             const session = await mongoose.startSession();
//             session.startTransaction();
//             const user = await User.findOne({email}).session(session);
        
//             if (!user) throw new Error(`User not found: ${email}`);
        
//             // const photoUrl = await cloudinary.uploader.upload(photo);

//             const orderItems = [];

//             for (const item of cartItems) {
//                 const { reference, material, quantity, cost, photo } = item;
//                 const orderItem = new Order({
//                     reference,
//                     material,
//                     quantity,
//                     cost,
//                     photo,
//                     creator: user._id
//                 });
//                 await orderItem.save({ session });
//                 orderItems.push(orderItem._id);
//             }
           
//             const newOrder = await Order.create({
//             items: orderItems,
//             creator: user._id
//             });
        
//             // user.allOrders.push(newOrder._id);
//             // await user.save({ session });
// try {
//     if (typeof user !== "undefined" && Array.isArray(user.allOrders)) {
//         user.allOrders.push(newOrder._id);
//         await user.save({ session });
//       }
// } catch (error) {
//     throw new Error(error);
// }
//             // if (typeof user !== "undefined" && Array.isArray(user.allOrders)) {
//             //     user.allOrders.push(newOrder._id);
//             //     await user.save({ session });
//             //   } else {
//             //     throw new Error("Invalid user or allOrders property");
//             //   }
              
        
//             await session.commitTransaction();
        
//             res.status(200).json({ message:' Order created successfully'});
        
//     } catch (error) {
//         res.status(500).json({ message: error.message});
//     }
   
// };
const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
   

    // Find the order by its ID
    const order = await Order.findOne({ orderNumber: id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log(order.products, 'order.products')

    // Populate each product within the products array
    const populatedProducts = await Promise.all(
      order.products.map(async (product) => {
        const populatedProduct = await Product.populate(product, {
          path: '_id',
          select: 'reference material quantity cost photo description',
        });
        return populatedProduct;
      })
    );

    console.log(populatedProducts, 'populatedProducts')

    // console.log(populatedProducts, 'populatedProducts')

    // Create a map to store the summed quantities and costs for products with the same product and size
    // const summedData = new Map();

    // Iterate through the products and sum the quantities and costs
    // populatedProducts.forEach((product) => {
    //   const key = `${product.product._id}_${product.size}`;
    //   if (summedData.has(key)) {
    //     const existingData = summedData.get(key);
    //     existingData.quantity += product.quantity;
    //     existingData.cost += product.cost;
    //   } else {
    //     summedData.set(key, {
    //       quantity: product.quantity,
    //       cost: product.cost
    //     });
    //   }
    // });

       // Create a map to store the summed quantities for products with the same product and size
       const summedQuantities = new Map();

       // Iterate through the products and sum the quantities
       populatedProducts.forEach((product) => {
         const key = `${product._id}_${product.size}`;
         if (summedQuantities.has(key)) {
           const existingQuantity = summedQuantities.get(key);
           existingQuantity += product.quantity;
           summedQuantities.set(key, existingQuantity);
         } else {
           summedQuantities.set(key, product.quantity);
         }
       });
   
     //  console.log(summedQuantities, 'summedQuantities')

        // Update the quantities in the products array
    populatedProducts.forEach((product) => {
      const key = `${product._id}_${product.size}`;
      if (summedQuantities.has(key)) {
        const summedQuantity = summedQuantities.get(key);
        product.quantity = summedQuantity;
        summedQuantities.delete(key);
      }
    });

    console.log(populatedProducts, 'populatedProducts');

    // Create a new array to store the products with summed quantities and costs
    // const summedProducts = [];

    // // Iterate through the products and create new objects with summed quantities and costs
    // populatedProducts.forEach((product) => {
    //   const key = `${product.product._id}_${product.size}`;
    //   if (summedData.has(key)) {
    //     const summedDataObj = summedData.get(key);
    //     const summedProduct = {
    //       ...product,
    //       quantity: summedDataObj.quantity,
    //       cost: summedDataObj.cost
    //     };
    //     summedProducts.push(summedProduct);
    //     summedData.delete(key);
    //   }
    // });

    // Replace the products array with the summed products
    // order.products = summedProducts;

console.log(order, 'order')
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





const getOrders = async (req, res) => {
  try {
    const { _start = 0, _end = 10, _sort = 'id', _order = 'asc', creator, orderNumber, orderNumber_like } = req.query;
    const sort = _order === 'asc' ? _sort : `-${_sort}`;

    const query = {};

    if (orderNumber) {
      query.orderNumber = orderNumber;
    }

    if (orderNumber_like) {
      query.orderNumber = { $regex: orderNumber_like, $options: 'i' };
    }

    if (creator) {
      
      // Find the User document by email address
      const user = await User.findOne({ email: creator });
      // If the user exists, use their ObjectId as the creator in the query
      if (user) {
        query.creator = user._id;
      } else {
        // If the user doesn't exist, return an empty array since there won't be any matching orders
        return res.status(200).json([]);
      }
    }

    const orders = await Order.find(query)
      .populate({
        path: 'products._id',
        select: 'reference cost'
      })
      .sort(sort)
      .skip(Number(_start))
      .limit(Number(_end) - Number(_start));

      orders.forEach((order) => {
        console.log("Order ID:", order._id);
        console.log("Order Number:", order.orderNumber);
        console.log("Populated Products:", order.products);
        console.log("--------------------");
      });

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


const createOrder = async (req, res) => {
  try {
    const { cartItems, email, Total, NumberArticles, note } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    const user = await User.findOne({ email }).session(session);
    if (!user) throw new Error(`User not found: ${email}`);

    const orderItems = [];
    const totalGramsByType = {}; // Object to store total grams by type

    for (const item of cartItems) {
      const { reference, material, quantity, cost, photo, size } = item;

      for (const [materialType, materialDetails] of Object.entries(material)) {
        const grams = parseFloat(materialDetails.grams) || 0; // Parse the grams value to a number, fallback to 0 if it's NaN
      
        // Update total grams by type
        if (totalGramsByType[materialType]) {
          totalGramsByType[materialType] += grams * quantity; // Multiply grams by quantity for each item
        } else {
          totalGramsByType[materialType] = grams * quantity; // Multiply grams by quantity for each item
        }
      }
      
    }

    console.log(cartItems,"cartItems")

    const orderNumber = `ORD${Date.now()}`;

    const productIds = cartItems.map((cartItem) => cartItem.id);

    const products = await Product.find({ _id: { $in: productIds } });

    // Update size property in each product based on cartItems
cartItems.forEach(cartItem => {
  const product = products.find(p => p.reference === cartItem.reference);
  if (product) {
    product.size = cartItem.size;
  }
});


    console.log(products,"products")


    const newOrder = await Order.create({
      _id: new mongoose.Types.ObjectId(), // generate new ObjectId for _id field
      orderNumber: orderNumber,
      user: user._id,
      orderDate: new Date(),
      products: products, // Use the original cartItems array in the order
      creator: user._id,
      Total: Total,
      NumberArticles: NumberArticles,
      note: note, // Add the note field to the order
      grams: totalGramsByType, // Add the total grams by type to the order
      status: {
        text: "Pending",
        dateStarted: "",
        dateFinished: "",
        userStarted: "",
        userFinished: "",
      },
    });

    try {
      if (typeof user !== "undefined" && Array.isArray(user.allOrders)) {
        user.allOrders.push(newOrder._id);
        await user.save({ session });
      }
    } catch (error) {
      throw new Error(error);
    }

    await session.commitTransaction();

    res.status(200).json({ message: "Order created successfully", orderNumber: orderNumber });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const updateOrder = async(req, res) => {

  try {
      const { id } = req.params;
      const { status} = req.body;
  
      await Order.findByIdAndUpdate({ _id: id }, {
        status
      });
  
      res.status(200).json({ message: 'Encomenda atualizada' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
  
  };




// const updateProduct = async(req, res) => {};
// const deleteProduct = async(req, res) => {};

export {
   // getAllProducts,
    getOrderDetail,
    createOrder,
    getOrders,
    updateOrder
    //updateProduct,
    //deleteProduct
}