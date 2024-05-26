async function obtenerProductos() {
    try {
        const response = await fetch("http://localhost:3000/products");
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        const data = await response.json();
        renderizarProductos(data);
    } catch (error) {
        console.log('Error al obtener los productos:', error);
    }
}

function renderizarProductos(productos) {
    const productosSection = document.querySelector('.productos_section');
    productosSection.innerHTML = ""; 

    productos.forEach((producto) => {
        const productCard = document.createElement('div');
        productCard.classList.add('card');
        productCard.dataset.id = producto.id; 

        const productImage = document.createElement('img');
        productImage.src = producto.image;
        productImage.alt = producto.name;

        const cardContent = document.createElement('div');
        cardContent.classList.add('card_content');

        const cardTitle = document.createElement('p');
        cardTitle.classList.add('card_title');
        cardTitle.textContent = producto.name;

        const cardValue = document.createElement('div');
        cardValue.classList.add('card_value');

        const cardPrice = document.createElement('p');
        cardPrice.classList.add('card_price');
        cardPrice.textContent = `$${producto.price}`;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete_button');
        deleteButton.dataset.id = producto.id; // Usar el ID real del producto

        const deleteIcon = document.createElement('img');
        deleteIcon.src = "./assets/icons8-basura.svg";
        deleteIcon.alt = "Eliminar";

        deleteButton.appendChild(deleteIcon);
        cardValue.appendChild(cardPrice);
        cardValue.appendChild(deleteButton);
        cardContent.appendChild(cardTitle);
        cardContent.appendChild(cardValue);
        productCard.appendChild(productImage);
        productCard.appendChild(cardContent);

        productosSection.appendChild(productCard);
    });
}

async function agregarProducto(producto) {
    try {
        const response = await fetch("http://localhost:3000/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        const nuevoProducto = await response.json();
        console.log('Producto agregado:', nuevoProducto);
        obtenerProductos();
    } catch (error) {
        console.log('Error al agregar el producto:', error);
    }
}

async function eliminarProducto(productId) {
    try {
        const response = await fetch(`http://localhost:3000/products/${productId}`, { 
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        console.log(`Producto con id ${productId} eliminado`);
        obtenerProductos(); 
    } catch (error) {
        console.log('Error al eliminar el producto:', error);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    obtenerProductos();

    const form = document.querySelector('.form_container');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const nombre = document.querySelector('[data-name]').value;
        const precio = document.querySelector('[data-price]').value;
        const imagen = document.querySelector('[data-image]').value;

        if (nombre && precio && imagen) {
            const nuevoProducto = {
                name: nombre,
                price: parseFloat(precio),
                image: imagen
            };
            agregarProducto(nuevoProducto); 
            form.reset(); 
        } else {
            console.log('Todos los campos son obligatorios');
        }
    });

    
    const productosSection = document.querySelector('.productos_section');
    productosSection.addEventListener('click', function(event) {
        if (event.target.closest('.delete_button')) {
            const button = event.target.closest('.delete_button');
            const productId = button.dataset.id; 
            eliminarProducto(productId);
            console.log(`Eliminar producto con id: ${productId}`);
        }
    });
});
