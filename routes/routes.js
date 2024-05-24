const express = require('express');
const router = express.Router();
const { insertarPedidos } = require('../controllers/insertarPedidosControllers');

router.post('/insertar-pedidos', insertarPedidos);

module.exports = router;
