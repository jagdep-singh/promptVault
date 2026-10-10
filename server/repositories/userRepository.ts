import Users from '../models/Users.js'

export async function createUser(userData: { name: string; email: string; password: string }) {
    return await Users.create(userData)
}

export async function findUserByEmail(email: string) {
    return await Users.findOne({ email }).select('password')
}

export async function findUserById(id: string) {
    return await Users.findById(id)
}