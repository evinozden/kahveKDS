const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/top-districts', (req, res) => {
    const query = `
        SELECT 
            i.ilce_ad, 
            SUM(s.adet * (u.fiyat - u.maliyet)) AS total_sales
        FROM satis s
        JOIN urun u ON s.urun_id = u.urun_id
        JOIN sube sb ON s.sube_id = sb.sube_id
        JOIN ilce i ON sb.ilce_id = i.ilce_id
        GROUP BY i.ilce_ad
        ORDER BY total_sales DESC
        LIMIT 5;
    `;
    db.execute(query, (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    });
});

router.get('/top-products', (req, res) => {
    const query = `
        SELECT 
            u.urun_ad, 
            SUM(s.adet) AS total_sales
        FROM satis s
        JOIN urun u ON s.urun_id = u.urun_id
        GROUP BY u.urun_ad
        ORDER BY total_sales DESC
        LIMIT 5;
    `;
    db.execute(query, (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    });
});

module.exports = router;
