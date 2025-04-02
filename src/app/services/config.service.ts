import { Injectable } from '@angular/core';

export interface AppConfig {
    [key: string]: string | boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private readonly appConfig: AppConfig;

    constructor() {
        this.appConfig = (window as any).APP_CONFIG;
        if (!this.appConfig) {
            throw new Error('Config not loaded from window.APP_CONFIG');
        }
    }
    
    getEnv(key: string): string | boolean | undefined {
        return this.appConfig[key];
    }

    loadConfig(): Promise<AppConfig> {
        return Promise.resolve(this.appConfig);
    }
}
