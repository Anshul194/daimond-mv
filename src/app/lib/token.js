import jwt from 'jsonwebtoken';

export const Token = {
  generateTokens(user) {
    const userId = user._id.toString();

    // Long-lived access and refresh tokens (e.g., 30 days)
    const accessTokenExp = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    const refreshTokenExp = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30d'
    });

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '30d'
    });

    return { accessToken, refreshToken, accessTokenExp, refreshTokenExp };
  },

  setTokensCookies(res, accessToken, refreshToken, accessExp, refreshExp) {
    res.headers.set('Set-Cookie', [
      `accessToken=${accessToken}; Path=/; HttpOnly; Max-Age=${Math.floor((accessExp - Date.now()) / 1000)}; SameSite=Strict`,
      `refreshToken=${refreshToken}; Path=/; HttpOnly; Max-Age=${Math.floor((refreshExp - Date.now()) / 1000)}; SameSite=Strict`,
    ]);
  }
};
