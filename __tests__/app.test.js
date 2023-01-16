const db = require("../db/connection");
const app = require("../db/app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("get/api/topics", () => {
  test("Return topics with the correct properties with 200", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe("get/api/articles", () => {
  test("Return articles with 200 message, adding comment_count with the correct values", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(12);
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              article_img_url: expect.any(String),
              article_id: expect.any(Number),
              votes: expect.any(Number),
              author: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
});
