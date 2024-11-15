import { Config } from 'drizzle-kit';

export default {
    dialect: 'sqlite',
    schema: 'src/persistence/**/*.sql.ts',
} satisfies Config;
