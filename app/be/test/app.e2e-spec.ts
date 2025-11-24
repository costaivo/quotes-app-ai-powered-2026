import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import type { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import type { CreateQuoteDto } from "../src/quotes/dto/create-quote.dto";

describe("Quotes E2E", () => {
  let app: INestApplication<App>;
  let createdQuoteIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api");
    await app.init();

    // Seed data
    const quotesToCreate: CreateQuoteDto[] = [
      {
        author: "Albert Einstein",
        text: "Life is like riding a bicycle. To keep your balance, you must keep moving.",
      },
      {
        author: "Marie Curie",
        text: "Nothing in life is to be feared, it is only to be understood.",
      },
      {
        author: "Isaac Newton",
        text: "If I have seen further it is by standing on the shoulders of Giants.",
      },
    ];

    for (const quote of quotesToCreate) {
      const response = await request(app.getHttpServer())
        .post("/api/v1/quotes")
        .send(quote)
        .expect(201);
      createdQuoteIds.push(response.body.id);
    }
  });

  afterAll(async () => {
    // Cleanup
    for (const id of createdQuoteIds) {
      await request(app.getHttpServer()).delete(`/api/v1/quotes/${id}`);
    }
    await app.close();
  });

  describe("GET /api/v1/quotes", () => {
    it("should return all quotes when no parameters provided", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/quotes")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
    });

    it("should filter by author (case-insensitive, partial match)", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/quotes")
        .query({ author: "einstein" })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      for (const quote of response.body) {
        expect(quote.author.toLowerCase()).toContain("einstein");
      }
    });

    it("should filter by text query (case-insensitive, partial match)", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/quotes")
        .query({ query: "bicycle" })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      for (const quote of response.body) {
        expect(quote.text.toLowerCase()).toContain("bicycle");
      }
    });

    it("should filter by both author and query", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/quotes")
        .query({ author: "marie", query: "feared" })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      for (const quote of response.body) {
        expect(quote.author.toLowerCase()).toContain("marie");
        expect(quote.text.toLowerCase()).toContain("feared");
      }
    });

    it("should return empty list for no results", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/quotes")
        .query({ query: "xyzzy_non_existent_string_12345" })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });
  });
});
