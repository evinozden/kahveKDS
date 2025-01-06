const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const hedef_noktalarRoutes = require('./routes/hedef_noktalarRoutes');
const profitRoutes = require('./routes/profitRoutes');
const comparisonRoutes = require("./routes/comparisonRoutes");
const mainRoutes = require('./routes/mainRoutes');
const tahminlemeRoutes = require('./routes/tahminlemeRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));  

// API rotaları
app.use('/api', hedef_noktalarRoutes);
app.use('/api', profitRoutes);
app.use("/api", comparisonRoutes);  
app.use('/api', mainRoutes);
app.use('/api', tahminlemeRoutes);



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Bir şeyler yanlış gitti!');
});

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});
