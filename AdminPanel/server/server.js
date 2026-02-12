let ex = require('express');
let path = require('path');
let cors = require('cors');
let app = ex();
let connection = require('./DB/db');
let router = require('./Routes/userRoute');
let User = require('./Schema/userSchema');
let Category = require('./Schema/categorySchema');
let categoryRouter = require('./Routes/categoryRoute');
let Menu = require('./Schema/menuSchema');
let menuRouter = require('./Routes/menuRoute');
let orderRouter = require('./Routes/orderRoute');

app.use(ex.json({ limit: '50mb' }));
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[Request Received] ${req.method} ${req.url}`);
    next();
});

// Seeding Function
const seedData = async () => {
    try {
        // Clear existing data to ensure schema consistency
        // await Category.deleteMany({});
        // await Menu.deleteMany({});
        // console.log("Cleared Categories and Menu Items");

        // Seed Users
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const users = [
                { name: 'Shraddha Kapoor', email: 'shraddha@star.com', role: 'Admin', status: 'Inactive', joinDate: '2025-10-10' },
                { name: 'Sydney Sweeney', email: 'sydney@hollywood.com', role: 'Customer', status: 'Inactive', joinDate: '2025-11-22' },
                { name: 'Viveons', email: 'viveons@ig.com', role: 'Admin', status: 'Inactive', joinDate: '2025-09-01' },
                { name: 'Alen Varughese', email: 'alen@dev.com', role: 'Customer', status: 'Inactive', joinDate: '2025-12-15' },
                { name: 'Patel Utsav', email: 'utsav@example.com', role: 'Customer', status: 'Inactive', joinDate: '2025-11-15' },
                { name: 'Virat Kohli', email: 'vk18@cricket.com', role: 'Customer', status: 'Inactive', joinDate: '2026-01-01' }
            ];
            await User.insertMany(users);
            console.log("Users seeded");
        }

        /*
        // 1. Seed Categories (Base)
        const categoriesData = [
            { name: 'Fast Food', icon: '🍔', menuItems: [] },
            { name: 'Italian', icon: '🍝', menuItems: [] },
            { name: 'Mexican', icon: '🌮', menuItems: [] },
            { name: 'Dessert', icon: '🍰', menuItems: [] }
        ];
        const createdCategories = await Category.insertMany(categoriesData);
        console.log("Categories seeded");

        // 2. Seed Menu Items
        const menuItemsData = [
            { name: 'Gourmet Burger', category: 'Fast Food', price: '14.99', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
            { name: 'Cheese Fries', category: 'Fast Food', price: '8.99', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80' },
            { name: 'Artisan Pizza', category: 'Italian', price: '18.50', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80' },
            // Carbonara with NO image (User Request)
            { name: 'Pasta Carbonara', category: 'Italian', price: '15.99', image: '' },
            { name: 'Tacos', category: 'Mexican', price: '12.99', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80' },
            { name: 'Cheesecake', category: 'Dessert', price: '7.99', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80' },
        ];
        const createdMenuItems = await Menu.insertMany(menuItemsData);
        console.log("Menu Items seeded");

        // 3. Link Menu Items to Categories
        for (const item of createdMenuItems) {
            await Category.findOneAndUpdate(
                { name: item.category },
                { $push: { menuItems: item._id } }
            );
        }
        console.log("Linked Items to Categories");
        */

    } catch (error) {
        console.error("Seeding error:", error);
    }
};

// Connect and Seed
connection()
    .then(() => {
        seedData();
    })
    .catch((err) => {
        console.error("Critical: Could not start seeding because database connection failed:", err.message);
    });

const apiRouter = ex.Router();
apiRouter.use('/users', router);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/menu', menuRouter);
apiRouter.use('/orders', orderRouter);

app.use('/api', apiRouter);

// Fallback for local dev if not using /api
app.use('/users', router);
app.use('/categories', categoryRouter);
app.use('/menu', menuRouter);
app.use('/orders', orderRouter);

const PORT = process.env.PORT || 5000;

// Serve static files from the React app
app.use(ex.static(path.join(__dirname, '../adminpanel/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../adminpanel/dist', 'index.html'));
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
