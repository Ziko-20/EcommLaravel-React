<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Triggers MySQL pour la gestion automatique du stock.
 *
 * AFTER INSERT on ligne_commandes  → décrémente stock_produit
 * AFTER DELETE on ligne_commandes  → réincrémente stock_produit
 * AFTER UPDATE on ligne_commandes  → ajuste le delta de stock
 * BEFORE INSERT on ligne_commandes → bloque si stock insuffisant
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── BEFORE INSERT : vérifier le stock avant d'insérer ──────────────
        DB::unprepared('
            CREATE TRIGGER trg_check_stock_before_insert
            BEFORE INSERT ON ligne_commandes
            FOR EACH ROW
            BEGIN
                DECLARE stock_dispo INT;
                SELECT stock_produit INTO stock_dispo
                FROM produits
                WHERE id = NEW.produit_id;

                IF stock_dispo < NEW.quantite THEN
                    SIGNAL SQLSTATE "45000"
                    SET MESSAGE_TEXT = "Stock insuffisant pour ce produit";
                END IF;
            END
        ');

        // ── AFTER INSERT : décrémenter le stock après insertion ────────────
        DB::unprepared('
            CREATE TRIGGER trg_decrement_stock_after_insert
            AFTER INSERT ON ligne_commandes
            FOR EACH ROW
            BEGIN
                UPDATE produits
                SET stock_produit = stock_produit - NEW.quantite
                WHERE id = NEW.produit_id;
            END
        ');

        // ── AFTER DELETE : réincrémenter le stock après suppression ────────
        DB::unprepared('
            CREATE TRIGGER trg_increment_stock_after_delete
            AFTER DELETE ON ligne_commandes
            FOR EACH ROW
            BEGIN
                UPDATE produits
                SET stock_produit = stock_produit + OLD.quantite
                WHERE id = OLD.produit_id;
            END
        ');

        // ── BEFORE UPDATE : vérifier le stock avant modification ───────────
        DB::unprepared('
            CREATE TRIGGER trg_check_stock_before_update
            BEFORE UPDATE ON ligne_commandes
            FOR EACH ROW
            BEGIN
                DECLARE stock_dispo INT;
                -- Stock actuel + ancienne quantité réservée = stock disponible réel
                SELECT stock_produit + OLD.quantite INTO stock_dispo
                FROM produits
                WHERE id = NEW.produit_id;

                IF stock_dispo < NEW.quantite THEN
                    SIGNAL SQLSTATE "45000"
                    SET MESSAGE_TEXT = "Stock insuffisant pour cette quantité";
                END IF;
            END
        ');

        // ── AFTER UPDATE : ajuster le delta de stock après modification ────
        DB::unprepared('
            CREATE TRIGGER trg_adjust_stock_after_update
            AFTER UPDATE ON ligne_commandes
            FOR EACH ROW
            BEGIN
                UPDATE produits
                SET stock_produit = stock_produit + OLD.quantite - NEW.quantite
                WHERE id = NEW.produit_id;
            END
        ');
    }

    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS trg_check_stock_before_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_decrement_stock_after_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_increment_stock_after_delete');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_check_stock_before_update');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_adjust_stock_after_update');
    }
};
