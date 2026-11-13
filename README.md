# n8n-nodes-dynamica

n8n community node for integrating **DYNAMICA ERP** with Uruguay's fiscal API.

## Operations

- Emit a CFE with `POST /v1/documents/emissions`.
- Get an emission with `GET /v1/documents/emissions/:emissionId`.
- Get received documents with `GET /v1/received-documents`.

## Installation

On an n8n instance that allows community nodes:

1. Open **Settings → Community nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-dynamica`.
4. Confirm the installation and restart n8n if the instance requests it.

## Credentials

Create a **DYNAMICA API** credential with:

- **Base URL:** the DYNAMICA fiscal API URL assigned to your environment.
- **Access Token:** the company's Bearer token.

Each company must use its own credentials. Never reuse tokens across customers or copy values from examples or screenshots.

## Usage

### Emit CFE

Provide the complete JSON object defined by the DYNAMICA emission contract. Emitting a document has real fiscal effects when a production environment is used.

Use a unique idempotency key and verify the returned status before retrying a request.

### Get Emission

Provide the `emissionId` returned by the emission operation to retrieve its status and artifacts.

### Get Received Documents

Provide optional filters as a JSON object. Supported filters depend on the current API contract and can include document type, series, date range, and response status.

## Example workflow

1. Add the **DYNAMICA** node to a workflow.
2. Select **Emit CFE**.
3. Choose a **DYNAMICA API** credential configured for an authorized test environment.
4. Enter a CFE payload that complies with your DYNAMICA API contract.
5. Execute the node and store the returned `emissionId`.
6. Use **Get Emission** to confirm the final fiscal status before retrying or continuing the workflow.

## Security

- Start with an authorized test environment.
- Never store tokens in exported workflows, documentation, or screenshots.
- A successful HTTP response does not replace verification of the document's fiscal status.
- Do not retry an uncertain emission before checking its status.

## Development

```bash
npm install
npm run lint
npm run build
```

## License

[MIT](LICENSE.md)
