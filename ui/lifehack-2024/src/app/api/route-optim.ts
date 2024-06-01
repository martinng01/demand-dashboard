import { NextApiRequest, NextApiResponse } from 'next';
import { RouteOptimizationClient } from '@googlemaps/routeoptimization';
import { NextResponse } from 'next/server';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   console.log(req.body);

//   if (req.method === 'POST') {
//     try {
//       const routeOptimizationClient = new RouteOptimizationClient({
//         apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
//       });

//       // Extract the data from the request body
//       const { body } = req.body;
//       console.log(body);

//       const response = await routeOptimizationClient.optimizeTours(body);
//       res.status(200).json(response);
//     } catch (error) {
//       console.error('Error optimizing tours:', error);
//       res.status(500).json({ error: 'Error optimizing tours' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end('Method Not Allowed');
//   }
// }

export async function POST(request: Request) {
  const data = await request.json();
  return NextResponse.json(data);
}
