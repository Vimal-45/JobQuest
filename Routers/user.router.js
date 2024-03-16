import express from 'express'
import { deleteNotes, getAllNotes, getUserNotes, resetPassword, updateNotes, updateUser, userAddNotes, userLogin, userRegistration } from '../Controller/user.controller.js'
import authMiddleware from '../Middleware/auth.middleware.js'
import { emailSender } from '../Middleware/Services/nodemailer.js'


const router = express.Router()

router.post('/registration', userRegistration)
router.post('/login', userLogin)
router.post('/forgot-password',emailSender) 
router.get('/notes',authMiddleware, getAllNotes)
router.get('/user/notes',authMiddleware, getUserNotes)
router.post('/add/notes', userAddNotes)
router.post('/reset-password', resetPassword) 
router.put('/update/notes/:id',authMiddleware, updateNotes)
router.put('/update/user',authMiddleware, updateUser)
router.delete('/delete/notes/:id',authMiddleware, deleteNotes)


export default router;