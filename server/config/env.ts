const requiredEnv = ['MONGO_URI', 'JWT_SECRET']

export function validateEnv() {
    const EnvMissing = requiredEnv.filter((key) => !process.env[key])

    if (EnvMissing.length > 0) {
        throw new Error(`missing env vars: ${EnvMissing.join(', ')}`)
    }
}