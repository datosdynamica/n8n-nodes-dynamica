import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class Dynamica implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DYNAMICA',
		name: 'dynamica',
		icon: { light: 'file:dynamica.svg', dark: 'file:dynamica.dark.svg' },
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Integra DYNAMICA ERP con la API fiscal de Uruguay',
		defaults: {
			name: 'DYNAMICA',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'dynamicaApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Emit CFE',
						value: 'emitCfe',
						description: 'Envía un documento fiscal electrónico para su emisión',
						action: 'Emit a CFE',
					},
					{
						name: 'Get Emission',
						value: 'getEmission',
						description: 'Consulta el estado y los artefactos de una emisión',
						action: 'Get an emission',
					},
					{
						name: 'Get Received Documents',
						value: 'getReceivedDocuments',
						description: 'Consulta documentos fiscales recibidos',
						action: 'Get received documents',
					},
				],
				default: 'emitCfe',
			},
			{
				displayName: 'CFE Payload',
				name: 'cfePayload',
				type: 'json',
				displayOptions: { show: { operation: ['emitCfe'] } },
				default: '{}',
				description: 'Objeto JSON completo conforme al contrato de emisión de DYNAMICA',
				required: true,
			},
			{
				displayName: 'Emission ID',
				name: 'emissionId',
				type: 'string',
				displayOptions: { show: { operation: ['getEmission'] } },
				default: '',
				required: true,
				description: 'Identificador devuelto al emitir el CFE',
			},
			{
				displayName: 'Filters',
				name: 'receivedFilters',
				type: 'json',
				displayOptions: { show: { operation: ['getReceivedDocuments'] } },
				default: '{}',
				description: 'Filtros opcionales enviados como parámetros de consulta',
				required: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const credentials = await this.getCredentials('dynamicaApi');
		const baseUrl = String(credentials.baseUrl).replace(/\/+$/, '');
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const parseObject = (value: string, fieldName: string): IDataObject => {
					let parsed: unknown;
					try {
						parsed = JSON.parse(value);
					} catch (error) {
						throw new NodeOperationError(
							this.getNode(),
							`${fieldName} debe contener JSON válido: ${(error as Error).message}`,
							{ itemIndex },
						);
					}

					if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object') {
						throw new NodeOperationError(
							this.getNode(),
							`${fieldName} debe ser un objeto JSON`,
							{ itemIndex },
						);
					}

					return parsed as IDataObject;
				};

				const operation = this.getNodeParameter('operation', itemIndex) as string;
				let method: IHttpRequestMethods = 'GET';
				let resource = '';
				let body: IDataObject | undefined;
				let qs: IDataObject | undefined;

				if (operation === 'emitCfe') {
					method = 'POST';
					resource = '/v1/documents/emissions';
					body = parseObject(
						this.getNodeParameter('cfePayload', itemIndex) as string,
						'CFE Payload',
					);
				} else if (operation === 'getEmission') {
					const emissionId = this.getNodeParameter('emissionId', itemIndex) as string;
					resource = `/v1/documents/emissions/${encodeURIComponent(emissionId)}`;
				} else if (operation === 'getReceivedDocuments') {
					resource = '/v1/received-documents';
					qs = parseObject(
						this.getNodeParameter('receivedFilters', itemIndex) as string,
						'Filters',
					);
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`Operación no soportada: ${operation}`,
						{ itemIndex },
					);
				}

				const options: IHttpRequestOptions = {
					method,
					url: `${baseUrl}${resource}`,
					body,
					qs,
					json: true,
				};

				const response = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					'dynamicaApi',
					options,
				)) as IDataObject;

				returnData.push({ json: response, pairedItem: itemIndex });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: items[itemIndex].json,
						error,
						pairedItem: itemIndex,
					});
					continue;
				}

				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
			}
		}

		return [returnData];
	}
}
