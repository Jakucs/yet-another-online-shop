/* import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { readFile, writeFile } from "fs/promises";

const app = express();
const PORT = 4000;


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PRODUCTS_FILE = path.join(__dirname, "products.json")
const CART_FILE = path.join(__dirname, "cart.json")


app.use(express.json())
app.use(express.static(path.join(__dirname, "../client")))
app.use("/images", express.static(path.join(__dirname, "images")));




app.get("/api/products", async (req, res) => {
    let file = await readFile(PRODUCTS_FILE, "utf-8")
    let data = JSON.parse(file)
    res.json(data)
} )





app.get("/api/cart", async(req, res) => {
    let file = await readFile(CART_FILE, "utf-8")
    let data = JSON.parse(file)
    res.json(data)
})

app.post("/api/cart", async (req, res) => {
    let id = req.body.id
    //termék beolvasás
    let productsFile = await readFile(PRODUCTS_FILE, "utf-8")
    let productsData = JSON.parse(productsFile)

    let cartFile = await readFile(CART_FILE, "utf-8")
    let cartData = JSON.parse(cartFile)

    let currentData = productsData.products.find(product=>product.id==id)
    cartData.cart.push(currentData)

    await writeFile(CART_FILE, JSON.stringify(cartData, null, 2), "utf-8")
    res.json()

})






// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); */



import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const PORT = 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_FILE = path.join(__dirname, "products.json");
const CART_FILE = path.join(__dirname, "cart.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));
app.use("/images", express.static(path.join(__dirname, "images")));

// PRODUCTS
function readProducts() {
  const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
  return JSON.parse(data);
}

// CART
function readCart() {
  const data = fs.readFileSync(CART_FILE, "utf-8");
  return JSON.parse(data).cart;
}

function writeCart(cart) {
  fs.writeFileSync(CART_FILE, JSON.stringify({ cart }, null, 2));
}

// GET PRODUCTS
app.get("/api/products", (req, res) => {
  try {
    res.json(readProducts());
  } catch (err) {
    res.status(500).json({ error: "Failed to load products" });
  }
});

// ADD TO CART
app.post("/api/cart", (req, res) => {
  try {
    const { id } = req.body;

    const products = readProducts().products;
    const product = products.find(p => p.id == id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const cart = readCart();

    const exists = cart.find(item => item.id == id);

    if (exists) {
      return res.json({ message: "Already in cart" });
    }

    cart.push(product);

    writeCart(cart);

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Cart add failed" });
  }
});

// GET CART
app.get("/api/cart", (req, res) => {
  try {
    res.json(readCart());
  } catch {
    res.status(500).json({ error: "Failed to load cart" });
  }
});

// REMOVE FROM CART
app.delete("/api/cart/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    let cart = readCart();
    cart = cart.filter(item => item.id !== id);

    writeCart(cart);

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});