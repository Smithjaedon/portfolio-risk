import { uuid, pgTable, text, integer, timestamp, decimal, pgSchema } from 'drizzle-orm/pg-core';

const auth = pgSchema('auth');

export const users = auth.table('users', {
	id: uuid('id').primaryKey()
});

export const portfolio = pgTable('portfolio', {
	id: uuid('id').defaultRandom().primaryKey(),
	userid: uuid('userid')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	percentChange: text('percentChange').notNull().default('0.0'),
	value: integer('value').default(0.0),
	lastUpdated: timestamp('last_updated').defaultNow(),
	compositeScore: integer('composite_score').default(0)
});

export const holding = pgTable('holding', {
	id: uuid('id').defaultRandom().primaryKey(),
	portfolioId: uuid('portfolio_id').references(() => portfolio.id, { onDelete: 'cascade' }),
	symbol: text('symbol').notNull(),
	currentPrice: decimal('current_price', { precision: 8, scale: 2 }),
	updatedAt: timestamp('updated_at').defaultNow()
});
