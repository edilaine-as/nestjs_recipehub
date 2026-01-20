import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1768868649903 implements MigrationInterface {
    name = 'InitialSchema1768868649903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recipe-steps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "stepNumber" integer NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "recipeId" uuid, CONSTRAINT "PK_e28583c289ac596695e022d643a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."recipes_category_enum" AS ENUM('dessert', 'main_dish', 'salad', 'drink', 'snack')`);
        await queryRunner.query(`CREATE TABLE "recipes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "category" "public"."recipes_category_enum" NOT NULL DEFAULT 'main_dish', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_8f09680a51bf3669c1598a21682" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."recipe-ingredients_unit_enum" AS ENUM('teaspoon', 'tablespoon', 'cup', 'milliliter', 'liter', 'gram', 'kilogram', 'ounce', 'pound', 'unit', 'slice', 'piece', 'pinch', 'handful', 'package', 'can', 'bunch')`);
        await queryRunner.query(`CREATE TABLE "recipe-ingredients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" numeric NOT NULL, "unit" "public"."recipe-ingredients_unit_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "recipeId" uuid, "ingredientId" uuid, CONSTRAINT "PK_7281a3d0ae420e0b3272194c8df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."ingredients_type_enum" AS ENUM('proteins', 'carbohydrates', 'fats_and_oils', 'dairy', 'fruits', 'vegetables', 'herbs_and_Spices', 'sugars_and_Sweeteners', 'beverages_and_Liquids')`);
        await queryRunner.query(`CREATE TABLE "ingredients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."ingredients_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_9240185c8a5507251c9f15e0649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recipe-steps" ADD CONSTRAINT "FK_cb1d392b30cf4efed839a17e3e9" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipes" ADD CONSTRAINT "FK_ad4f881e4b9769d16c0ed2bb3f0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe-ingredients" ADD CONSTRAINT "FK_1819d4893b36635dbb006ebccd3" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe-ingredients" ADD CONSTRAINT "FK_c62d8bef7e8f9ded7d832810e82" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ingredients" ADD CONSTRAINT "FK_9a8a13cc60b4a4a067679cde290" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients" DROP CONSTRAINT "FK_9a8a13cc60b4a4a067679cde290"`);
        await queryRunner.query(`ALTER TABLE "recipe-ingredients" DROP CONSTRAINT "FK_c62d8bef7e8f9ded7d832810e82"`);
        await queryRunner.query(`ALTER TABLE "recipe-ingredients" DROP CONSTRAINT "FK_1819d4893b36635dbb006ebccd3"`);
        await queryRunner.query(`ALTER TABLE "recipes" DROP CONSTRAINT "FK_ad4f881e4b9769d16c0ed2bb3f0"`);
        await queryRunner.query(`ALTER TABLE "recipe-steps" DROP CONSTRAINT "FK_cb1d392b30cf4efed839a17e3e9"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "ingredients"`);
        await queryRunner.query(`DROP TYPE "public"."ingredients_type_enum"`);
        await queryRunner.query(`DROP TABLE "recipe-ingredients"`);
        await queryRunner.query(`DROP TYPE "public"."recipe-ingredients_unit_enum"`);
        await queryRunner.query(`DROP TABLE "recipes"`);
        await queryRunner.query(`DROP TYPE "public"."recipes_category_enum"`);
        await queryRunner.query(`DROP TABLE "recipe-steps"`);
    }

}
