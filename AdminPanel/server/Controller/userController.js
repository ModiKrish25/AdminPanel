const User = require('../Schema/userSchema');

// GET all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// SIGNUP (Create User)
exports.signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            name: fullName,
            email,
            password,
            role: "Customer", // Default role
            status: "Active",
            joinDate: new Date().toISOString().split('T')[0]
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Set status to Active
        user.status = "Active";
        await user.save();

        res.json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGOUT
exports.logout = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Logout requested for:", email);
        const user = await User.findOne({ email });

        if (user) {
            console.log("User found, updating status to Inactive");
            user.status = "Inactive";
            await user.save();
            console.log("User status updated");
        } else {
            console.log("User not found for logout");
        }

        res.json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// DELETE user by ID
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
