export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const decoded = await verifyIdToken(token);
  const { id } = req.query;

  if (req.method === "DELETE") {
    const docRef = db.collection("entries").doc(id as string);
    const doc = await docRef.get();

    if (!doc.exists || doc.data()?.userId !== decoded.uid) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await docRef.delete();
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
