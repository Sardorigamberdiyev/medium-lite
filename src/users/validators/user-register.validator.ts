import Joi from 'joi';
import IUserRegisterDto from '../dto/user-register.dto';

const registerValidater = Joi.object<IUserRegisterDto>({
    email: Joi.string()
    .email({minDomainSegments: 2})
    .message('Введите коректный email (name@gmail.com)')
    .required()
    .messages(messages('email')),
    password: Joi.string()
    .min(6)
    .required()
    .messages(messages('password'))
});

function messages(propName: string) {
    return {
        'string.base': `${propName} должен быть типом строки`,
        'string.empty': `${propName} не должен быть пустым`,
        'string.min': `${propName} минимальное значение {#limit} символа`,
        'any.required': `${propName} обязательно должен быть`
    }
}

export default registerValidater;