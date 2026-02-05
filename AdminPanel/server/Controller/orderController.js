const Order = require('../Schema/orderSchema');
const User = require('../Schema/userSchema');
const Menu = require('../Schema/menuSchema');

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const { userId, userName, userEmail, items, amount, address } = req.body;

        const newOrder = new Order({
            userId,
            userName,
            userEmail,
            items,
            amount,
            address
        });

        await newOrder.save();
        res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get orders for a specific user
exports.getUserOrders = async (req, res) => {
    try {
        const { email } = req.params;
        const orders = await Order.find({ userEmail: email }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Get User Orders Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// Get all orders (for Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Get All Orders Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, message: "Order status updated", order });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Dashboard Data (Analytics)
exports.getDashboardData = async (req, res) => {
    try {
        const orders = await Order.find();
        const usersCount = await User.countDocuments();
        const menuItemsCount = await Menu.countDocuments();

        // Total Revenue
        const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

        // Total Orders
        const totalOrders = orders.length;

        // Pending Orders (no longer sent as primary stat, but we keep the logic if needed for something else)
        // const pendingOrders = orders.filter(o => o.status === 'Order Placed' || o.status === 'Preparing').length;

        // Recent Orders (last 5)
        const recentOrders = await Order.find().sort({ date: -1 }).limit(5);

        // Popular Categories (Simplistic aggregation)
        // Since category is in Menu schema but not directly in Order items, 
        // we'll fetch all items and group them.
        const menuItems = await Menu.find();
        const itemCategoryMap = {};
        menuItems.forEach(item => {
            itemCategoryMap[item._id.toString()] = item.category;
        });

        const categorySales = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const category = itemCategoryMap[item.id] || 'Unknown';
                categorySales[category] = (categorySales[category] || 0) + (item.quantity || 1);
            });
        });

        const popularCategories = Object.keys(categorySales).map(name => ({
            name,
            sales: categorySales[name]
        })).sort((a, b) => b.sales - a.sales).slice(0, 5);

        // Revenue Trends (Mocking slightly or grouping by month)
        // For now, let's do a basic grouping by month
        const revenueTrends = [];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentYear = new Date().getFullYear();

        const monthlyRevenue = {};
        orders.forEach(order => {
            const date = new Date(order.date);
            if (date.getFullYear() === currentYear) {
                const month = months[date.getMonth()];
                monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.amount;
            }
        });

        // Fill in last 7 months
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = months[d.getMonth()];
            revenueTrends.push({
                name: monthName,
                revenue: monthlyRevenue[monthName] || 0
            });
        }

        res.json({
            success: true,
            stats: {
                totalRevenue: `₹${totalRevenue.toLocaleString()}`,
                totalOrders: totalOrders.toString(),
                totalItems: menuItemsCount.toString(),
                newCustomers: usersCount.toString()
            },
            recentOrders,
            popularCategories,
            revenueTrends
        });
    } catch (error) {
        console.error("Dashboard Data Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
