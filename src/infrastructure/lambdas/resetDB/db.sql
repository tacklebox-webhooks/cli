DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS endpoints;
DROP TABLE IF EXISTS event_types;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS services;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS services (
  id serial PRIMARY KEY,
  uuid uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp NOT NULL DEFAULT now(),
  deleted_at timestamp
);

CREATE TABLE IF NOT EXISTS users (
  id serial,
  service_id integer NOT NULL,
  uuid uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  deleted_at timestamp,
  PRIMARY KEY (id),
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
  UNIQUE (service_id, name)
);

CREATE TABLE IF NOT EXISTS event_types (
  id serial,
  service_id integer NOT NULL,
  uuid uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
	sns_topic_arn text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  deleted_at timestamp,
  PRIMARY KEY (id),
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
  UNIQUE (service_id, name)
);

CREATE TABLE IF NOT EXISTS endpoints (
  id serial,
  user_id integer NOT NULL,
  uuid uuid NOT NULL DEFAULT gen_random_uuid(),
  url text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  deleted_at timestamp,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id serial,
  endpoint_id integer NOT NULL,
  event_type_id integer NOT NULL,
  subscription_arn text NOT NULL UNIQUE,
  uuid uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp NOT NULL DEFAULT now(),
  deleted_at timestamp,
  PRIMARY KEY (id),
  FOREIGN KEY (endpoint_id) REFERENCES endpoints(id) ON DELETE SET NULL,
  FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS events (
  id serial,
  user_id integer NOT NULL,
  event_type_id integer NOT NULL,
  uuid uuid NOT NULL DEFAULT gen_random_uuid(),
  payload jsonb NOT NULL,
  idempotency_key text,
  created_at timestamp NOT NULL DEFAULT now(),
  deleted_at timestamp,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE SET NULL,
  UNIQUE (user_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS messages (
  id serial,
  event_id integer NOT NULL,
  uuid uuid NOT NULL DEFAULT gen_random_uuid(),
  endpoint text NOT NULL,
  delivered boolean NOT NULL,
  delivery_attempt integer,
  status_code integer NOT NULL,
  delivered_at timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  deleted_at timestamp,
  PRIMARY KEY (id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);

INSERT INTO services(name, uuid) VALUES('twitter', 'e1be6554-90ee-4e00-b121-0e62f3546ce0');
INSERT INTO services(name, uuid) VALUES('apple', '4f87ccc1-8025-4147-90eb-a733f36d82bf');
INSERT INTO services(name, uuid) VALUES('disney', '5645224f-9135-4c99-bb5e-7276218b926a');

INSERT INTO event_types(name, service_id, uuid, sns_topic_arn) VALUES('tweetRetweeted', 1, 'eae0ba59-7c24-4b2d-8acf-8ec4733759f3', 'arn:aws:sns:us-east-1:946221510390:CaptainHook_21e1ea98-157a-482b-a904-b5867288c824_tweet_retweeted');
INSERT INTO event_types(name, service_id, uuid, sns_topic_arn) VALUES('tweetSubtweeted', 1, '8e52eaae-b404-4a87-997e-6ed4109935e8', 'arn:aws:sns:us-east-1:946221510390:CaptainHook_test_tweetSubtweeted');
INSERT INTO event_types(name, service_id, uuid, sns_topic_arn) VALUES('anotherIpadSold', 2, '7d5055e4-509b-43ee-af5d-a47f6d9c06cf', 'arn:aws:sns:us-east-1:946221510390:CaptainHook_test_anotherIpadSold');
INSERT INTO event_types(name, service_id, uuid, sns_topic_arn) VALUES('newRide', 3, '0debaa2d-9ad7-4085-a24a-4a8fa2ce7dbd', 'arn:aws:sns:us-east-1:946221510390:CaptainHook_test_newRide');

INSERT INTO users(name, service_id, uuid) VALUES('kevinCorp', 1, '06a3e00b-21c5-4ad4-99b2-ff18f45ad895');
INSERT INTO users(name, service_id, uuid) VALUES('kaylCorp', 1, '445e0839-51b6-49f7-a315-68890a6dfb56');
INSERT INTO users(name, service_id, uuid) VALUES('juanCorp', 2, 'ea534cba-6897-4f29-bc25-62e457d346cc');
INSERT INTO users(name, service_id, uuid) VALUES('armandoCorp', 2, 'b56eff7b-c8dd-4008-a260-ed2a9dafefae');
INSERT INTO users(name, service_id, uuid) VALUES('kevinCorp', 3, '06eea3f4-dc0e-4621-bae0-485b8d8db799');

INSERT INTO endpoints(url, user_id, uuid) VALUES('www.url.com', 1, 'bcfba494-60ef-4287-b9ff-a915535bee9b');

INSERT INTO subscriptions(endpoint_id, event_type_id, subscription_arn) VALUES(1, 1, '1762');
INSERT INTO subscriptions(endpoint_id, event_type_id, subscription_arn) VALUES(1, 2, '7836');
INSERT INTO subscriptions(endpoint_id, event_type_id, subscription_arn) VALUES(1, 3, '2278');

INSERT INTO events(event_type_id, user_id, payload) VALUES(1, 1, '{"title": "Sleeping Beauties", "genres": ["Fiction", "Thriller", "Horror"], "published": false}');
INSERT INTO events(event_type_id, user_id, payload) VALUES(1, 1, '{"title": "Influence", "genres": ["Marketing & Sales", "Self-Help ", "Psychology"], "published": true}');
INSERT INTO events(event_type_id, user_id, payload) VALUES(1, 1, '{"title": "Deep Work", "genres": ["Productivity", "Reference"], "published": true}');

INSERT INTO messages(event_id, endpoint, delivery_attempt, status_code, delivered) VALUES(1, 'www.url.com', 1, 200, true);
INSERT INTO messages(event_id, endpoint, delivery_attempt, status_code, delivered) VALUES(2, 'www.url.com', 1, 200, true);
INSERT INTO messages(event_id, endpoint, delivery_attempt, status_code, delivered) VALUES(3, 'www.url.com', 1, 200, true);