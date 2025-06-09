import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

await sql`
DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_membership') THEN
            CREATE TYPE user_membership AS ENUM ('free', 'premium');
        END IF;
    END
$$;
`;

await sql`
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    password TEXT NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    membership user_membership NOT NULL DEFAULT 'free'
  )
`;

/* 
  CHATID
  USERID
  CONTENT
  MESSAGEID
  USERNAME
  EMAIL
  ROLE
  TIMESTAMP
*/

await sql`
DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_role') THEN
            CREATE TYPE message_role AS ENUM ('user', 'assistant');
        END IF;
    END
$$;
`;

await sql`
  CREATE TABLE IF NOT EXISTS messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    role message_role NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`

await sql`
  CREATE TABLE IF NOT EXISTS chats (
    chat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
  )
`

await sql`
DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_sub') THEN
            CREATE TYPE status_sub AS ENUM ('active', 'canceled');
        END IF;
    END
$$;
`;

await sql`
  CREATE TABLE IF NOT EXISTS subscriptions (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    stripe_subscription_id TEXT NOT NULL,
    stripe_customer_id TEXT NOT NULL,
    stripe_status_sub status_sub NOT NULL,
    stripe_period_end TIMESTAMP NOT NULL,
    stripe_cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE
  )
`

await sql`
  CREATE TABLE IF NOT EXISTS audios (
    audio_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    audio BYTEA,
    created_at TIMESTAMP DEFAULT NOW()
  )
`