import { uuid } from 'drizzle-orm/pg-core';
import { pgTable, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey()
});

export const portfolio = pgTable('portfolio', {
	id: uuid('id').defaultRandom().primaryKey(),
	userid: uuid('userid').references(() => users.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
  percentChange: text('percentChange').default('0.0')
});
