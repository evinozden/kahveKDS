const mysql = require('mysql2');

// MySQL bağlantısı
const db = mysql.createConnection({
    host: 'localhost',      
    user: 'root',           
    password: '',           
    database: 'kahve_zincirikds', 
});

// Veritabanı bağlantısını test etme
db.connect((err) => {
    if (err) {
        console.error('Veritabanı bağlantısı hatası: ' + err.stack);
        return;
    }
    console.log('Veritabanına başarılı bir şekilde bağlanıldı.');
});

module.exports = db;
