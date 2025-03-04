-- CreateEnum
CREATE TYPE "FoodAdditionalRole" AS ENUM ('UNIQUE', 'MULTIPLE', 'QUANTITY');

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "promotion" INTEGER,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodAdditional" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "minRequired" INTEGER,
    "limit" INTEGER,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "role" "FoodAdditionalRole" NOT NULL DEFAULT 'UNIQUE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "FoodAdditional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodAndAdditional" (
    "foodId" TEXT NOT NULL,
    "foodAdditionalId" TEXT NOT NULL,

    CONSTRAINT "FoodAndAdditional_pkey" PRIMARY KEY ("foodId","foodAdditionalId")
);

-- CreateTable
CREATE TABLE "FoodOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "FoodOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodAdditionalAndOption" (
    "foodOptionId" TEXT NOT NULL,
    "foodAdditionalId" TEXT NOT NULL,

    CONSTRAINT "FoodAdditionalAndOption_pkey" PRIMARY KEY ("foodOptionId","foodAdditionalId")
);

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FoodCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodAdditional" ADD CONSTRAINT "FoodAdditional_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodAndAdditional" ADD CONSTRAINT "FoodAndAdditional_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodAndAdditional" ADD CONSTRAINT "FoodAndAdditional_foodAdditionalId_fkey" FOREIGN KEY ("foodAdditionalId") REFERENCES "FoodAdditional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodOption" ADD CONSTRAINT "FoodOption_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodAdditionalAndOption" ADD CONSTRAINT "FoodAdditionalAndOption_foodOptionId_fkey" FOREIGN KEY ("foodOptionId") REFERENCES "FoodOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodAdditionalAndOption" ADD CONSTRAINT "FoodAdditionalAndOption_foodAdditionalId_fkey" FOREIGN KEY ("foodAdditionalId") REFERENCES "FoodAdditional"("id") ON DELETE CASCADE ON UPDATE CASCADE;
