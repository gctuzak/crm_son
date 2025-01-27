-- CreateTable
CREATE TABLE "firmalar" (
    "id" SERIAL NOT NULL,
    "ad" VARCHAR(255) NOT NULL,
    "tip" VARCHAR(50) NOT NULL,
    "vergi_no" VARCHAR(20) NOT NULL,
    "vergi_dairesi" VARCHAR(100),
    "adres" TEXT,
    "telefon" VARCHAR(20),
    "sektor" VARCHAR(100),
    "sehir" VARCHAR(100),
    "temsilci_id" INTEGER,
    "olusturan_id" INTEGER,
    "olusturma_tarihi" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "guncelleme_tarihi" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(255),
    "silindi" BOOLEAN DEFAULT false,

    CONSTRAINT "firmalar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dosyalar" (
    "id" SERIAL NOT NULL,
    "ilgili_tip" VARCHAR(50) NOT NULL,
    "ilgili_id" INTEGER NOT NULL,
    "dosya_adi" VARCHAR(255) NOT NULL,
    "orijinal_ad" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "boyut" INTEGER NOT NULL,
    "yol" TEXT NOT NULL,
    "yukleyen_id" INTEGER,
    "olusturma_tarihi" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "guncelleme_tarihi" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "silindi" BOOLEAN DEFAULT false,

    CONSTRAINT "dosyalar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "izinler" (
    "izin_id" SERIAL NOT NULL,
    "izin_adi" VARCHAR(100) NOT NULL,
    "aciklama" TEXT,
    "olusturma_tarihi" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "izinler_pkey" PRIMARY KEY ("izin_id")
);

-- CreateTable
CREATE TABLE "kisiler" (
    "id" SERIAL NOT NULL,
    "ad" VARCHAR(100) NOT NULL,
    "soyad" VARCHAR(100) NOT NULL,
    "kimlik_no" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255),
    "telefon" VARCHAR(20),
    "adres" TEXT,
    "tip" VARCHAR(50),
    "sehir" VARCHAR(100),
    "temsilci_id" INTEGER,
    "olusturan_id" INTEGER,
    "olusturma_tarihi" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "guncelleme_tarihi" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "firma_id" INTEGER,
    "silindi" BOOLEAN DEFAULT false,

    CONSTRAINT "kisiler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roller" (
    "rol_id" SERIAL NOT NULL,
    "rol_adi" VARCHAR(50) NOT NULL,
    "olusturma_tarihi" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roller_pkey" PRIMARY KEY ("rol_id")
);

-- CreateTable
CREATE TABLE "rol_izinleri" (
    "rol_id" INTEGER NOT NULL,
    "izin_id" INTEGER NOT NULL,

    CONSTRAINT "rol_izinleri_pkey" PRIMARY KEY ("rol_id","izin_id")
);

-- CreateTable
CREATE TABLE "kullanici_roller" (
    "kullanici_id" UUID NOT NULL,
    "rol_id" INTEGER NOT NULL,

    CONSTRAINT "kullanici_roller_pkey" PRIMARY KEY ("kullanici_id","rol_id")
);

-- CreateTable
CREATE TABLE "kullanicilar" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "kullanici_adi" VARCHAR(50) NOT NULL,
    "sifre_hash" VARCHAR(255) NOT NULL,
    "ad" VARCHAR(100) NOT NULL,
    "soyad" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "durum" VARCHAR(20) DEFAULT 'aktif',
    "calisan_durumu" VARCHAR(20),
    "yonetici_mi" BOOLEAN DEFAULT false,
    "olusturma_tarihi" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "guncelleme_tarihi" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "silindi" BOOLEAN DEFAULT false,

    CONSTRAINT "kullanicilar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_custom_fields" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER,
    "name" VARCHAR(100) NOT NULL,
    "field_type" VARCHAR(20) NOT NULL,
    "is_required" BOOLEAN DEFAULT false,
    "options" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_custom_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER,
    "file_name" VARCHAR(255) NOT NULL,
    "file_path" VARCHAR(500) NOT NULL,
    "file_size" INTEGER,
    "mime_type" VARCHAR(100),
    "sort_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER,
    "name" VARCHAR(100) NOT NULL,
    "options" JSONB NOT NULL,
    "price_adjustment" DECIMAL(10,2) DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category_id" INTEGER,
    "type" VARCHAR(20) NOT NULL,
    "unit_id" INTEGER,
    "base_price" DECIMAL(12,2),
    "currency" VARCHAR(3) NOT NULL DEFAULT 'EUR',
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "tax_rate" INTEGER NOT NULL DEFAULT 18,
    "min_quantity" DECIMAL(10,2) DEFAULT 1,
    "max_quantity" DECIMAL(10,2),
    "stock_tracking" BOOLEAN DEFAULT false,
    "stock_quantity" DECIMAL(10,2) DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_by" INTEGER,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "firmalar_vergi_no_key" ON "firmalar"("vergi_no");

-- CreateIndex
CREATE UNIQUE INDEX "izinler_izin_adi_key" ON "izinler"("izin_adi");

-- CreateIndex
CREATE UNIQUE INDEX "kisiler_kimlik_no_key" ON "kisiler"("kimlik_no");

-- CreateIndex
CREATE UNIQUE INDEX "roller_rol_adi_key" ON "roller"("rol_adi");

-- CreateIndex
CREATE UNIQUE INDEX "kullanicilar_kullanici_adi_key" ON "kullanicilar"("kullanici_adi");

-- CreateIndex
CREATE UNIQUE INDEX "kullanicilar_email_key" ON "kullanicilar"("email");

-- CreateIndex
CREATE INDEX "idx_product_custom_fields_product_id" ON "product_custom_fields"("product_id");

-- CreateIndex
CREATE INDEX "idx_product_images_product_id" ON "product_images"("product_id");

-- CreateIndex
CREATE INDEX "idx_product_variants_product_id" ON "product_variants"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_code_key" ON "products"("code");

-- CreateIndex
CREATE INDEX "idx_products_category_id" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "idx_products_code" ON "products"("code");

-- CreateIndex
CREATE INDEX "idx_products_status" ON "products"("status");

-- CreateIndex
CREATE INDEX "idx_products_type" ON "products"("type");

-- AddForeignKey
ALTER TABLE "rol_izinleri" ADD CONSTRAINT "rol_izinleri_izin_id_fkey" FOREIGN KEY ("izin_id") REFERENCES "izinler"("izin_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rol_izinleri" ADD CONSTRAINT "rol_izinleri_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roller"("rol_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kullanici_roller" ADD CONSTRAINT "kullanici_roller_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roller"("rol_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "kullanici_roller" ADD CONSTRAINT "kullanici_roller_kullanici_id_fkey" FOREIGN KEY ("kullanici_id") REFERENCES "kullanicilar"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_custom_fields" ADD CONSTRAINT "product_custom_fields_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
