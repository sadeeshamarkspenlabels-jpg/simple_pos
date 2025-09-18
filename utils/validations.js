import {z} from "zod";

export const loginValidations = z.object({
  username: z.string().nonempty("Username is Required"),
  password: z.string().nonempty("Password is Required")
})

export const productValidate = z.object({
  name: z.string().nonempty("Name is Required"),
  price: z.string().nonempty("Price is Required"),
  stock: z.string().nonempty("Stock is Required")
})

export const userValidate = z.object({
  username: z.string().nonempty("Username is Required"),
  password: z.string().nonempty("Password is Required"),
  role: z.string().nonempty("Role is Required")
})