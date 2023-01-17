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

describe("invalid path", () => {
  test("404 invalid path", () => {
    return request(app)
      .get("/invalid-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
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

describe("get/api/articles/:articleid", () => {
  test("Return article with 200 message for correct endpoint", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("responds with 404 if invalid path", () => {
    return request(app)
      .get("/api/articles/500")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
});


describe("get/api/articles/:articleid/comments", () => {
  test("Return an array of comments with 200 message for correct article ID", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {


        expect(body.article).toEqual([
          {
            body: "git push origin master",
            votes: 0,
            author: "icellusedkars",
            comment_id: 10,
            article_id: 3,
            created_at: "2020-06-20T07:24:00.000Z",
          },
          {
            body: "Ambidextrous marsupial",
            votes: 0,
            author: "icellusedkars",
            comment_id: 11,
            article_id: 3,
            created_at: "2020-09-19T23:10:00.000Z",
          }
        ])
        });
      });
  test('returns correct errors for invalid paths', () => {
    return request(app)
      .get("/api/articles/500/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("no comments for given article");
      });
  });
  });
 