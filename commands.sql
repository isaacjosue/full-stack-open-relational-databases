CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT null,
  title text NOT null,
  likes integer DEFAULT 0
);
\d
\d blogs
INSERT INTO blogs (author, url, title, likes) VALUES (
  'admin',
  'example.com',
  'test',
  0
);
INSERT INTO blogs (author, url, title, likes) VALUES (
  'admin',
  'example.com',
  'test2',
  1
);
SELECT * FROM blogs;