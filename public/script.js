fetch("http://localhost:4001/api/products")
  .then((response) => response.json())
  .then((data) => {
    const productList = document.getElementById("product-list");
    data.forEach((product) => {
      const li = document.createElement("li");
      li.textContent = `${product.title} - ${product.desc} - ${product.price}kr`;
      productList.appendChild(li);
    });
  })
  .catch((error) => console.log("Problem att hitta produkt", error));
