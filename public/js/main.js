document.addEventListener('DOMContentLoaded', () => {
    // En Çok Satış Yapılan 5 İlçe Verisini Çek
    fetch('/api/top-districts')
      .then(response => response.json())
      .then(data => {
        const districts = data.map(item => item.ilce_ad);
        const sales = data.map(item => item.total_sales);
  
        const ctx1 = document.getElementById('topDistrictsChart').getContext('2d');
  
        // Eğer önceki grafik varsa, önce sil
        if (window.topDistrictsChart instanceof Chart) {
          window.topDistrictsChart.destroy();
        }
  
        window.topDistrictsChart = new Chart(ctx1, {
          type: 'bar',
          data: {
            labels: districts,
            datasets: [{
              label: 'Toplam Satış (₺)',
              data: sales,
              backgroundColor: '#FF6347',
              borderColor: '#333',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true },
              title: { display: true, text: 'En Çok Satış Yapılan 5 İlçe' }
            },
            scales: { y: { beginAtZero: true } }
          }
        });
      })
      .catch(error => console.error('Veri çekme hatası:', error));
  
    // En Çok Satış Yapılan 5 Ürün Verisini Çek
    fetch('/api/top-products')
      .then(response => response.json())
      .then(data => {
        const products = data.map(item => item.urun_ad);
        const sales = data.map(item => item.total_sales);
  
        const ctx2 = document.getElementById('topProductsChart').getContext('2d');
  
        // Eğer önceki grafik varsa, önce sil
        if (window.topProductsChart instanceof Chart) {
          window.topProductsChart.destroy();
        }
  
        window.topProductsChart = new Chart(ctx2, {
          type: 'bar',
          data: {
            labels: products,
            datasets: [{
              label: 'Satış Adedi',
              data: sales,
              backgroundColor: '#8A2BE2',
              borderColor: '#333',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true },
              title: { display: true, text: 'En Çok Satış Yapılan 5 Ürün' }
            },
            scales: { y: { beginAtZero: true } }
          }
        });
      })
      .catch(error => console.error('Veri çekme hatası:', error));
  });
  