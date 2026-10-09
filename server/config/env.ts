const requiredEnv = ['MONGO_URI', 'JWT_SECRET']

export function validateEnv() {
    const missingEnv = requiredEnv.filter((key) => !process.env[key])

    if (missingEnv.length > 0) {
        throw new Error(`missing env vars: ${missingEnv.join(', ')}`)
    }
}