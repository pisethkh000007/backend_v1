import { Controller, Route, Post, Body } from "tsoa";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { ValidationError } from "../utils/errors/customErrors";
import { StatusCodes, ReasonPhrases } from "../utils/constands/statusCodes";
import crypto from "crypto";

const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
const clientId = "7hat5r7na6b13duec3ahels1kl"; // Replace with your Cognito User Pool Client ID
const clientSecret = "ehf724bteee1mbk435a0ieaoo0f6uurgvm1jstk6vibracv61c7"; // Replace with your Cognito User Pool Client Secret

// Function to generate the secret hash
function generateSecretHash(
  username: string,
  clientId: string,
  clientSecret: string
): string {
  return crypto
    .createHmac("SHA256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

@Route("api/v1/auth")
export class AuthController extends Controller {
  @Post("signup")
  public async signUp(
    @Body() requestBody: { name: string; password: string; email: string }
  ): Promise<any> {
    try {
      const { name, password, email } = requestBody;

      const secretHash = generateSecretHash(email, clientId, clientSecret);

      const command = new SignUpCommand({
        ClientId: clientId,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "name", Value: name },
        ],
        SecretHash: secretHash,
      });

      const response = await client.send(command);
      this.setStatus(StatusCodes.OK);
      return {
        status: StatusCodes.OK,
        message: "User signed up successfully",
        data: response,
      };
    } catch (error: any) {
      console.error("Error signing up user:", error);
      if (error.name === "InvalidParameterException") {
        throw new ValidationError("Invalid parameters provided");
      }
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: error.message,
      };
    }
  }

  @Post("signin")
  public async signIn(
    @Body() requestBody: { email: string; password: string }
  ): Promise<any> {
    try {
      const { email, password } = requestBody;

      const secretHash = generateSecretHash(email, clientId, clientSecret);

      const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          SECRET_HASH: secretHash,
        },
      });

      const response = await client.send(command);
      this.setStatus(StatusCodes.OK);
      return {
        status: StatusCodes.OK,
        message: "User signed in successfully",
        data: response,
      };
    } catch (error: any) {
      console.error("Error signing in user:", error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: error.message,
      };
    }
  }

  @Post("confirm-signup")
  public async confirmSignUp(
    @Body() requestBody: { email: string; confirmationCode: string }
  ): Promise<any> {
    try {
      const { email, confirmationCode } = requestBody;

      const secretHash = generateSecretHash(email, clientId, clientSecret);

      const command = new ConfirmSignUpCommand({
        ClientId: clientId,
        Username: email,
        ConfirmationCode: confirmationCode,
        SecretHash: secretHash,
      });

      const response = await client.send(command);
      this.setStatus(StatusCodes.OK);
      return {
        status: StatusCodes.OK,
        message: "User confirmed successfully",
        data: response,
      };
    } catch (error: any) {
      console.error("Error confirming user sign up:", error);
      if (error.name === "ExpiredCodeException") {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Expired confirmation code, please request a new code",
          error: error.message,
        };
      }
      if (error.name === "CodeMismatchException") {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Invalid verification code provided, please try again",
          error: error.message,
        };
      }
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: error.message,
      };
    }
  }

  @Post("resend-confirmation-code")
  public async resendConfirmationCode(
    @Body() requestBody: { email: string }
  ): Promise<any> {
    try {
      const { email } = requestBody;

      const secretHash = generateSecretHash(email, clientId, clientSecret);

      const command = new ResendConfirmationCodeCommand({
        ClientId: clientId,
        Username: email,
        SecretHash: secretHash,
      });

      const response = await client.send(command);
      this.setStatus(StatusCodes.OK);
      return {
        status: StatusCodes.OK,
        message: "Confirmation code resent successfully",
        data: response,
      };
    } catch (error: any) {
      console.error("Error resending confirmation code:", error);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        error: error.message,
      };
    }
  }
}
