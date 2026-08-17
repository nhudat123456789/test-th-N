import { createClientFromRequest } from "npm:@base44/sdk";

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role === "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      items,
      total,
      payment_method,
      note,
    } = body;

    if (!customer_name || !customer_phone || !shipping_address || !items?.length) {
      return Response.json({ error: "Missing required order fields" }, { status: 400 });
    }

    const order = await base44.asServiceRole.entities.Order.create({
      customer_name,
      customer_email: customer_email || user.email,
      customer_phone,
      shipping_address,
      items,
      total,
      status: "pending",
      payment_method: payment_method || "cod",
      payment_status: "unpaid",
      note: note || "",
    });

    for (const item of items) {
      if (!item?.product_id && !item?.id) continue;
      const productId = item.product_id || item.id;
      const qty = Number(item.quantity || item.qty || 1);

      try {
        const product = await base44.asServiceRole.entities.Product.get(productId);
        const newStock = Math.max(0, (product.stock ?? 0) - qty);
        await base44.asServiceRole.entities.Product.update(productId, {
          stock: newStock,
          status: newStock <= 0 ? "out_of_stock" : "in_stock",
        });
      } catch {
        // Skip invalid product references
      }
    }

    return Response.json({ order });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Order failed" },
      { status: 500 }
    );
  }
}
