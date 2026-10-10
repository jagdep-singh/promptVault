import Users from '../models/Users.js'

export function createUser(userData: { name: string; email: string; password: string }) {
    return Users.create(userData)
}

export function findUserByEmail(email: string) {
    return Users.findOne({ email }).select('password')
}

export function findUserById(id: string) {
    return Users.findById(id)
}