document.addEventListener('DOMContentLoaded', () => {
    const productSelect = document.getElementById('productSelect');
    const priceInput = document.getElementById('priceInput');
    const updateButton = document.getElementById('updateButton');
    const newPrice = document.getElementById('newPrice');
    const currentPrice = document.getElementById('currentPrice');
    const predictedSales = document.getElementById('predictedSales');
    const salesChart = document.getElementById('salesChart');

    // Ürünleri veritabanından al
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                const option = document.createElement('option');
                option.value = product.urun_id;
                option.textContent = product.urun_ad;
                productSelect.appendChild(option);
            });
        })
        .catch(err => console.error('Ürünler yüklenirken hata:', err));

    // Ürün seçildiğinde mevcut fiyatı al ve göster
    productSelect.addEventListener('change', () => {
        const selectedProductId = productSelect.value;

        fetch(`/api/product-price?productId=${selectedProductId}`)
            .then(response => response.json())
            .then(data => {
                currentPrice.textContent = data.current_price; // Mevcut fiyatı göster
                priceInput.value = data.current_price; // Fiyat inputu da güncellenir
            })
            .catch(err => console.error('Mevcut fiyat çekilirken hata:', err));
    });

    // Fiyat değiştiğinde tahminleme yap
    updateButton.addEventListener('click', () => {
        const selectedProductId = productSelect.value;
        const newPriceValue = parseFloat(priceInput.value);

        // Yeni fiyatı ekrana yazdır
        newPrice.textContent = newPriceValue;

        // Fiyat değişimini gönder ve tahminle
        fetch(`/api/prediction?productId=${selectedProductId}&price=${newPriceValue}`)
            .then(response => response.json())
            .then(data => {
                const salesData = data.predicted_sales;
                predictedSales.textContent = salesData;

                // Geçmiş satışları (2020-2024) sadece mavi bar olarak ekle
                // 2025 tahminini mor bar olarak ekle
                const ctx = salesChart.getContext('2d');
                const chartData = {
                    labels: ['2020', '2021', '2022', '2023', '2024', '2025'], // 2020-2024 geçmiş ve 2025 tahmin
                    datasets: [
                        {
                            label: 'Geçmiş Satışlar',
                            data: data.past_sales, // 2020-2024 yılları için geçmiş satış verisi
                            backgroundColor: 'rgba(75, 192, 192, 0.6)', // Mavi renk
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            fill: false
                        },
                        {
                            label: 'Tahmin Edilen Satışlar (2025)',
                            data: [null, null, null, null, null, salesData], // 2025 yılı tahmini (diğer yıllar için null)
                            backgroundColor: 'rgba(153, 102, 255, 0.6)', // Mor renk
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1,
                            fill: false
                        }
                    ]
                };

                if (window.salesChartInstance) {
                    window.salesChartInstance.destroy(); // Eski grafiği yok et
                }

                window.salesChartInstance = new Chart(ctx, {
                    type: 'bar', // Bar grafiği kullanıyoruz
                    data: chartData,
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Fiyat Değişimi ve Satış Adedi (2025)'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            })
            .catch(err => console.error('Tahminleme hatası:', err));
    });
});
