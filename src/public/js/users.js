const table = document.getElementById('userTable'); // Cambia el nombre de la tabla según corresponda

// Función para eliminar un usuario
const deleteUser = (id) => {
    console.log(id);
    fetch(`/api/users/${id}`, {
        method: 'DELETE',
    })
        .then((result) => {
            if (result.ok) {
                alert('Usuario eliminado con éxito!');
            } else {
                throw new Error('Error al eliminar el usuario');
            }
        })
        .then(() => fetch('/api/users')) // Recargar la lista de usuarios
        .then((result) => result.json())
        .then((users) => {
            socket.emit('userList', users); // Emitir la lista de usuarios actualizada
        })
        .catch((error) => alert(`Ocurrió un error: ${error}`));
};

// Función para cambiar el rol de un usuario
const changeUserRole = (id, newRole) => {
    const bodyNewRole = {
        role: newRole
    };
    fetch(`/api/users/premium/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyNewRole),
    })
        .then((result) => {
            if (result.ok) {
                alert('Rol de usuario actualizado con éxito!');
            } else {
                return result.json().then(data => {
                    if (data.error) {
                        alert(`Error: ${data.error}`);
                    } else {
                        alert('Error desconocido');
                    }
                    throw new Error(`Error en la solicitud. Código de estado HTTP: ${result.status}`);
                });
            }
        })
        .then(() => fetch('/api/users'))
        .then((result) => result.json())
        .then((users) => {
            socket.emit('userList', users);
        })
        .catch((error) => alert(`Ocurrió un error: ${error}`));
};