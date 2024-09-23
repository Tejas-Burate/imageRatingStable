import jwt from "jsonwebtoken"

const generateJwtToken = async (userInfo: object) => {
    return jwt.sign({ userInfo }, process.env.Jwt_Secret_Key as string, { expiresIn: process.env.Expiration_Time as string })
}

export default generateJwtToken;