const {
  validateId,
  registerUser,
  updateUser,
} = require("../services/user.service");

const { loginService } = require("../services/user.service");
const { getUserNicknameService } = require("../services/user.service");
const {
  InternalServerError,
  UserNotFoundError,
  InvalidInputError,
  UnauthorizedError,
} = require("../errors"); // 에러 클래스 가져오기

const logger = require("../logger");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config.json");

//로그인 ID 중복 확인 컨트롤러
/**
 * @swagger
 * /user/validate-id:
 *   post:
 *     summary: 로그인 ID의 중복을 확인합니다.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginId
 *             properties:
 *               loginId:
 *                 type: string
 *                 example: "john_doe"
 *     responses:
 *       200:
 *         description: ID 중복 확인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     isValid:
 *                       type: boolean
 *                       description: ID 사용 가능 여부
 *                       example: true
 *       400:
 *         description: 잘못된 요청 - 로그인 ID가 제공되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                       example: "INVALID_INPUT"
 *                     reason:
 *                       type: string
 *                       example: "로그인 ID가 제공되지 않았습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                       example: "INTERNAL_SERVER_ERROR"
 *                     reason:
 *                       type: string
 *                       example: "서버 오류가 발생했습니다."
 */
const validateIdController = async (req, res, next) => {
  logger.info("validateIdController 실행됨");

  const { loginId } = req.body;
  try {
    //response에는 요청한 loginId가 담긴다
    const response = await validateId(loginId);
    res.status(200).success(response);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//회원가입 컨트롤러
/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: 새로운 사용자를 등록합니다.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginId
 *               - password
 *             properties:
 *               loginId:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: 사용자 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     loginId:
 *                       type: string
 *                       example: "john_doe"
 *                     nickname:
 *                       type: string
 *                       example: "John"
 *                     color:
 *                       type: string
 *                       example: "#FF5733"
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: 잘못된 입력 - 로그인 ID 또는 비밀번호가 제공되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                       example: "INVALID_INPUT"
 *                     reason:
 *                       type: string
 *                       example: "로그인 ID 또는 비밀번호가 제공되지 않았습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                       example: "INTERNAL_SERVER_ERROR"
 *                     reason:
 *                       type: string
 *                       example: "서버 오류가 발생했습니다."
 */
const registerUserController = async (req, res, next) => {
  logger.info("registerUserController 실행됨");

  const { loginId, password } = req.body;

  if (loginId.trim() === "" || password.trim() === "") {
    return next(new InvalidInputError("아이디와 패스워드를 입력하세요."));
  }
  try {
    await validateId(loginId);
    //response에는 등록한 user가 담김
    const response = await registerUser({ loginId, password });
    const token = jwt.sign(
      {
        user_id: response.user_id,
        nickname: response.nickname,
        color: response.color,
        iat: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365, // 1 year in seconds
      },
      JWT_SECRET
    );
    const user = { ...response.dataValues, token };
    res.status(200).success(user);
  } catch (error) {
    logger.error(`Internal Server Error: ${error}`);
    return next(error);
  }
};

//별명 및 색상 설정 컨트롤러
/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: 사용자의 별명과 색상을 업데이트합니다.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nickname
 *               - color
 *             properties:
 *               nickname:
 *                 type: string
 *                 example: "Johnny"
 *               color:
 *                 type: string
 *                 example: "#33FF57"
 *     responses:
 *       200:
 *         description: 사용자 정보 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     nickname:
 *                       type: string
 *                       example: "Johnny"
 *                     color:
 *                       type: string
 *                       example: "#33FF57"
 *       400:
 *         description: 잘못된 입력 - 별명 또는 색상이 제공되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                       example: "INVALID_INPUT"
 *                     reason:
 *                       type: string
 *                       example: "별명 또는 색상이 제공되지 않았습니다."
 *       401:
 *         description: 인증 오류 - 토큰이 없거나 만료됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                       example: "UNAUTHORIZED"
 *                     reason:
 *                       type: string
 *                       example: "토큰이 없거나 만료되었습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                       example: "INTERNAL_SERVER_ERROR"
 *                     reason:
 *                       type: string
 *                       example: "서버 오류가 발생했습니다."
 */
const updateUserController = async (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError("토큰이 없거나 만료되었습니다"));
  }
  const userId = req.user.user_id;
  const { color, nickname } = req.body;

  if (color.trim() === "" || nickname.trim() === "") {
    return next(new InvalidInputError("색상과 닉네임을 입력해주세요"));
  }
  try {
    //response에는 업데이트한 user가 담김
    // 한번에 repository 접근함 ; convention에 어긋나지만 일단 유지
    const response = await updateUser({ userId, color, nickname });
    res.status(200).success(response);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: 사용자가 로그인합니다.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login_id
 *               - password
 *             properties:
 *               login_id:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     login_id:
 *                       type: string
 *                       example: "john_doe"
 *                     nickname:
 *                       type: string
 *                       example: "John"
 *                     color:
 *                       type: string
 *                       example: "#FF5733"
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: 잘못된 입력 - 로그인 ID 또는 비밀번호가 제공되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                       example: "INVALID_INPUT"
 *                     reason:
 *                       type: string
 *                       example: "로그인 ID 또는 비밀번호가 없습니다."
 *       401:
 *         description: 인증 실패 - 로그인 ID 또는 비밀번호가 틀렸음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                       example: "UNAUTHORIZED"
 *                     reason:
 *                       type: string
 *                       example: "로그인 ID 또는 비밀번호가 틀렸습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                       example: "INTERNAL_SERVER_ERROR"
 *                     reason:
 *                       type: string
 *                       example: "서버 오류가 발생했습니다."
 */
const login = async (req, res, next) => {
  const { login_id, password } = req.body;

  logger.info(`로그인 요청: ${login_id}`);

  if (login_id.trim() === "" || password.trim() === "") {
    // 로그인 ID 또는 비밀번호가 공백일 경우
    return next(new InvalidInputError("공백을 입력할 수 없습니다"));
  }

  if (!login_id || !password) {
    // 로그인 ID 또는 비밀번호가 없을 경우
    return next(
      new InvalidInputError("로그인 ID 또는 비밀번호가 존재하지 않습니다")
    );
  }
  try {
    const user = await loginService(login_id, password);

    if (user) {
      const token = jwt.sign(
        {
          user_id: user.user_id,
          nickname: user.nickname,
          color: user.color,
          iat: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365, // 1 year in seconds
        },
        JWT_SECRET
      );

      logger.info(`로그인 성공: ${login_id} ${user.nickname} ${token}`);

      const response = { ...user.dataValues, token };
      logger.info(`User: ${JSON.stringify(user, null, 2)}`);
      return res.status(200).success(response);
    } else {
      return next(
        new UnauthorizedError("로그인 ID 또는 비밀번호가 틀렸습니다.")
      );
    }
  } catch (error) {
    logger.error(`Internal Server Error: ${error}`);
    return next(new InternalServerError(error.message));
  }
};

/**
 * @swagger
 * /user/nickname/{user_id}:
 *   get:
 *     summary: 특정 사용자의 별명을 조회합니다.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 조회할 사용자의 ID
 *     responses:
 *       200:
 *         description: 별명 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     nickname:
 *                       type: string
 *                       example: "John"
 *       400:
 *         description: 잘못된 요청 - 사용자 ID가 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                       example: "INVALID_INPUT"
 *                     reason:
 *                       type: string
 *                       example: "잘못된 요청입니다."
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                       example: "USER_NOT_FOUND"
 *                     reason:
 *                       type: string
 *                       example: "사용자를 찾을 수 없습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     errorCode:
 *                       type: string
 *                       example: "INTERNAL_SERVER_ERROR"
 *                     reason:
 *                       type: string
 *                       example: "서버 오류가 발생했습니다."
 */
const getUserNickname = async (req, res, next) => {
  try {
    const user_id = parseInt(req.params.user_id);

    console.log("user_id", user_id);
    const user = await getUserNicknameService(user_id);

    if (user) {
      return res.status(200).success(user);
    } else {
      return next(new UserNotFoundError("사용자를 찾을 수 없습니다."));
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return next(new InternalServerError(error.message));
  }
};

module.exports = {
  login,
  getUserNickname,
  registerUserController,
  validateIdController,
  updateUserController,
};
