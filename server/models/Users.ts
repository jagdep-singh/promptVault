import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

export interface User {
  name: string
  email: string
  password: string
  comparePassword: (password: string) => Promise<boolean>
}

const userSchema = new Schema<User>(
    {
        name:{
            type: String,
            required: true,
            maxlength: 50,
            trim: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password:{
            type: String,
            required: true,
            minlength: 8,
            select:false
        }
    }, { timestamps: true }
)

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return

    this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.comparePassword = function(password : string): Promise<boolean>{
    return bcrypt.compare(password, this.password)
}

userSchema.set('toJSON', {
    transform: (doc, ret: Record<string, any>) => {
        const { _id, __v, password, ...rest } = ret
        return {
            id: _id ? _id.toString() : rest.id,
            ...rest
        }
    }
})


const UserModel = models.User || model<User>('User', userSchema)
export default UserModel