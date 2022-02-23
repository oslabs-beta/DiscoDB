// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  //const body = req.body;
  const body = {actionSuccess: true};
  res.status(200).json({ body })
}
