import {Router} from "express"
import auth ,{type AuthRequest} from "../middleware/auth.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { loginSchema, registerSchema } from "../validators/authSchema.js"
import validate from "../middleware/validate.js"
import { registerUser, loginUser, getCurrentUser } from "../services/AuthService.js"

const router = Router()

router.post("/signup",
    validate(registerSchema),
    asyncHandler(async (req, res) => {
        const result = await registerUser(req.body)
        res.status(201).json(result)
    })
)

router.post("/login",
    validate(loginSchema),
    asyncHandler(async (req, res) => {
        const result = await loginUser(req.body)
        res.status(200).json(result)
    })
)

router.get("/me",
    auth,
    asyncHandler(async (req: AuthRequest, res) => {
        const authReq = req as AuthRequest
        const user = await getCurrentUser(authReq.user!.id)
        res.status(200).json(user)
    })
)

export default router