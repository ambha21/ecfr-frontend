import { NextResponse } from 'next/server';
import { EcfrApiService } from '../../../app/services/ecfrApi';

export async function GET(request: Request) {
  try {
    const agencies = await EcfrApiService.getAgencies();
    return NextResponse.json(agencies);
  } catch (error) {
    console.error('Error fetching agencies:', error);
    return NextResponse.json({ error: 'Error fetching agencies' }, { status: 500 });
  }
}