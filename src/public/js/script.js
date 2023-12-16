const data = JSON.parse(sessionStorage.getItem("user"));
const btnUsername = document.getElementById("btnUsername");
const btnCart = document.getElementById("btnCart");
btnUsername.innerHTML = data._doc.firstName

btnCart.addEventListener("click",()=>{
    const cart_id = data._doc.cart;
    location.href = `/cart/${cart_id}`;
})
