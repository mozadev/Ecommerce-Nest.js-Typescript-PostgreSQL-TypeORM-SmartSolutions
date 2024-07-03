import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";


export const GetUser = createParamDecorator(

    (data, ctx: ExecutionContext) => {

        // console.log({ ctx })

        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if (!user) {
            throw new InternalServerErrorException('User not found (request)')
        }
        return user;
    }
)
//ctx is the context of the request, ho is nest at this point in the application 
// If I send the autentication but I am not in  authenticated route, this won't work
// and it will be my mistake

