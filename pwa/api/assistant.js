/**
 * Assistant terrain — fonction serverless (Vercel).
 *
 * OPTIONNELLE. Tant que la variable d'environnement ANTHROPIC_API_KEY n'est
 * pas définie sur le projet Vercel, cet endpoint renvoie 501 et l'application
 * bascule automatiquement sur son moteur de correspondance local. Aucune
 * configuration n'est donc nécessaire pour que l'app fonctionne.
 *
 * Pour l'activer :
 *   1. Vercel → projet PWA → Settings → Environment Variables
 *   2. Ajouter ANTHROPIC_API_KEY (la clé reste côté serveur, jamais exposée)
 *   3. Redéployer
 *
 * Attention au coût : chaque question consomme des jetons. Prévoir une
 * limitation par appareil avant toute ouverture large.
 */

const MODEL = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `Tu assistes des électriciens français sur chantier.

Cadre de ton rôle :
- Tu orientes vers les bonnes ressources de formation. Tu n'es pas un bureau d'études.
- Réponds en français, dans un registre direct et concret, comme un collègue expérimenté.
- Sois bref : 3 à 5 phrases maximum. L'électricien est debout, souvent avec les mains prises.

Sécurité, non négociable :
- Ne donne jamais de procédure détaillée d'intervention sous tension.
- Rappelle l'habilitation électrique requise quand la question touche à une
  intervention à risque.
- Pour toute installation IRVE au-delà de 3,7 kW, rappelle que la qualification
  IRVE est obligatoire (décret n°2017-26).
- Si la question dépasse le champ de la formation (dimensionnement précis,
  conformité d'une installation particulière), dis-le et renvoie vers la hotline
  du fabricant ou un bureau de contrôle.

Tu reçois une liste de formations du catalogue. Appuie-toi dessus pour orienter,
et n'invente jamais une formation qui n'y figure pas.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Signal explicite : l'application saura utiliser son moteur local.
    return res.status(501).json({ error: "assistant_non_configure" });
  }

  const { question, candidates } = req.body || {};
  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Question manquante" });
  }
  if (question.length > 500) {
    return res.status(400).json({ error: "Question trop longue" });
  }

  // On ne transmet que les formations déjà présélectionnées par le moteur
  // local : cela borne le contexte et évite d'envoyer tout le catalogue.
  const context = (candidates || [])
    .slice(0, 6)
    .map(
      (c) =>
        `- ${c.title} | ${c.sourceLabel} | ${c.format} | ${c.duration}${
          c.url ? ` | ${c.url}` : ""
        }`
    )
    .join("\n");

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Question de l'électricien : ${question}\n\nFormations disponibles au catalogue :\n${
              context || "(aucune correspondance trouvée)"
            }`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return res.status(502).json({ error: "assistant_indisponible" });
    }

    const data = await response.json();
    const text = (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return res.status(200).json({ reply: text });
  } catch {
    return res.status(502).json({ error: "assistant_indisponible" });
  }
}
