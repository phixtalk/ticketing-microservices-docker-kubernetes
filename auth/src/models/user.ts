import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the required properties to create a user
interface UserAttrs {
    email: string;
    password: string;
}

// An interface that describes the properties a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//the .pre is a middleware function in mongoose that executes the function 
// to the right, before the one to the left
userSchema.pre('save', async function(done){
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

//the .statics method is used to dynamically add methods to mongoose model
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };