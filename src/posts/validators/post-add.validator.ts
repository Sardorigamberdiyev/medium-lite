import joi from 'joi';
import IPostAddDto from '../dto/post-add.dto';

const addValidator = joi.object<IPostAddDto>({
    title: joi.string()
    .min(3)
    .required()
    .messages(messages('title')),
    content: joi.string()
    .min(3)
    .message('content поста не должен иметь не менее 3 символов')
    .required()
    .messages(messages('content'))
});

function messages(propName: string) {
    return {
        'string.base': `${propName} должен быть типом строки`,
        'string.empty': `${propName} не должен быть пустым`,
        'string.min': `${propName} минимальное значение {#limit} символа`,
        'any.required': `${propName} обязательно должен быть`
    }
}

export default addValidator;