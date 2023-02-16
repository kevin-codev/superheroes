import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  results: []
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  if (req.method === 'GET') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPERHEROES_BASE_URL}${process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN}/search/${req.query.heroName}`);
    const data: Data = await response.json();
    return res.status(200).json(data)
  }
  return res.status(400);
}

export default handler;
