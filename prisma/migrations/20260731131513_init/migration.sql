-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SHOWROOM_STAFF',
    "showroomId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "users_showroomId_fkey" FOREIGN KEY ("showroomId") REFERENCES "showrooms" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "showrooms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "cars" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "specifications" TEXT,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "showroomId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cars_showroomId_fkey" FOREIGN KEY ("showroomId") REFERENCES "showrooms" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "car_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "carId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "car_images_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "carId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "inquiries_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "showrooms_email_key" ON "showrooms"("email");

-- CreateIndex
CREATE INDEX "cars_showroomId_idx" ON "cars"("showroomId");

-- CreateIndex
CREATE INDEX "cars_customerPhone_idx" ON "cars"("customerPhone");

-- CreateIndex
CREATE INDEX "car_images_carId_idx" ON "car_images"("carId");

-- CreateIndex
CREATE INDEX "inquiries_carId_idx" ON "inquiries"("carId");

-- CreateIndex
CREATE INDEX "inquiries_customerPhone_idx" ON "inquiries"("customerPhone");
