const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Path to JSON file
const DB_FILE = path.join(__dirname, "laptops.json");

// Ensure JSON file exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, "[]");
}

// Helper function to read DB
async function readDB() {
  const data = await fs.readFile(DB_FILE, "utf8");
  return JSON.parse(data);
}

// Helper function to write DB
async function writeDB(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// --------------------------------------------------------
// 🚀 1) GET ALL LAPTOPS
// --------------------------------------------------------
app.get("/laptops", async (req, res) => {
  try {
    const laptops = await readDB();
    res.json(laptops);
  } catch (err) {
    res.status(500).json({ error: "Failed to read database" });
  }
});

// --------------------------------------------------------
// 🚀 2) ADD NEW LAPTOP
// --------------------------------------------------------
app.post("/laptops", async (req, res) => {
  try {
    const { name, config, price } = req.body;

    if (!name || !config || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const laptops = await readDB();

    const newLaptop = {
      id: Date.now().toString(),
      name,
      config,
      price
    };

    laptops.push(newLaptop);
    await writeDB(laptops);

    res.json({ message: "Laptop added successfully", laptop: newLaptop });

  } catch (err) {
    res.status(500).json({ error: "Failed to save laptop" });
  }
});

// --------------------------------------------------------
// 🚀 3) DELETE LAPTOP BY ID
// --------------------------------------------------------
app.delete("/laptops/:id", async (req, res) => {
  try {
    const laptopId = req.params.id;
    let laptops = await readDB();

    const newList = laptops.filter(lap => lap.id !== laptopId);

    await writeDB(newList);

    res.json({ message: "Laptop deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: "Failed to delete laptop" });
  }
});

// --------------------------------------------------------
// 🚀 SERVER START
// --------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
