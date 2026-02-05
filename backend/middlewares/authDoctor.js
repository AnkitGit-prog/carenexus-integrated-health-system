import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    // Support both Authorization: Bearer <token> and custom header: token
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let dtoken = null;

    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      dtoken = authHeader.split(' ')[1];
    }

    if (!dtoken) {
      dtoken = req.headers.token;
    }

    if (!dtoken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);

    req.docId = token_decode.id;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

export default authDoctor;