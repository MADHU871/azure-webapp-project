const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('<h1>Azure Web App Running Successfully 🚀</h1>');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});