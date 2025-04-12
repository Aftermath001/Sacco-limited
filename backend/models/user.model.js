import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Password is required"],
      unique: true,
      lowercase:true,
      trim:true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be atleast 6 characters long"],
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);



// Pre-save hook to hash password be4 saving to dB
userSchema.pre("save", async function(next){
    if (!this.isModified("password"))return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }

})

// Compare password if its valid or not 
userSchema.methods.comparePassword = async function (password){
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;
