import bcrypt from "bcrypt";

const hashPassword = async (password: string) => {

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword
}

export default hashPassword;