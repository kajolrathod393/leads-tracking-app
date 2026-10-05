import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/prismaClient";

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Leads API", () => {
  let createdLeadId: number;

  it("POST /api/leads creates a new lead with valid data", async () => {
    const response = await request(app).post("/api/leads").send({
      name: "Test Lead",
      email: "test.lead@example.com",
      phone: "1234567890",
      status: "new",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Test Lead");
    expect(response.body.status).toBe("new");

    createdLeadId = response.body.id;
  });

  it("POST /api/leads returns 400 when required fields are missing", async () => {
    const response = await request(app).post("/api/leads").send({
      name: "",
      email: "not-an-email",
      phone: "",
      status: "invalid-status",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  it("GET /api/leads/:id returns the created lead", async () => {
    const response = await request(app).get(`/api/leads/${createdLeadId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdLeadId);
  });

  it("GET /api/leads/:id returns 404 for a non-existent lead", async () => {
    const response = await request(app).get("/api/leads/999999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Lead not found");
  });

  afterAll(async () => {
    if (createdLeadId) {
      await prisma.lead.delete({ where: { id: createdLeadId } }).catch(() => undefined);
    }
  });
});
