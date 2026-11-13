import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DynamicaApi implements ICredentialType {
	name = 'dynamicaApi';

	displayName = 'DYNAMICA API';

	icon: Icon = {
		light: 'file:../nodes/Dynamica/dynamica.svg',
		dark: 'file:../nodes/Dynamica/dynamica.dark.svg',
	};

	documentationUrl = 'https://www.datosdynamica.net/documentacion/n8n/';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://www.datosdynamica.net/fiscal/api',
			placeholder: 'https://www.datosdynamica.net/fiscal/api',
			description: 'Base URL of the DYNAMICA fiscal API, without a trailing slash',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Bearer token assigned to the company in DYNAMICA',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v1/auth/company-profile',
			method: 'GET',
		},
	};
}
