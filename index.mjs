import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "db_consultas";

export const handler = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = { "Content-Type": "application/json" };
    //teste
    try {
        switch (event.routeKey) {
            case "POST /consultas":
                const { paciente_id, medico_id, data_hora_id } = JSON.parse(event.body);
                const consulta_id = Date.now().toString(); // Usando timestamp em milissegundos como ID
                await dynamo.send(new PutCommand({
                    TableName: tableName,
                    Item: { consulta_id, paciente_id, medico_id, data_hora_id, status: 'pendente' }
                }));
                body = 'Consulta criada com sucesso!';
                break;

            case "DELETE /consultas/{consulta_id}":
                await dynamo.send(new DeleteCommand({
                    TableName: tableName,
                    Key: { consulta_id: event.pathParameters.consulta_id }
                }));
                body = `Consulta cancelada com sucesso!`;
                break;

            case "GET /consultas/medico":
                const medicoId = event.queryStringParameters.medico_id;
                const medicoParams = {
                    TableName: tableName,
                    FilterExpression: 'medico_id = :medico_id',
                    ExpressionAttributeValues: { ':medico_id': medicoId }
                };
                const medicoData = await dynamo.send(new ScanCommand(medicoParams));
                body = medicoData.Items;
                break;

            case "GET /consultas/paciente":
                const pacienteId = event.queryStringParameters.paciente_id;
                const pacienteParams = {
                    TableName: tableName,
                    FilterExpression: 'paciente_id = :paciente_id',
                    ExpressionAttributeValues: { ':paciente_id': pacienteId }
                };
                const pacienteData = await dynamo.send(new ScanCommand(pacienteParams));
                body = pacienteData.Items;
                break;

            case "POST /consultas/aceitar":
                const aceitarBody = JSON.parse(event.body);
                await dynamo.send(new UpdateCommand({
                    TableName: tableName,
                    Key: { consulta_id: aceitarBody.consulta_id },
                    UpdateExpression: 'SET medico_id = :medico_id, #status = :status',
                    ExpressionAttributeValues: { ':medico_id': aceitarBody.medico_id, ':status': 'aceita' },
                    ExpressionAttributeNames: { '#status': 'status' }
                }));
                body = 'Consulta aceita com sucesso!';
                break;

            case "POST /consultas/cancelar":
                const cancelarBody = JSON.parse(event.body);
                await dynamo.send(new UpdateCommand({
                    TableName: tableName,
                    Key: { consulta_id: cancelarBody.consulta_id },
                    UpdateExpression: 'SET #status = :status',
                    ExpressionAttributeValues: { ':status': 'cancelada' },
                    ExpressionAttributeNames: { '#status': 'status' }
                }));
                body = 'Consulta cancelada com sucesso!';
                break;

            default:
                throw new Error(`Unsupported route: "${event.routeKey}"`);
        }
    } catch (error) {
        statusCode = 400;
        body = error.message;
    } finally {
        body = JSON.stringify(body);
    }

    return { statusCode, body, headers };
};