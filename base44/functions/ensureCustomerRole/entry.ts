import { createClientFromRequest } from "npm:@base44/sdk";

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    if (event?.type !== "entity" || event?.entity_name !== "User" || event?.event_type !== "create") {
      return Response.json({ skipped: true });
    }

    const userId = data?.id;
    if (!userId) {
      return Response.json({ skipped: true });
    }

    const user = await base44.asServiceRole.entities.User.get(userId);

    if (user.role === "admin") {
      return Response.json({ message: "Admin role preserved" });
    }

    if (user.role !== "user") {
      await base44.asServiceRole.entities.User.update(userId, { role: "user" });
    }

    return Response.json({ message: "Customer role assigned", userId });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Role assignment failed" },
      { status: 500 }
    );
  }
}
