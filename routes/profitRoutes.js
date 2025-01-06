const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.get('/profit', (req, res) => {
    const query = `
      SELECT 
        urun.urun_ad AS urun, 
        urun.kategori_id,
        ((urun.fiyat - urun.maliyet) / urun.maliyet * 100) AS kar_yuzdesi
      FROM urun;
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Veritabanı hatası:', err);
        res.status(500).send('Veritabanı hatası');
        return;
      }
      res.json(results);
    });
});

module.exports = router;

