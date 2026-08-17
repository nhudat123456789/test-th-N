import { createClientFromRequest } from "npm:@base44/sdk";
import { secrets } from "base44:runtime";

export default async function (req: Request): Promise<Response> {
  try {
    const setupKey = secrets.get("ADMIN_SETUP_KEY");
    const adminEmail = secrets.get("ADMIN_EMAIL");
    const adminPassword = secrets.get("ADMIN_PASSWORD");

    if (!setupKey || !adminEmail || !adminPassword) {
      return Response.json(
        {
          error:
            "Missing secrets. Set ADMIN_SETUP_KEY, ADMIN_EMAIL, and ADMIN_PASSWORD via: base44 secrets set ...",
        },
        { status: 500 }
      );
    }

    const providedKey = req.headers.get("x-setup-key");
    if (providedKey !== setupKey) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const base44 = createClientFromRequest(req);
    const existing = await base44.asServiceRole.entities.User.filter({ email: adminEmail });

    if (existing.length > 0) {
      const adminUser = existing[0];
      if (adminUser.role !== "admin") {
        await base44.asServiceRole.entities.User.update(adminUser.id, { role: "admin" });
      }
      return Response.json({
        message: "Admin account already exists",
        email: adminEmail,
        role: "admin",
      });
    }

    const url = new URL(req.url);
    const appId = url.searchParams.get("app_id") || req.headers.get("x-app-id");
    if (!appId) {
      return Response.json({ error: "app_id required (query param or X-App-Id header)" }, { status: 400 });
    }

    const apiBase = `${url.protocol}//${url.host}/api`;
    const registerRes = await fetch(`${apiBase}/apps/${appId}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    });

    if (!registerRes.ok) {
      const err = await registerRes.text();
      return Response.json({ error: `Registration failed: ${err}` }, { status: 500 });
    }

    const users = await base44.asServiceRole.entities.User.filter({ email: adminEmail });
    if (users.length === 0) {
      return Response.json({ error: "User created but not found in database" }, { status: 500 });
    }

    await base44.asServiceRole.entities.User.update(users[0].id, {
      role: "admin",
      is_verified: true,
      full_name: users[0].full_name || "Admin",
    });

    return Response.json({
      message: "Admin account created successfully",
      email: adminEmail,
      role: "admin",
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Seed failed" },
      { status: 500 }
    );
  }
}
