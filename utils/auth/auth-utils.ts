import jwt from "jsonwebtoken";

export const generateJwtToken = (
  userId: string,
  email: string,
  nickname: string,
  emoji: string
): string => {
  const secretKey = process.env.JWT_SECRET_KEY; // 환경변수에서 비밀키 가져오기
  if (!secretKey) {
    throw new Error("JWT_SECRET_KEY 환경 변수가 설정되지 않았습니다.");
  }

  // JWT 생성 (예: 1시간 만료)
  const payload = { sub: userId, email, nickname, emoji };

  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

  return token;
};
