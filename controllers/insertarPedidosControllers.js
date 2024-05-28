const sql = require('mssql');
const logger = require('../config/logger.js');
const { connectToDatabase, closeDatabaseConnection } = require('../config/database.js');
const moment = require('moment');




/**
 * Insertamos pedidos en tabla pedidos
 * @param {*} data 
 * @returns 
 */
async function insertarPedidos(req , res) {
    console.log("---->" , req.body);
    let data = req.body
    logger.info(`Iniciamos la funcion insertarPedidos ${JSON.stringify(data)}`);
    let result;
    let responseData = [];
    
    try {
        // Conectarse a la base de datos 'telecontrol'
        await connectToDatabase('Telecontrol');
      
        // Armamos data que vamos a mandar al procedimiento almacenado
        for (const pedidos of data) {
           
            const request = new sql.Request(); // Nueva instancia de request en caditeracióna 
           
            const {
                pedido: ID_Pedido,
                pedido: Folio,
                tipoDocumento: TipoDocumento,
                codigo_posto   : Entidad,
                data: Fecha,
                codigo: SiglaCondicion,
                codigo_condicao: CodigoCondicion,
                entrega: Entrega,
                exportado: Exportado,
                tipo_frete: TipoFlete,
                valor_adicional_fabricante: ValorAdicionalFabricante,
                valor_desconto_fabricante:ValorDescontoFabricante,
                transportadora: Transportador,
                status_pedido: StatusPedido,
                troca: Remplazo,
                status_descricao: StatusDescripcion,
                os: OS_ID,
                informeTecnico: InformeTecnico,
                modelo: Modelo,
                serie: Serie,
                nombreServicioTecnico : NombreCliente,
                direccion: DireccionCliente,
                fechaCompra : FechaCompra,
                distribuidor: Distribuidor,
                numeroDocumento: NumeroDocumento,
                observacao : Observacion

            } = pedidos;
           
            // Ejecutar el procedimiento almacenado con los parámetros
             result = await request
                .input('ID_Pedido', sql.VarChar(20), ID_Pedido.toString())
                .input('Empresa', sql.VarChar(20), "Makita")
                .input('Folio', sql.Int, Folio)
                .input('TipoDocumento', sql.VarChar(40), TipoDocumento)
                .input('Entidad', sql.VarChar(20), Entidad.trim())
                .input('Fecha', sql.VarChar, formatDate(Fecha))
                .input('SiglaCondicion', sql.VarChar(20), SiglaCondicion)
                .input('CodigoCondicion', sql.VarChar(20), CodigoCondicion)
                .input('Entrega', sql.VarChar(30), Entrega)
                .input('Exportado', sql.VarChar(20), Exportado)
                .input('TipoFlete', sql.VarChar(20), TipoFlete)                
                .input('ValorAdicionalFabricante', sql.Int, ValorAdicionalFabricante)
                .input('ValorDescontoFabricante', sql.Int, ValorDescontoFabricante)
                .input('Transportador', sql.VarChar(20), Transportador)
                .input('StatusPedido', sql.Int, StatusPedido)
                .input('Remplazo', sql.VarChar(20), Remplazo)
                .input('StatusDescripcion', sql.VarChar(50), StatusDescripcion)
                .input('OS_ID', sql.VarChar(20), OS_ID)
                .input('InformeTecnico', sql.VarChar(200), InformeTecnico)
                .input('TipoMo', sql.VarChar(20), null)
                .input('Modelo', sql.VarChar(20), Modelo)
                .input('Serie', sql.VarChar(20), Serie)
                .input('TipoGarantia', sql.VarChar(50), null)
                .input('NombreCliente', sql.VarChar(50), NombreCliente)
                .input('DireccionCliente', sql.VarChar(50), DireccionCliente)
                .input('FechaCompra',  sql.VarChar, formatDate(FechaCompra))
                .input('Distribuidor', sql.VarChar(50), Distribuidor)
                .input('NumeroDocumento', sql.BigInt, NumeroDocumento)
                .input('Observacion' , sql.VarChar(200), Observacion)
                .output('ID', sql.Int)
                .execute('insertaPedidoSP');
                
                result.idPedido = ID_Pedido;
                result.tipoDocumento = TipoDocumento;

                responseData.push(result);
               
               
        }
        
        await closeDatabaseConnection();
        logger.info(`Fin de la funcion insertarPedidos ${JSON.stringify(responseData)}`);
        res.status(200).json(responseData);
    
    } catch (error) {
        // Manejamos cualquier error ocurrido durante el proceso
        logger.error(`Error en insertarPedidos: ${error.message}`);
        res.status(500).json({ error: `Error en el servidor [insertar-pedidos-ms] :  ${error.message}`  });
    }
}

/**
 * Formateamos Fecha
 * @param {*} date 
 * @returns 
 */
function formatDate(date) {
    
    if(date != null){
        const fechaMoment = moment(date, "DD-MM-YYYY");
        const fechaFormateada = fechaMoment.format("YYYY-MM-DD");
        return fechaFormateada;
    }
}

module.exports = {
    insertarPedidos
};
