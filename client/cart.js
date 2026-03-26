const productList = document.getElementById("productList");

window.onload = loadCart;

// LOAD CART
async function loadCart() {
  try {
    const res = await fetch("/api/cart");
    const cart = await res.json();

    productList.innerHTML = "";

    cart.forEach(item => {
      const li = document.createElement("li");

      li.textContent = item.name + " " + item.price + "Ft" ;

      const btn = document.createElement("button");
      btn.textContent = "Remove";

      btn.onclick = async () => {
        await fetch("/api/cart/" + item.id, {
          method: "DELETE"
        });

        loadCart();
      };

      li.appendChild(btn);
      productList.appendChild(li);
    });

  } catch {
    productList.innerHTML = "Error loading cart";
  }
}

document.getElementById("backBtn").addEventListener("click", function () {
    window.location.href = "/displayProducts.html";
});