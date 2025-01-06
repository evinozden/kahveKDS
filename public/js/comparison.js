// Kategori verilerini almak için API çağrısı
async function fetchCategories() {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Kategori verileri alınamadı.');

        const categories = await response.json();
        console.log(categories);

        const category1Select = document.getElementById('category1');
        const category2Select = document.getElementById('category2');

        categories.forEach((category) => {
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');

            option1.value = category.kategori_id;
            option1.textContent = category.kategori_ad;

            option2.value = category.kategori_id;
            option2.textContent = category.kategori_ad;

            category1Select.appendChild(option1);
            category2Select.appendChild(option2);
        });
    } catch (error) {
        console.error("Kategori verileri yüklenirken hata:", error);
    }
}

// Canvas sıfırlama fonksiyonu
function resetCanvas(canvasId, containerClass) {
    const container = document.querySelector(`.${containerClass}`);
    const oldCanvas = document.getElementById(canvasId);

    if (oldCanvas) oldCanvas.remove();

    const newCanvas = document.createElement('canvas');
    newCanvas.id = canvasId;
    newCanvas.width = container.offsetWidth;
    newCanvas.height = container.offsetHeight;
    container.appendChild(newCanvas);
}

// Şube karşılaştırma verilerini almak için API çağrısı
async function fetchComparisonData(year, period) {
    try {
        const response = await fetch('/api/comparison', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ year, period }),
        });

        if (!response.ok) throw new Error('Veri alınamadı');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Hatası:', error);
        alert(error.message);
        return [];
    }
}

// Kategori satış verilerini almak için API çağrısı
async function fetchCategorySalesData(year, period, categoryName) {
    try {
        const response = await fetch('/api/category-sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ year, period, categoryName }),
        });

        if (!response.ok) throw new Error('Veri alınamadı');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Hatası:', error);
        alert(error.message);
        return [];
    }
}

// Kategori karşılaştırma verilerini almak için API çağrısı
async function fetchCategoryComparisonData(year, period, category1, category2) {
    try {
        const response = await fetch('/api/category-comparison', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ year, period, category1, category2 }),
        });

        if (!response.ok) throw new Error('Veri alınamadı');
        const data = await response.json();
        console.log("Alınan veriler:", data); // Veriyi kontrol edin
        return data;
    } catch (error) {
        console.error('API Hatası:', error);
        alert(error.message);
        return [];
    }
}

// Bar grafiği oluşturma
async function createChart(year, period) {
    const data = await fetchComparisonData(year, period);

    if (!data || data.length === 0) {
        alert('Bar grafiği için veri bulunamadı.');
        return;
    }

    resetCanvas('comparisonChart', 'bar-chart-container');

    const ctx = document.getElementById('comparisonChart').getContext('2d');

    if (window.comparisonChart instanceof Chart) {
        window.comparisonChart.destroy();
    }

    window.comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.sube_ad),
            datasets: [{
                label: 'Toplam Satış (₺)',
                data: data.map(item => item.total_sales),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }],
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true },
            },
        },
    });
}

// Çizgi grafiği oluşturma
async function createCategoryChart(year, period, categoryId) {
    const data = await fetchCategorySalesData(year, period, categoryId);

    if (!data || data.length === 0) {
        alert('Çizgi grafiği için veri bulunamadı.');
        return;
    }

    resetCanvas('regionChart', 'line-chart-container');

    const ctx = document.getElementById('regionChart').getContext('2d');

    if (window.regionChart instanceof Chart) {
        window.regionChart.destroy();
    }

    window.regionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.bolge_ad),
            datasets: [{
                label: 'Bölge Bazlı Satış (₺)',
                data: data.map(item => item.total_sales),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true,
            }],
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true },
            },
        },
    });
}

// İki kategori karşılaştırma grafiği oluşturma
async function createCategoryComparisonChart(year, period, category1, category2) {
    const data = await fetchCategoryComparisonData(year, period, category1, category2);

    if (!data || data.length === 0) {
        alert('Kategori karşılaştırma grafiği için veri bulunamadı.');
        return;
    }

    resetCanvas('categoryComparisonChart', 'category-comparison-container');

    const ctx = document.getElementById('categoryComparisonChart').getContext('2d');

    if (window.categoryComparisonChart instanceof Chart) {
        window.categoryComparisonChart.destroy();
    }

    window.categoryComparisonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(item => item.sube_ad),
            datasets: [
                {
                    label: `Kategori 1 (${category1}) Satışlar (₺)`,
                    data: data.map(item => item.category1_total_sales),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2,
                    fill: true,
                },
                {
                    label: `Kategori 2 (${category2}) Satışlar (₺)`,
                    data: data.map(item => item.category2_total_sales),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2,
                    fill: true,
                },
            ],
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true },
            },
        },
    });
}


// Event listener'lar
document.getElementById('barFilterForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const year = document.getElementById('barYear').value;
    const period = document.getElementById('barPeriod').value;

    await createChart(year, period);
});

document.getElementById('lineFilterForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const year = document.getElementById('lineYear').value;
    const period = document.getElementById('linePeriod').value;
    const categoryName = document.getElementById('category').options[document.getElementById('category').selectedIndex].text;

    await createCategoryChart(year, period, categoryName);
});

document.getElementById('categoryComparisonForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const year = document.getElementById('comparisonYear').value;
    const period = document.getElementById('comparisonPeriod').value;
    const category1 = document.getElementById('category1').value;
    const category2 = document.getElementById('category2').value;

    await createCategoryComparisonChart(year, period, category1, category2);
});

document.addEventListener('DOMContentLoaded', async () => {
    // Sayfa yüklendikten sonra kategorileri getir
    await fetchCategories();

    // Varsayılan yıl ve dönem
    const year = 2024; // Varsayılan yıl
    const period = 1;  // Varsayılan dönem (Ocak - Haziran)

    // Bar grafiği için veri oluştur
    await createChart(year, period);

    // Çizgi grafiği için veri oluştur
    const categoryName = "Espresso Kahve";  // Varsayılan kategori
    await createCategoryChart(year, period, categoryName);

   
});

// Sayfa yüklendiğinde kategorileri getir
document.addEventListener('DOMContentLoaded', fetchCategories);
