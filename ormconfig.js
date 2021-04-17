module.exports = {
    type: 'postgres',

    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,

    synchronize: true,
    dropSchema: !!+process.env.TYPEORM_DROP_SCHEMA,
    logging: false,

    entities: ['dist/**/*.entity.{ts,js}'],

    migrationsTableName: 'migration',
    migrations: ['migrations/**/*.ts'],

    cli: {
        migrationsDir: 'migration',
    },
}
