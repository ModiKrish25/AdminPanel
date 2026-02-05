const Menu = require('../Schema/menuSchema');
const Category = require('../Schema/categorySchema');

// GET all menu items
exports.getAllMenuItems = async (req, res) => {
    try {
        const items = await Menu.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST new menu item
exports.createMenuItem = async (req, res) => {
    const item = new Menu({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        image: req.body.image
    });

    try {
        const newItem = await item.save();

        // Add item reference to Category
        await Category.findOneAndUpdate(
            { name: req.body.category },
            { $push: { menuItems: newItem._id } }
        );

        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update menu item
exports.updateMenuItem = async (req, res) => {
    try {
        const { name, category, price, image } = req.body;
        const oldItem = await Menu.findById(req.params.id);

        if (!oldItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // If category changed, update Category collections
        if (oldItem.category !== category) {
            // Remove from old category
            await Category.findOneAndUpdate(
                { name: oldItem.category },
                { $pull: { menuItems: oldItem._id } }
            );
            // Add to new category
            await Category.findOneAndUpdate(
                { name: category },
                { $push: { menuItems: oldItem._id } }
            );
        }

        oldItem.name = name;
        oldItem.category = category;
        oldItem.price = price;
        oldItem.image = image;

        const updatedItem = await oldItem.save();
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE menu item
exports.deleteMenuItem = async (req, res) => {
    try {
        await Menu.findByIdAndDelete(req.params.id);

        // Remove item reference from Category
        await Category.updateMany(
            {},
            { $pull: { menuItems: req.params.id } }
        );

        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
