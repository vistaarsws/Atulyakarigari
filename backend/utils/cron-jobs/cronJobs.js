import cron from "node-cron";
import { sendCartReminderEmail } from "../../controllers/addToCard.controller.js";
import Cart from "../../models/addToCart.js";

const sendAbandonedCartEmails = async () => {
    try {
        console.log("Running abandoned cart reminder job...");

        // Find carts older than 24 hours
        const abandonedCarts = await Cart.find({ updatedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } });

        for (const cart of abandonedCarts) {
            await sendCartReminderEmail(cart.user, cart);
        }

        console.log("Abandoned cart emails sent successfully!");
    } catch (error) {
        console.error("Error sending abandoned cart emails:", error);
    }
};

// Schedule cron job to run every day at 8 AM
// cron.schedule("0 8 * * *", sendAbandonedCartEmails, {
//     scheduled: true,
//     timezone: "Asia/Kolkata"
// });

// console.log("Scheduled abandoned cart email job set to run at 8 AM daily.");
