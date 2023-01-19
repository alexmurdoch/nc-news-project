const db = require("../db/connection");
const app = require("../code/app");
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
        expect(body).toEqual([
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
          },
        ]);
      });
  });
  test("returns correct errors for invalid paths", () => {
    return request(app)
      .get("/api/articles/500/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("no comments for given article");
      });
  });
});

describe("post/api/articles/:articleid/comments", () => {
  test("adds an object with a username and body with 201 message and returns the posted comment", () => {
    const comment = {
      username: "icellusedkars",
      body: "Great article!",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(201)
      .then((result) => {
        expect(result.body).toEqual({ comment: "Great article!" });
      });
  });
  test("returns 404 error if invalid path", () => {
    const comment = {
      username: "icellusedkars",
      body: "Great article!",
    };
    return request(app)
      .post("/api/articles/500/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "404, article not found" });
      });
  });
});
test("returns 404 error if article id not a number", () => {
  const comment = {
    username: "icellusedkars",
    body: "Great article!",
  };
  return request(app)
    .post("/api/articles/alex/comments")
    .send(comment)
    .expect(404)
    .then(({ body }) => {
      expect(body).toEqual({ msg: "404, article not found" });
    });
});

test("returns 404 error if no comment given", () => {
  const comment = {
    username: "icellusedkars",
  };
  return request(app)
    .post("/api/articles/alex/comments")
    .send(comment)
    .expect(404)
    .then(({ body }) => {
      expect(body).toEqual({ msg: "404, article not found" });
    });
});

describe("patch/api/articles/:article_id", () => {
  test("updates the votes of an article by given paramater, no existing votes", () => {
    const votes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/3")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
          })
        );
        expect(body.votes).toBe(10);
      });
  });
  test("returns 404 error if article id that isnt in database is given ", () => {
    const votes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/5000")
      .send(votes)
      .expect(404)
      .then((body) => {
        expect(body._body.msg).toBe("Invalid article ID or no votes passed");
      });
  });
  test("returns 404 error if invalid format for votes given", () => {
    const votes = { votes: "10" };
    return request(app)
      .patch("/api/articles/3")
      .send(votes)
      .expect(404)
      .then((body) => {
        expect(body._body.msg).toBe("Invalid data type");
      });
  });
});

describe("get/api/users", () => {
  test("Return users with the correct properties with 200", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(4);
        body.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("api queries", () => {
  test("returns correct topic to the topic query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(11);
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

  test("returns correct order when using sort_by with order", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("topic", { ascending: true });
      });
  });
  test("combines all 3 queries", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", { ascending: true });
      });
  });
  test("invalid query given returns data with default queries", () => {
    return request(app)
      .get("/api/articles?abcd")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("invalid sort_by parameters cause error", () => {
    return request(app)
      .get("/api/articles?sort_by=break")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid sort_by query");
      });
  });
  test("invalid order parameters cause error", () => {
    return request(app)
      .get("/api/articles?order=break")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid order query");
      });
  });
});

describe("get/api/articles/:articleid/comments?queries", () => {
  test("now returns comment count aswell if given the query count", () => {
    return request(app)
      .get("/api/articles/3/comments?count=true")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual([
          [
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
            },
          ],
          { comment_count: 2 },
        ]);
      });
  });
  test("if query is not specified as count = true, it is assumed false", () => {
    return request(app)
      .get("/api/articles/3/comments?count=yes")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual([
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
          },
        ]);
      });
  });
});
