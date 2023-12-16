const btnAddToCart = document.getElementById("btnAddToCart");


btnAddToCart.addEventListener("click",async()=>{
   const cart_id = btnAddToCart.getAttribute("data-cartId");
   const product_id = btnAddToCart.getAttribute("data-productId")
   
   const response = await fetch(`/api/carts/${cart_id}/product/${product_id}`, {
    method: 'POST'
});
   
    if(response.ok){
        const responseData = await response.json();
        Swal.fire({
            text: responseData.message,
            icon: responseData.status
          });
    }
})

