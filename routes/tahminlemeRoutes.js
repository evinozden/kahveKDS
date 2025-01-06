const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Ürün listesi
router.get('/products', (req, res) => {
    db.execute('SELECT urun_id, urun_ad FROM urun', (err, results) => {
        if (err) {
            console.error("Veritabanı hatası:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results); 
    });
});

// Ürün fiyatını alma
router.get('/product-price', (req, res) => {
    const { productId } = req.query;

    db.execute('SELECT fiyat FROM urun WHERE urun_id = ?', [productId], (err, results) => {
        if (err) {
            console.error("Veritabanı hatası:", err);
            return res.status(500).json({ error: err.message });
        }

        const currentPrice = results[0]?.fiyat;
        res.json({ current_price: currentPrice });
    });
});

router.get('/prediction', (req, res) => {
    const { productId, price } = req.query;

    // Geçmiş satışları al
    db.execute(
        `SELECT YEAR(satis_tarih) AS year, SUM(adet) AS total_sales 
         FROM satis 
         WHERE urun_id = ? AND YEAR(satis_tarih) BETWEEN 2020 AND 2024
         GROUP BY YEAR(satis_tarih)`,
        [productId],
        (err, results) => {
            if (err) {
                console.error("Veritabanı hatası:", err);
                return res.status(500).json({ error: err.message });
            }

            const pastSales = results.map(item => item.total_sales);
            const basePrice = pastSales.length > 0 ? pastSales[4] : 850; 
            const baseSales = pastSales[4]; 

            let predictedSales = baseSales;

            db.execute('SELECT fiyat FROM urun WHERE urun_id = ?', [productId], (err, result) => {
                if (err) {
                    console.error("Fiyat sorgulama hatası:", err);
                    return res.status(500).json({ error: err.message });
                }

                const productCurrentPrice = result[0]?.fiyat || 0;

                // Fiyat arttıkça satışlar artar, ancak %40'dan fazla artış olursa satışlar azalır
                if (price > productCurrentPrice) {
                    const priceIncreasePercentage = (price - productCurrentPrice) / productCurrentPrice;

                    if (priceIncreasePercentage <= 0.4) {
                        predictedSales = baseSales * (1 + priceIncreasePercentage * 0.6); 
                    } else {
                        const excessIncrease = priceIncreasePercentage - 0.4;
                        predictedSales = baseSales * (1 + 0.4 * 0.6 - excessIncrease * 0.5); 
                    }
                } else if (price < productCurrentPrice) {
                    
                    const priceDecreasePercentage = (productCurrentPrice - price) / productCurrentPrice;
                    predictedSales = baseSales * (1 + priceDecreasePercentage * 0.4); 
                }

                // Sonuçları döndür
                res.json({
                    past_sales: pastSales,
                    predicted_sales: predictedSales.toFixed(0), 
                });
            });
        }
    );
});




module.exports = router;
