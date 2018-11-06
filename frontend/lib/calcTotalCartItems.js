export default function calcTotalCartItems(cart) {
  return cart.reduce((acc, cartItem) => {
    if (!cartItem.item) return acc;
    return acc + cartItem.quantity;
  }, 0);
}
