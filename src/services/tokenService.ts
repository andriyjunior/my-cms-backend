import jwt from "jsonwebtoken";
import "../configs/dotenv";

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
const INVITATION_SECRET_KEY = process.env.INVITATION_SECRET_KEY;

class TokenService {
  private readonly secretKey: string = SECRET_KEY!;
  private readonly refreshSecretKey: string = REFRESH_SECRET_KEY!;
  private readonly invitationSecretKey: string = INVITATION_SECRET_KEY!;
  readonly inviteTokenExpiresIn: string = "1h";
  readonly accessTokenExpiresIn: string = "1h";
  readonly refreshTokenExpiresIn: string = "7d";

  generateInvitationToken(email: string, organizationId: string) {
    return jwt.sign({ email, organizationId }, this.invitationSecretKey, {
      expiresIn: this.inviteTokenExpiresIn,
    });
  }

  generateAccessToken(userId: string) {
    return jwt.sign({ userId }, this.secretKey, {
      expiresIn: this.accessTokenExpiresIn,
    });
  }

  generateRefreshToken(userId: string) {
    return jwt.sign({ userId }, this.refreshSecretKey, {
      expiresIn: this.refreshTokenExpiresIn,
    });
  }

  decodeRefreshToken(token: string) {
    return jwt.verify(token, this.refreshSecretKey);
  }

  decodeAccessToken(token: string) {
    return jwt.verify(token, this.secretKey);
  }

  decodeInviteToken(token: string) {
    return jwt.verify(token, this.invitationSecretKey);
  }

  refreshAccessToken(refreshToken: string) {
    try {
      // Verify the refresh token
      const decodedRefreshToken = this.decodeRefreshToken(refreshToken) as {
        userId: string;
      };

      // Generate a new main token
      const newAccessToken = this.generateAccessToken(
        decodedRefreshToken.userId
      );

      // Generate a new refresh token
      const newRefreshToken = this.generateRefreshToken(
        decodedRefreshToken.userId
      );

      const expiresIn = this.getExpiresIn();

      return { newAccessToken, newRefreshToken, expiresIn };
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  }

  getExpiresIn() {
    return (
      Math.floor(Date.now() / 1000) + parseInt(this.accessTokenExpiresIn, 10)
    );
  }
}

export { TokenService };
export default new TokenService();
