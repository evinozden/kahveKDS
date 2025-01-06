document.addEventListener('DOMContentLoaded', () => {
  // Sayfa yüklendiğinde otomatik olarak veri çekme ve grafiği oluşturma
  const sube = document.getElementById('subeSecimi').value;
  const yil = document.getElementById('yilSecimi').value;

  const queryParams = new URLSearchParams();
  if (sube) queryParams.append('sube', sube);
  if (yil) queryParams.append('yil', yil);

  // API çağrısına filtreleri ekleyerek veri çekme
  fetch(`/api/sales?${queryParams.toString()}`)
    .then(response => response.json())
    .then(data => {
      const urunler = data.map(item => item.urun);
      const satislar = data.map(item => item.toplam_satis);

      // Grafiği oluştur
      const ctx = document.getElementById('urunSatisChart').getContext('2d');
      if (window.myChart) {
        window.myChart.destroy(); // Mevcut grafik varsa önce sil
      }
      window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: urunler, // Ürünler
          datasets: [{
            label: 'Satış Miktarı',
            data: satislar, // Satış adetleri
            backgroundColor: [
              '#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1',
              '#34568B', '#FFB6C1', '#FF6347', '#FFD700', '#40E0D0',
              '#D2691E', '#9ACD32', '#ADFF2F', '#FFD700', '#FF4500',
              '#8A2BE2', '#00BFFF', '#20B2AA', '#9932CC', '#FF1493',
              '#FF8C00'
            ],
            borderColor: '#333',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            title: { display: true, text: 'Ürün Bazlı Satış Dağılımı' }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    })
    .catch(err => console.error('Veri çekme hatası:', err));

  // Grafik için filtre uygulama işlemi (buton tıklaması)
  document.getElementById('filtreUygula').addEventListener('click', () => {
    const sube = document.getElementById('subeSecimi').value;
    const yil = document.getElementById('yilSecimi').value;

    // API'den veri çekerken filtreleri gönder
    const queryParams = new URLSearchParams();
    if (sube) queryParams.append('sube', sube);
    if (yil) queryParams.append('yil', yil);

    fetch(`/api/sales?${queryParams.toString()}`) // API çağrısına filtreleri ekle
      .then(response => response.json())
      .then(data => {
        const urunler = data.map(item => item.urun);
        const satislar = data.map(item => item.toplam_satis);

        // Grafiği güncelle
        const ctx = document.getElementById('urunSatisChart').getContext('2d');
        if (window.myChart) {
          window.myChart.destroy(); // Mevcut grafik varsa önce sil
        }
        window.myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: urunler, // Ürünler
            datasets: [{
              label: 'Satış Miktarı',
              data: satislar, // Satış adetleri
              backgroundColor: [
                '#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1',
                '#34568B', '#FFB6C1', '#FF6347', '#FFD700', '#40E0D0',
                '#D2691E', '#9ACD32', '#ADFF2F', '#FFD700', '#FF4500',
                '#8A2BE2', '#00BFFF', '#20B2AA', '#9932CC', '#FF1493',
                '#FF8C00'
              ],
              borderColor: '#333',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true },
              title: { display: true, text: 'Ürün Bazlı Satış Dağılımı' }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }
        });
      })
      .catch(err => console.error('Veri çekme hatası:', err));
  });
});
