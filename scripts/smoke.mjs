import { spawn } from "node:child_process";

const routes = [
  "/",
  "/shop",
  "/product/core-black-hoodie",
  "/cart",
  "/checkout",
  "/profile",
  "/orders",
  "/admin",
  "/admin/content",
  "/admin/settings",
  "/admin/catalog",
  "/admin/analytics",
  "/admin/products",
  "/admin/products/new",
  "/admin/orders",
  "/success",
  "/cancel",
  "/about",
];

const env = {
  ...process.env,
  USE_MOCK_DATA: "true",
  ADMIN_DEV_BYPASS: "true",
  NEXT_PUBLIC_SITE_URL: "http://localhost:3010",
  NODE_ENV: "development",
};

const server = spawn("npm.cmd", ["run", "start", "--", "-p", "3010"], {
  env,
  stdio: ["ignore", "pipe", "pipe"],
  shell: true,
  windowsHide: true,
});

let logs = "";
server.stdout.on("data", (chunk) => {
  logs += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  logs += chunk.toString();
});

async function waitForServer() {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 30000) {
    try {
      const response = await fetch("http://localhost:3010/");
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw new Error(`Timed out waiting for server.\n${logs}`);
}

async function main() {
  try {
    await waitForServer();

    for (const route of routes) {
      const response = await fetch(`http://localhost:3010${route}`, { redirect: "manual" });
      if (response.status !== 200) {
        throw new Error(`${route} returned ${response.status}`);
      }
    }

    const authChecks = [
      ["/api/auth/login", [302, 307]],
      ["/api/auth/logout", [302, 307]],
      ["/api/auth/callback", [400, 302, 307]],
    ];

    for (const [route, statuses] of authChecks) {
      const response = await fetch(`http://localhost:3010${route}`, { redirect: "manual" });
      if (!statuses.includes(response.status)) {
        throw new Error(`${route} returned ${response.status}`);
      }
    }

    const checkoutResponse = await fetch("http://localhost:3010/api/checkout/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ id: "prod-core-black-hoodie", size: "M", quantity: 1 }],
      }),
    });
    const checkout = await checkoutResponse.json();
    if (!checkoutResponse.ok || !checkout.url) {
      throw new Error(`Checkout route failed: ${JSON.stringify(checkout)}`);
    }

    const webhookResponse = await fetch("http://localhost:3010/api/webhooks/stripe", {
      method: "POST",
      body: "{}",
    });
    if (webhookResponse.status !== 400) {
      throw new Error(`Webhook missing-signature check returned ${webhookResponse.status}`);
    }

    console.log(
      `Smoke test passed for ${routes.length} routes, auth routes, checkout session creation, and webhook signature guard.`,
    );
    server.kill("SIGTERM");
    process.exit(0);
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  server.kill("SIGTERM");
  console.error(error);
  process.exit(1);
});
