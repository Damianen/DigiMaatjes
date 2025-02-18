import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/dal/user.dal';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ username: string }> }
) {
	const { username } = await params;

	const token = req.headers.get('Authorization')?.split(' ')[1];

	const response = await getUser(username, token);

	return NextResponse.json(response, { status: 200 });
}
