const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Şube bazlı toplam satışlar için POST isteği
router.post("/comparison", async (req, res) => {
    const { year, period } = req.body;

    const startMonth = period === "1" ? 1 : 7; 
    const endMonth = period === "1" ? 6 : 12; 

    try {
        db.execute(
            `SELECT s.sube_id, sube_ad, 
                    SUM(adet * (urun.fiyat - urun.maliyet)) AS total_sales
             FROM satis s
             INNER JOIN sube ON s.sube_id = sube.sube_id
             INNER JOIN urun ON s.urun_id = urun.urun_id
             WHERE YEAR(satis_tarih) = ? 
               AND MONTH(satis_tarih) BETWEEN ? AND ?
             GROUP BY s.sube_id, sube_ad`,
            [year, startMonth, endMonth],
            (err, results) => {
                if (err) {
                    console.error("Veritabanı hatası:", err);
                    return res.status(500).json({ error: "Veritabanı hatası: " + err.message });
                }
                res.json(results);
            }
        );
    } catch (err) {
        console.error("Veritabanı hatası:", err);
        res.status(500).json({ error: "Veritabanı hatası: " + err.message });
    }
});

router.post("/category-sales", async (req, res) => {
    const { year, period, categoryName } = req.body;
    console.log("Backend Gelen Parametreler:", { year, period, categoryName }); 

    const startMonth = period === "1" ? 1 : 7;
    const endMonth = period === "1" ? 6 : 12;

    try {
        db.execute(
            `SELECT b.bolge_ad, 
                    SUM(s.adet * (urun.fiyat - urun.maliyet)) AS total_sales
             FROM satis s
             INNER JOIN sube ON s.sube_id = sube.sube_id
             INNER JOIN urun ON s.urun_id = urun.urun_id
             INNER JOIN kategori k ON urun.kategori_id = k.kategori_id
             INNER JOIN ilce i ON sube.ilce_id = i.ilce_id
             INNER JOIN il il ON i.il_id = il.il_id
             INNER JOIN bolge b ON il.bolge_id = b.bolge_id
             WHERE YEAR(s.satis_tarih) = ? 
               AND MONTH(s.satis_tarih) BETWEEN ? AND ?
               AND k.kategori_ad = ?
             GROUP BY b.bolge_ad`,
            [year, startMonth, endMonth, categoryName],
            (err, results) => {
                if (err) {
                    console.error("Veritabanı Hatası:", err); 
                    return res.status(500).json({ error: err.message });
                }
                res.json(results);
            }
        );
    } catch (err) {
        console.error("Hata:", err);
        res.status(500).json({ error: err.message });
    }
});
router.get("/categories", async (req, res) => {
    console.log("GET /categories isteği alındı"); 

    try {
        db.execute(
            `SELECT kategori_id, kategori_ad FROM kategori`,
            (err, results) => {
                if (err) {
                    console.error("Veritabanı Hatası:", err);
                    return res.status(500).json({ error: err.message });
                }
                console.log("Kategori verileri başarıyla alındı:", results);
                res.json(results); 
            }
        );
    } catch (err) {
        console.error("Hata:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post("/category-comparison", async (req, res) => {
    const { year, period, category1, category2 } = req.body;
    console.log("Gelen Parametreler:", { year, period, category1, category2 }); 

    const startMonth = period === "1" ? 1 : 7; 
    const endMonth = period === "1" ? 6 : 12; 

    try {
        db.execute(
            `SELECT 
                sube.sube_ad,
                SUM(CASE WHEN kategori.kategori_id = ? THEN satis.adet * urun.fiyat ELSE 0 END) AS category1_total_sales,
                SUM(CASE WHEN kategori.kategori_id = ? THEN satis.adet * urun.fiyat ELSE 0 END) AS category2_total_sales
             FROM satis
             INNER JOIN urun ON satis.urun_id = urun.urun_id
             INNER JOIN kategori ON urun.kategori_id = kategori.kategori_id
             INNER JOIN sube ON satis.sube_id = sube.sube_id
             WHERE YEAR(satis.satis_tarih) = ? 
               AND MONTH(satis.satis_tarih) BETWEEN ? AND ?
             GROUP BY sube.sube_ad`,
            [category1, category2, year, startMonth, endMonth],
            (err, results) => {
                if (err) {
                    console.error("Veritabanı Hatası:", err); 
                    return res.status(500).json({ error: err.message });
                }
                console.log("Karşılaştırma verileri:", results); 
                res.json(results);
            }
        );
    } catch (err) {
        console.error("Hata:", err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
