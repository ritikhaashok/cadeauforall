"use client";

export default function AddToCartButton({ product }) {
  const handleClick = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    alert(`${product.name} added to cart!`);
  };

  return (
    <button
      className="btn btn-sage px-6 py-2 rounded shadow"
      onClick={handleClick}
    >
      Add to Cart
    </button>
  );
}
