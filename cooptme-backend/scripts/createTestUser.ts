import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function createTestUser() {
    try {

        const user = await prisma.user.create({
            data: {
                email: 'augustin.cathy@gmail.com',
                password: '1234',
                name: 'Cathy',
                provider: 'email'
            }
        })

        console.log('Utilisateur test créé:', user)
    } catch (error) {
        console.error('Erreur lors de la création:', error)
    } finally {
        await prisma.$disconnect()
    }
}

createTestUser()