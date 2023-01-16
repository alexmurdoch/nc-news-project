const db  = require("../db/connection");
const app = require("../db/app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data")
const request = require("supertest")

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("get/api/topics", () => {
  test("Return topics", () => {
    return request(app)
      .get('/api/topics')
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
