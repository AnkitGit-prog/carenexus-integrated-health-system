import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    // Support both Authorization: Bearer <token> and custom header: token
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = null;

    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      token = req.headers.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = token_decode.id;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

export default authUser;