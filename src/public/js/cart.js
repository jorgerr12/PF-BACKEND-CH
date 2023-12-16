const deletedProductToCart = document.querySelectorAll(".deletedProductToCart");
const btnPurchase = document.getElementById("btnPurchase")

deletedProductToCart.forEach(buttton => {
    buttton.addEventListener("click", async () => {
        const cid = btnPurchase.getAttribute("data-cartId");
        const pid = buttton.getAttribute("data-pId");
        const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            const responseData = await response.json();
            Swal.fire({
                text: responseData.message,
                icon: responseData.status,
                confirmButtonText: "Ok",
                denyButtonText: `Don't save`
            }).then((result) => {
                if (result.isConfirmed) {
                    location.href = `/cart/${cid}`
                }
            });


        }

    })
})

btnPurchase.addEventListener("click", async () => {
    const cid = btnPurchase.getAttribute("data-cartId");
    btnPurchase.setAttribute("disabled","")
    btnPurchase.innerHTML=`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span class="sr-only"></span>
    Finalizar Compra`
    const response = await fetch(`/api/carts/purchase/${cid}`, {
        method: 'POST'
    });
    if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.pursacheProducts)
        Swal.fire({
            text: `su orden de compra se realizo con exito! numero de orden:${responseData.ticket.code} `,
            html:`
            <div>
            <h4>su orden de compra se realizo con exito! numero de orden:${responseData.ticket.code}</h4>
            <p>========================</p>
            <h5>Productos:</h5>
            <br>
            <ul>
              ${responseData.pursacheProducts.map(item =>{
                return `<li>${item.product.title} - cant: ${item.quantity}</li>`
              })}
            </ul>
            <br>
            <h2>TOTAL :S/${responseData.ticket.amount}</h2>
          </div>
            `,
            icon: responseData.status,
            confirmButtonText: "Ok",
            denyButtonText: `Don't save`
        }).then((result) =>{
            if (result.isConfirmed) {
                location.href = `/products`
            }
        });
    }

})
