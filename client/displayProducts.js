let root = document.getElementById("root")

async function fetchAll(){
    let res = await fetch("/api/products");
    let data = await res.json();
    displayAll(data)
    updateCounter()
}

async function updateCounter(){
    try{
        let res = await fetch(`/api/cart`)
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json()
         console.log("Cart response:", data);
        let cartCounter=document.getElementById("cartCounter")
        //console.log(data.cart.length)
        if(cartCounter){
            cartCounter.textContent=data.length
        }
    } catch(err){
        console.log(err)
    }

}

function displayAll(data){
    //     <div class="card" style="width: 18rem;">
    // <img src="..." class="card-img-top" alt="...">
    // <div class="card-body">
    //     <h5 class="card-title">Card title</h5>
    //     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
    //     <a href="#" class="btn btn-primary">Go somewhere</a>
    // </div>
    // </div>

    // ROW
    const row = document.createElement("div")
    row.classList.add("row", "g-3") // g-3 = gap

    for(let product of data.products){
        const col = document.createElement("div")
        col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3")

        console.log(product)
        let card = document.createElement("div")
        card.classList.add("card", "h-100")
        let img = document.createElement("img")
        img.src = "/images/" + product.image
        let body = document.createElement("div")
        body.classList.add("card-body")
        let h5 = document.createElement("h5")
        h5.classList.add("card-title")
        h5.textContent=product.name
        let h6 = document.createElement("h6")
        h6.classList.add("card-text")
        h6.textContent=product.description
        let p = document.createElement("p")
        p.classList.add("card-text")
        p.textContent=product.price + "Ft"
        let button = document.createElement("button")
        button.classList.add("btn", "btn-primary")
        button.textContent="To cart"
        button.dataset.id = product.id;
        body.appendChild(h5)
        body.appendChild(h6)
        body.appendChild(p)
        body.appendChild(button)
        card.appendChild(img)
        card.appendChild(body)
        col.appendChild(card)
        row.appendChild(col)
    }

    root.appendChild(row)
}

root.addEventListener("click", async function(e) {

    if(e.target.textContent == "To cart"){

        const id = e.target.dataset.id;

        const res = await fetch("/api/cart", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: Number(id) })
});

const data = await res.json();

if (data.message) {
    alert(data.message); // "Already in cart"
} else {
    alert("Added to cart");
    updateCounter()
}
    }
})

document.getElementById("cartBtn").addEventListener("click", function () {
    window.location.href = "/cart.html";
});


async function loadAboutUs(){
    const res = await fetch("aboutus/aboutus.html")
    if(res.ok){
        const html = await res.text()
        document.getElementById("aboutus").innerHTML=html
    }else{
        document.getElementById("aboutus").innerHTML="<p>Az oldal nem található.</p>;"
    }
}

async function loadFooter(){
    const res = await fetch("footer/footer.html")
    if(res.ok){
        const html = await res.text()
        document.getElementById("footer").innerHTML=html
        updateCounter()
    }else{
        document.getElementById("footer").innerHTML="<p>Az oldal nem található.</p>;"
    }
}

fetchAll()
loadAboutUs()
loadFooter()