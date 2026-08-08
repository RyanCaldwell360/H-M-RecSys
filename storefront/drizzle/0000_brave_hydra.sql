CREATE TABLE `articles` (
	`article_id` text PRIMARY KEY NOT NULL,
	`product_code` text NOT NULL,
	`name` text NOT NULL,
	`product_type` text NOT NULL,
	`product_group` text NOT NULL,
	`appearance` text NOT NULL,
	`colour` text NOT NULL,
	`perceived_colour` text NOT NULL,
	`department` text NOT NULL,
	`index_name` text NOT NULL,
	`index_group` text NOT NULL,
	`section` text NOT NULL,
	`garment_group` text NOT NULL,
	`description` text,
	`image_path` text,
	`has_image` integer DEFAULT false NOT NULL,
	`popularity` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_articles_product_type` ON `articles` (`product_type`);--> statement-breakpoint
CREATE INDEX `idx_articles_colour` ON `articles` (`colour`);--> statement-breakpoint
CREATE INDEX `idx_articles_index_name` ON `articles` (`index_name`);--> statement-breakpoint
CREATE INDEX `idx_articles_popularity` ON `articles` (`popularity`);--> statement-breakpoint
CREATE TABLE `customers` (
	`customer_id` text PRIMARY KEY NOT NULL,
	`cohort_rank` integer NOT NULL,
	`label` text NOT NULL,
	`history_count` integer NOT NULL,
	`first_purchase_at` text NOT NULL,
	`last_purchase_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_customers_cohort_rank` ON `customers` (`cohort_rank`);--> statement-breakpoint
CREATE INDEX `idx_customers_history_count` ON `customers` (`history_count`);--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customer_id` text NOT NULL,
	`purchased_at` text NOT NULL,
	`article_id` text NOT NULL,
	`price` real NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`article_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_transactions_customer_date` ON `transactions` (`customer_id`,`purchased_at`);--> statement-breakpoint
CREATE INDEX `idx_transactions_article` ON `transactions` (`article_id`);