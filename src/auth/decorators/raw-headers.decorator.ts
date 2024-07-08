import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";


export const RawHeaders = createParamDecorator(

    (data, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        return req.rawHeaders;
    } 
)
//ctx is the context of the request, ho is nest at this point in the application 
// If I send the autentication but I am not in  authenticated route, this won't work
// and it will be my m pos
