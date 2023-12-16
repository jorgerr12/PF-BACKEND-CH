import UsersDTO from "../dto/users.dto.js";
import userModel from "../models/users.model.js";
import { MailingController } from "./mailing.controller.js";





export class UserController {


    static async getUsers (req,res){
        try {
            const users = await userModel.find({});
            const filteredUsers = users.filter(user =>user.role !== "ADMIN");

            const usersDTO = filteredUsers.map(user => new UsersDTO(user))
            res.status(200).json(usersDTO)        
        } catch (error) {
            req.status(500).json("error al obtener usuarios:",error)
        }
    }

    static async changeRole (req,res){
        const uid = req.params.uid;
        const { role } = req.body;
        // Verifica que el rol proporcionado sea válido (usuario o premium)
        if (role !== 'usuario' && role !== 'premium') {
            return res.status(400).json({ error: 'Rol no válido' });
        }
        try {
            const user = await userModel.findOne({ _id: uid });
    
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
    
            if (user.status === 'active') {
                // Solo si el estado es 'active', se actualiza el rol
                user.role = role;
                await user.save();
                return res.status(200).json(user);
            } else {
                return res.status(400).json({ error: 'El usuario no tiene un estado activo.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static async uploadDocuments (req,res){
        const uid = req.params.uid;
        const { originalname, filename } = req.files;
    
        // Realiza la lógica para actualizar el usuario con el archivo subido
        try {
            const uploadedDocuments = req.files.map(file => {
                const nameWithoutExtension = file.originalname.split('.').slice(0, -1).join('.');
                return {
                    name: nameWithoutExtension,
                    reference: file.filename
                };
            });
    
            const user = await userModel.findOne({ _id: uid });
            if (user) {
                // Guarda los documentos en el usuario
                user.documents.push(...uploadedDocuments);
                await user.save();
    
                // Verifica si se han cargado los documentos requeridos
                const requiredDocuments = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"];
                const documentNames = await user.documents.map(doc => doc.name);
    
                const documentsMatched = requiredDocuments.every(doc => documentNames.includes(doc));
    
                if (documentsMatched) {
                    user.status = 'active';
                    await user.save();
                }
            }
    
            res.status(200).json({ message: 'Documentos cargados exitosamente.' });
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static async deleteInactiveUsers (req,res){
        const twoDaysAgo = new Date();
    // Comentar la siguiente linea para probar con la de 1 minuto, y viceversa.
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    try {
        // Email del administrador
        const adminEmail = config.adminEmail;
        // Busca y elimina a los usuarios que no han tenido conexión en los últimos 2 días
        const usersToDelete = await userModel.find({ last_connection: { $lt: twoDaysAgo }, email: { $ne: adminEmail } });
        // Obtener las direcciones de correo electrónico de los usuarios a eliminar
        const emailAddresses = usersToDelete.map(user => user.email);
        // Llama a la función deletedAccount para enviar notificaciones por correo electrónico
        const emailResults = await MailingController.sendDeletedAccount(emailAddresses) 
        // Luego, elimina a los usuarios.
        send
        const result = await userModel.deleteMany({ last_connection: { $lt: twoDaysAgo }, email: { $ne: adminEmail } });
        if (result.deletedCount > 0) {
            // Usuarios eliminados exitosamente.
            const response = { 
                message: 'Usuarios eliminados exitosamente.',
                emailResults: emailResults
            };
            res.status(200).json(response);
        } else {
            // No se encontraron usuarios para eliminar.
            const response = { 
                error: 'No se encontraron usuarios para eliminar.'
            };
            res.status(404).json(response);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
    }

    static async deleteUsers (req,res){
        const uid = req.params.uid;

        try {
            const user = await userModel.findOne({ _id: uid });
    
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
    
            // Verifica si el usuario es el administrador
            if (user.role === 'admin') {
                return res.status(400).json({ error: 'No puedes eliminar a un administrador' });
            }
            
            const emailAddress = [user.email]
    
            // Llama a la función deletedAccount para enviar notificaciones por correo electrónico
            const emailResults = await MailingController.sendDeletedAccount(emailAddress);
    
            const response = {
                message: 'Usuario eliminado con éxito',
                userDeleted: user.email
            }
    
            const result = await userModel.deleteOne({ _id: uid });
            
            // Si el usuario se ha eliminado exitosamente.
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

}