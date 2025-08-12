-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'In Transit', 'Delivered', 'Canceled');

-- CreateTable
CREATE TABLE "order_id_counter" (
    "date" DATE NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "orderIdCounter_pkey" PRIMARY KEY ("date")
);

-- Create function order id generator
create or replace function "gen_order_id"() returns text
    strict
    volatile
    parallel unsafe
    language plpgsql
as
$$
declare
    result text;
begin
    with
        "var_const" ("month_date_now", "date_invoice") as (
            values (
                concat(to_char(now() at time zone 'Asia/Jakarta', 'YYYY-MM'), '-01')::date,
                to_char(now() at time zone 'Asia/Jakarta', 'YY-MM')
            )
        ),
        "q" as (
            insert into "order_id_counter" (date)
            select "month_date_now"
            from "var_const"
            on conflict (date)
            do update set
                counter = "order_id_counter"."counter" + excluded."counter"
            returning counter
        )
    select 'INV' || '-' ||
            "var_const"."date_invoice" || '-' ||
            trim(to_char("q"."counter", '000000'))
    into "result"
    from "q", "var_const";
    return result;
end;
$$;

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL DEFAULT gen_order_id(),
    "senderName" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "orders_senderName_idx" ON "orders"("senderName");

-- CreateIndex
CREATE INDEX "orders_recipientName_idx" ON "orders"("recipientName");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");
