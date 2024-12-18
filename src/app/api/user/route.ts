export async function GET() {
	const data = {
		hello: 'test',
	};
	return Response.json(data, {
		status: 200,
	});
}
