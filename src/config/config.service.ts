import IConfigService from './config.service.interface';
import { config, DotenvConfigOutput } from 'dotenv';

export default class ConfigService implements IConfigService {
    private config: DotenvConfigOutput;

    constructor() {
        const result = config();
        if (result.error)
            console.log('Не удалось инициализировать конфиг перезапустите сервер');
        this.config = config();
    }

    get(key: string): string {
        if (this.config.parsed)
            return this.config.parsed[key];
        return '';
    }
}