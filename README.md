# n8n-nodes-dynamica

Nodo comunitario de n8n para integrar **DYNAMICA ERP** con la API fiscal de Uruguay.

## Funciones iniciales

- Emitir un CFE mediante `POST /v1/documents/emissions`.
- Consultar una emisión mediante `GET /v1/documents/emissions/:emissionId`.
- Consultar documentos recibidos mediante `GET /v1/received-documents`.

## Instalación

En una instancia de n8n que permita nodos comunitarios:

1. Abra **Settings → Community nodes**.
2. Seleccione **Install**.
3. Escriba `n8n-nodes-dynamica`.
4. Confirme la instalación y reinicie n8n si la instancia lo solicita.

El paquete todavía no está publicado. Estas instrucciones serán válidas después de publicar la primera versión en npm.

## Credenciales

Cree una credencial **DYNAMICA API** con:

- **Base URL:** URL de la API fiscal de DYNAMICA asignada a su ambiente.
- **Access Token:** token Bearer de la empresa.

Cada empresa debe usar sus propias credenciales. No reutilice tokens entre clientes ni copie valores de ejemplos o capturas.

## Operaciones

### Emit CFE

Recibe el objeto JSON completo definido por el contrato de emisión de DYNAMICA. La emisión es una operación fiscal con efectos reales cuando se utiliza un ambiente productivo.

Use una clave de idempotencia única y verifique el estado devuelto antes de repetir una solicitud.

### Get Emission

Consulta una emisión mediante el `emissionId` recibido en la operación de emisión.

### Get Received Documents

Consulta documentos recibidos. Los filtros admitidos dependen del contrato vigente de la API, por ejemplo tipo documental, serie, rango de fechas y estado de respuesta.

## Seguridad

- Utilice primero un ambiente de pruebas autorizado.
- No guarde tokens en workflows exportados, documentación o capturas.
- Una respuesta HTTP exitosa no sustituye la verificación del estado fiscal del documento.
- No repita una emisión incierta sin consultar antes su estado.

## Desarrollo

```bash
npm install
npm run lint
npm run build
```

## Licencia

[MIT](LICENSE.md)
