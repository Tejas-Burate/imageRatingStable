import Log from "../../api/log/logModel";
import jwt from "jsonwebtoken";
import authModel from "../../api/auth/authModel";
import { Request, Response, NextFunction } from 'express';

interface JwtPayload {
  userId: string;
}

const requestLogger = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log('token', token)
  const deviceInfo = req.headers["user-agent"] || "Unknown device";
  const loginEndpoints = ["/auth/login", "/studentRegistration/login", "/auth/googleAuthLogAndRegister"]; // Add your additional login route here

  const isLoginApi = loginEndpoints.includes(req.originalUrl);

  let user = null;
  let statusCode = null;

  try {
    if (token && !isLoginApi) {
      const decoded = jwt.verify(token, process.env.Jwt_Secret_Key as string) as JwtPayload;
      user = await authModel.findOne({ _id: decoded.userId });
      const logEntry = new Log({
        userId: user ? user._id : null,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        headers: req.headers,
        body: req.body,
        device: deviceInfo,
      });
      await logEntry.save();
      next();
      return;
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    statusCode = 401;
  }

  const logEntry = new Log({
    userId: user ? user._id : null,
    method: req.method,
    url: req.originalUrl,
    statusCode: statusCode || res.statusCode, // Capture status code from response or set earlier error status
    headers: req.headers,
    body: req.body,
    device: deviceInfo,
  });

  try {
    await logEntry.save();
  } catch (error) {
    console.error("Failed to log request:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Failed to log request..." });
  }

  if (!isLoginApi && (!token || !user)) {
    return res
      .status(401)
      .json({ status: 401, message: "Unauthorized user..." });
  }

  next();
};

export default requestLogger;
