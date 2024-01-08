import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeORMConfig: TypeOrmModuleOptions = {
    "type": "mssql",
    "host": "localhost",
    "port": 1433,
    "username": "sa",
    "password": "123",
    "synchronize": true,
    "database": "university_sys",
    "entities": [__dirname + '/../**/*.entity{.ts,.js}'],
    "autoLoadEntities": true,
    "migrationsTableName": 'Migrations_History',
    "options": {
        "encrypt": true,
        "trustServerCertificate": true
    }
};
