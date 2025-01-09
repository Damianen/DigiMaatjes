import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../dao/db-config';
import * as sql from 'mssql';

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  const { username } = await params;

    if (!database.connected) {
      await database.connect();
    }

    const sqlRequest: sql.Request = database.request();
    
    sqlRequest.input('userName', sql.NVarChar, username);

    const results = await sqlRequest.query("select * from [User] WHERE userName = @userName");
    const response = results.recordset[0] ? results.recordset[0] : undefined;
    await database.close();
    
    return NextResponse.json(response, {status: 200});
}
