import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/constants";

export const castAndDecodeToken = (stringToken: string) : any => {
    try {
        const tokenService = new JwtService({secret : jwtConstants.secret })
        return tokenService.decode(stringToken.split(" ")[1])
    } catch (error) {
        console.log(error)
        return null
    }
}