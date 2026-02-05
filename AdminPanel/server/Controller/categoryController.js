const Category = require('../Schema/categorySchema');

// Styles cycling for new categories
const styles = [
    { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-600' },
    { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-600' },
    { bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'text-yellow-600' },
    { bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-600' },
    { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600' },
    { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600' }
];

// Default emojis if none provided
const emojis = ['🍽️', '🥘', '🥗', '🍖', '🍱', '🍛', '🍜', '🍝'];

// GET all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('menuItems');

        // Map over categories to add dynamic styles and count
        const processedCategories = categories.map((cat, index) => {
            const style = styles[index % styles.length]; // Cycle through styles
            return {
                ...cat.toObject(),
                count: `${cat.menuItems ? cat.menuItems.length : 0} Items`,
                bg: style.bg,
                border: style.border,
                text: style.text
            };
        });

        res.json(processedCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST new category
exports.createCategory = async (req, res) => {
    try {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        const category = new Category({
            name: req.body.name,
            icon: req.body.icon || randomEmoji,
            menuItems: []
        });

        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE category
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
