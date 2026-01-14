# KahveKDS

Öğrenci Kahve Karar Destek Sistemi (KDS) projesi.

## Projenin Amacı
Bu proje, öğrencilerin gerçekçi bir iş problemi üzerinden; sunucu taraflı yazılım geliştirme, MVC mimarisini uygulama, REST API tasarlama ve iş kurallarını yönetme becerilerini kazanmalarını amaçlar.

## Gereksinimler & Özellikler
- **MVC Mimarisi**: Model, View (istemci tarafı), Controller ayrımı.
- **REST API**: Tutarlı endpoint yapısı.
- **CRUD İşlemleri**: Ürün yönetimi (Ekleme, Listeleme, Güncelleme, Silme).
- **İş Kuralları**:
    1. Ürün fiyatı maliyetten düşük olamaz.
    2. Satış geçmişi olan ürün silinemez.
- **Konfigürasyon**: `.env` dosyası ile ortam değişkeni yönetimi.

## Kurulum Adımları
1. Projeyi klonlayın.
2. `npm install` komutu ile bağımlılıkları yükleyin.
3. `.env.example` dosyasının adını `.env` olarak değiştirin ve veritabanı bilgilerinizi girin.
4. Veritabanınızın kurulu olduğundan emin olun.
5. `npm start` komutu ile sunucuyu başlatın.

## API Endpoint Listesi

### Ürün Yönetimi (Product CRUD)
- **GET /api/products**: Tüm ürünleri listeler.
- **GET /api/products/:id**: ID'ye göre ürün getirir.
- **POST /api/products**: Yeni ürün ekler.
- **PUT /api/products/:id**: Ürünü günceller.
- **DELETE /api/products/:id**: Ürünü siler.

### Raporlar & Analiz
- **GET /api/top-districts**: En çok satış yapılan ilçeler.
- **GET /api/top-products**: En çok satan ürünler.
- **GET /api/sales**: Hedef/Gerçekleşen satış karşılaştırması.
- **POST /api/comparison**: Şube bazlı karşılaştırma.
- **POST /api/category-sales**: Kategori bazlı satışlar.
- **GET /api/prediction**: Satış tahminleme simülasyonu.

## Veritabanı Yapısı (ER Diyagramı)
Proje aşağıdaki tabloları kullanır:
- **urun**: Ürün bilgileri (kategori, fiyat, maliyet).
- **satis**: Satış kayıtları.
- **sube**: Şube bilgileri.
- **kategori**: Ürün kategorileri.
- **ilce/il/bolge**: Lokasyon hiyerarşisi.

