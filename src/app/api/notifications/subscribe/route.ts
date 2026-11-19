import { Prisma } from "@/generated/prisma/client";
import { subscribeEmailSchema } from "@/lib/notification-schema";
import { checkNotificationRateLimit } from "@/lib/notification-rate-limit";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function jsonResponse(
  body: { success: boolean; message: string },
  status: number,
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { success: false, message: "Please enter a valid email address." },
      400,
    );
  }

  const parsed = subscribeEmailSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse(
      { success: false, message: "Please enter a valid email address." },
      400,
    );
  }

  try {
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const withinLimit = await checkNotificationRateLimit(ipAddress);

    if (!withinLimit) {
      return jsonResponse(
        { success: false, message: "Too many attempts. Please try again later." },
        429,
      );
    }

    const { email } = parsed.data;
    const existing = await prisma.notificationSubscriber.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return jsonResponse(
        { success: false, message: "This email is already subscribed." },
        409,
      );
    }

    await prisma.notificationSubscriber.create({ data: { email } });

    return jsonResponse(
      { success: true, message: "Successfully subscribed!" },
      201,
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return jsonResponse(
        { success: false, message: "This email is already subscribed." },
        409,
      );
    }

    return jsonResponse(
      { success: false, message: "Something went wrong. Please try again." },
      500,
    );
  }
}
