const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.get('/sales', (req, res) => {
  const { sube, yil } = req.query;

  
  const query = `
SELECT 
      urun_ad AS urun, 
      SUM(adet) AS toplam_satis
    FROM satis
    JOIN urun ON satis.urun_id = urun.urun_id
    WHERE (? IS NULL OR sube_id = ?)
    AND (? IS NULL OR YEAR(satis_tarih) = ?)
    GROUP BY urun_ad
    ORDER BY toplam_satis DESC;
  `;

  
  const params = [sube, sube, yil, yil];

 
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('SQL Hatası:', err);
      return res.status(500).json({ error: 'Veritabanı hatası.' });
    }
    
    res.json(results);
  });
});

module.exports = router;


 

