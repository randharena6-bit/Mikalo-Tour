-- ============================================================
-- MIKALO TOUR – Schéma Complet de la Base de Données
-- Version 2.0 – Juin 2026
-- ============================================================

DROP DATABASE IF EXISTS mikalo_tour;
CREATE DATABASE mikalo_tour;
\c mikalo_tour;

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TYPES ENUM
-- ============================================================
CREATE TYPE user_role AS ENUM ('tourist', 'guide', 'agency', 'admin');
CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended', 'banned');
CREATE TYPE guide_status AS ENUM ('pending', 'certified', 'rejected');
CREATE TYPE agency_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded');
CREATE TYPE booking_type AS ENUM ('guide_hourly', 'guide_daily', 'guide_tour', 'agency_package', 'agency_trip', 'activity', 'combo');
CREATE TYPE payment_method AS ENUM ('mvola', 'orange_money', 'airtel_money', 'visa', 'mastercard', 'paypal', 'stripe');
CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded');
CREATE TYPE conversation_type AS ENUM ('direct', 'group');
CREATE TYPE message_type AS ENUM ('text', 'image', 'document', 'audio', 'video', 'location');
CREATE TYPE post_author_type AS ENUM ('tourist', 'guide', 'agency');
CREATE TYPE story_author_type AS ENUM ('tourist', 'guide', 'agency');
CREATE TYPE notification_type AS ENUM (
  'booking_confirmed', 'booking_cancelled', 'booking_reminder',
  'new_message', 'new_review', 'review_response',
  'payment_received', 'payout_processed',
  'guide_request', 'agency_invitation',
  'partnership_request', 'partnership_accepted',
  'promotion', 'system'
);
CREATE TYPE target_type AS ENUM ('guide', 'agency', 'activity', 'circuit');
CREATE TYPE favorite_target_type AS ENUM ('guide', 'agency', 'circuit', 'activity');
CREATE TYPE partnership_status AS ENUM ('pending', 'active', 'suspended', 'terminated');
CREATE TYPE circuit_difficulty AS ENUM ('easy', 'moderate', 'hard');
CREATE TYPE activity_category AS ENUM ('hiking', 'diving', 'safari', 'cultural', 'water', 'adventure', 'relaxation', 'other');

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           VARCHAR(255) NOT NULL UNIQUE,
  password        VARCHAR(255),
  name            VARCHAR(255) NOT NULL,
  first_name      VARCHAR(255),
  phone           VARCHAR(50),
  avatar          TEXT,
  bio             TEXT,
  role            user_role NOT NULL DEFAULT 'tourist',
  status          user_status NOT NULL DEFAULT 'active',
  languages       TEXT[] DEFAULT '{}',
  preferences     JSONB DEFAULT '{}',
  email_verified  BOOLEAN DEFAULT FALSE,
  phone_verified  BOOLEAN DEFAULT FALSE,
  auth_provider   VARCHAR(50) DEFAULT 'email',
  auth_provider_id VARCHAR(255),
  last_login_at   TIMESTAMPTZ,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- ============================================================
-- TABLE: guides
-- ============================================================
CREATE TABLE guides (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  certification         VARCHAR(255),
  certification_document TEXT,
  identity_document     TEXT,
  experience            INTEGER DEFAULT 0,
  specialties           TEXT[] DEFAULT '{}',
  zones                 TEXT[] DEFAULT '{}',
  languages             TEXT[] DEFAULT '{}',
  status                guide_status NOT NULL DEFAULT 'pending',
  hourly_rate           DECIMAL(10,2) DEFAULT 0,
  daily_rate            DECIMAL(10,2) DEFAULT 0,
  currency              VARCHAR(10) DEFAULT 'MGA',
  rating                DECIMAL(2,1) DEFAULT 0,
  review_count          INTEGER DEFAULT 0,
  total_bookings        INTEGER DEFAULT 0,
  availability          JSONB DEFAULT '{}',
  is_premium            BOOLEAN DEFAULT FALSE,
  featured              BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_guides_user_id ON guides(user_id);
CREATE INDEX idx_guides_status ON guides(status);
CREATE INDEX idx_guides_rating ON guides(rating DESC);
CREATE INDEX idx_guides_zones ON guides USING GIN(zones);
CREATE INDEX idx_guides_specialties ON guides USING GIN(specialties);

-- ============================================================
-- TABLE: agencies
-- ============================================================
CREATE TABLE agencies (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name                VARCHAR(255) NOT NULL,
  logo                TEXT,
  description         TEXT,
  address             VARCHAR(255),
  city                VARCHAR(100),
  region              VARCHAR(100),
  country             VARCHAR(100) DEFAULT 'Madagascar',
  phone               VARCHAR(50),
  website             VARCHAR(255),
  registration_number VARCHAR(100),
  business_license    TEXT,
  operating_permit    TEXT,
  status              agency_status NOT NULL DEFAULT 'pending',
  services            TEXT[] DEFAULT '{}',
  regions             TEXT[] DEFAULT '{}',
  rating              DECIMAL(2,1) DEFAULT 0,
  review_count        INTEGER DEFAULT 0,
  total_bookings      INTEGER DEFAULT 0,
  is_premium          BOOLEAN DEFAULT FALSE,
  featured            BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_agencies_user_id ON agencies(user_id);
CREATE INDEX idx_agencies_status ON agencies(status);
CREATE INDEX idx_agencies_rating ON agencies(rating DESC);
CREATE INDEX idx_agencies_regions ON agencies USING GIN(regions);

-- ============================================================
-- TABLE: guide_agencies (partenariat)
-- ============================================================
CREATE TABLE guide_agencies (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id        UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  agency_id       UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  status          partnership_status NOT NULL DEFAULT 'pending',
  commission_rate DECIMAL(5,2) DEFAULT 15.00,
  started_at      TIMESTAMPTZ,
  ended_at        TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(guide_id, agency_id)
);

CREATE INDEX idx_guide_agencies_guide ON guide_agencies(guide_id);
CREATE INDEX idx_guide_agencies_agency ON guide_agencies(agency_id);

-- ============================================================
-- TABLE: circuits
-- ============================================================
CREATE TABLE circuits (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_type     VARCHAR(20) NOT NULL,
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  region          VARCHAR(100),
  duration        INTEGER,
  duration_unit   VARCHAR(10) DEFAULT 'day',
  price           DECIMAL(12,2) DEFAULT 0,
  currency        VARCHAR(10) DEFAULT 'MGA',
  max_participants INTEGER DEFAULT 10,
  inclusions      TEXT[] DEFAULT '{}',
  exclusions      TEXT[] DEFAULT '{}',
  itinerary       JSONB DEFAULT '[]',
  images          TEXT[] DEFAULT '{}',
  tags            TEXT[] DEFAULT '{}',
  difficulty      circuit_difficulty DEFAULT 'moderate',
  is_active       BOOLEAN DEFAULT TRUE,
  rating          DECIMAL(2,1) DEFAULT 0,
  review_count    INTEGER DEFAULT 0,
  booking_count   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_circuits_author ON circuits(author_id);
CREATE INDEX idx_circuits_region ON circuits(region);
CREATE INDEX idx_circuits_active ON circuits(is_active);
CREATE INDEX idx_circuits_rating ON circuits(rating DESC);

-- ============================================================
-- TABLE: activities
-- ============================================================
CREATE TABLE activities (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_type     VARCHAR(20) NOT NULL,
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  category        activity_category DEFAULT 'other',
  location        JSONB,
  region          VARCHAR(100),
  duration        INTEGER,
  duration_unit   VARCHAR(10) DEFAULT 'hour',
  price           DECIMAL(12,2) DEFAULT 0,
  currency        VARCHAR(10) DEFAULT 'MGA',
  max_participants INTEGER DEFAULT 20,
  images          TEXT[] DEFAULT '{}',
  includes        TEXT[] DEFAULT '{}',
  is_active       BOOLEAN DEFAULT TRUE,
  rating          DECIMAL(2,1) DEFAULT 0,
  review_count    INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_activities_author ON activities(author_id);
CREATE INDEX idx_activities_region ON activities(region);
CREATE INDEX idx_activities_category ON activities(category);
CREATE INDEX idx_activities_active ON activities(is_active);

-- ============================================================
-- TABLE: bookings
-- ============================================================
CREATE TABLE bookings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference         VARCHAR(20) UNIQUE,
  tourist_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  guide_id          UUID REFERENCES guides(id),
  agency_id         UUID REFERENCES agencies(id),
  type              booking_type NOT NULL,
  status            booking_status NOT NULL DEFAULT 'pending',
  start_date        TIMESTAMPTZ NOT NULL,
  end_date          TIMESTAMPTZ NOT NULL,
  duration          INTEGER,
  duration_unit     VARCHAR(10) DEFAULT 'day',
  adults            INTEGER DEFAULT 1,
  children          INTEGER DEFAULT 0,
  total_amount      DECIMAL(12,2) NOT NULL,
  commission_amount DECIMAL(12,2) DEFAULT 0,
  net_amount        DECIMAL(12,2) DEFAULT 0,
  currency          VARCHAR(10) DEFAULT 'MGA',
  notes             TEXT,
  special_requests  TEXT,
  meeting_point     VARCHAR(255),
  cancellation_reason TEXT,
  cancelled_at      TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  items             JSONB DEFAULT '[]',
  metadata          JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_bookings_tourist ON bookings(tourist_id);
CREATE INDEX idx_bookings_guide ON bookings(guide_id);
CREATE INDEX idx_bookings_agency ON bookings(agency_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_bookings_reference ON bookings(reference);

-- ============================================================
-- TABLE: payments
-- ============================================================
CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id      UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  payer_id        UUID NOT NULL REFERENCES users(id),
  payee_id        UUID REFERENCES users(id),
  amount          DECIMAL(12,2) NOT NULL,
  commission      DECIMAL(12,2) DEFAULT 0,
  net_amount      DECIMAL(12,2) DEFAULT 0,
  currency        VARCHAR(10) DEFAULT 'MGA',
  method          payment_method NOT NULL,
  status          payment_status NOT NULL DEFAULT 'pending',
  transaction_id  VARCHAR(255),
  receipt_url     TEXT,
  paid_at         TIMESTAMPTZ,
  refunded_at     TIMESTAMPTZ,
  refund_reason   TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_payer ON payments(payer_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);

-- ============================================================
-- TABLE: reviews
-- ============================================================
CREATE TABLE reviews (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id       UUID NOT NULL REFERENCES users(id),
  target_type       target_type NOT NULL,
  target_id         UUID NOT NULL,
  booking_id        UUID REFERENCES bookings(id),
  rating            INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment           TEXT,
  images            TEXT[] DEFAULT '{}',
  response_from_owner TEXT,
  response_at       TIMESTAMPTZ,
  is_verified       BOOLEAN DEFAULT FALSE,
  helpful_count     INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_reviews_target ON reviews(target_type, target_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_booking ON reviews(booking_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================================
-- TABLE: conversations
-- ============================================================
CREATE TABLE conversations (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type                conversation_type NOT NULL DEFAULT 'direct',
  title               VARCHAR(255),
  last_message_at     TIMESTAMPTZ,
  last_message_preview VARCHAR(255),
  participant_ids     UUID[] NOT NULL,
  metadata            JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_conversations_participants ON conversations USING GIN(participant_ids);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC NULLS LAST);

-- ============================================================
-- TABLE: messages
-- ============================================================
CREATE TABLE messages (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id   UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id         UUID NOT NULL REFERENCES users(id),
  content           TEXT,
  type              message_type NOT NULL DEFAULT 'text',
  file_url          TEXT,
  file_metadata     JSONB DEFAULT '{}',
  translation       JSONB DEFAULT '{}',
  read_by           UUID[] DEFAULT '{}',
  read_at           TIMESTAMPTZ,
  is_edited         BOOLEAN DEFAULT FALSE,
  edited_at         TIMESTAMPTZ,
  deleted_for       UUID[] DEFAULT '{}',
  reply_to_id       UUID,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at);

-- ============================================================
-- TABLE: posts (réseau social)
-- ============================================================
CREATE TABLE posts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_type   post_author_type NOT NULL,
  content       TEXT,
  images        TEXT[] DEFAULT '{}',
  videos        TEXT[] DEFAULT '{}',
  tags          TEXT[] DEFAULT '{}',
  location      JSONB,
  like_count    INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count   INTEGER DEFAULT 0,
  is_pinned     BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- ============================================================
-- TABLE: stories
-- ============================================================
CREATE TABLE stories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_type story_author_type NOT NULL,
  media_url   TEXT NOT NULL,
  media_type  VARCHAR(10) DEFAULT 'image',
  caption     VARCHAR(255),
  viewed_by   UUID[] DEFAULT '{}',
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE INDEX idx_stories_author ON stories(author_id);
CREATE INDEX idx_stories_expires ON stories(expires_at);

-- ============================================================
-- TABLE: notifications
-- ============================================================
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        notification_type NOT NULL,
  title       VARCHAR(255) NOT NULL,
  body        TEXT,
  data        JSONB DEFAULT '{}',
  is_read     BOOLEAN DEFAULT FALSE,
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================================
-- TABLE: favorites
-- ============================================================
CREATE TABLE favorites (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type favorite_target_type NOT NULL,
  target_id   UUID NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_target ON favorites(target_type, target_id);

-- ============================================================
-- FONCTIONS ET TRIGGERS
-- ============================================================

-- Mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_guides_updated_at BEFORE UPDATE ON guides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_agencies_updated_at BEFORE UPDATE ON agencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Génération automatique d'une référence de réservation
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  ref TEXT;
BEGIN
  ref := 'MT-';
  FOR i IN 1..8 LOOP
    ref := ref || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  NEW.reference := ref;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_bookings_reference BEFORE INSERT ON bookings
  FOR EACH ROW WHEN (NEW.reference IS NULL)
  EXECUTE FUNCTION generate_booking_reference();

-- ============================================================
-- VUES UTILES
-- ============================================================

-- Vue : guides avec leurs infos utilisateur
CREATE OR REPLACE VIEW v_guides_complete AS
SELECT
  g.*,
  u.email, u.name AS user_name, u.first_name, u.phone, u.avatar, u.bio AS user_bio,
  u.languages AS user_languages, u.last_login_at
FROM guides g
JOIN users u ON u.id = g.user_id
WHERE g.deleted_at IS NULL AND u.deleted_at IS NULL;

-- Vue : agences avec leurs infos utilisateur
CREATE OR REPLACE VIEW v_agencies_complete AS
SELECT
  a.*,
  u.email, u.phone AS user_phone, u.avatar AS user_avatar
FROM agencies a
JOIN users u ON u.id = a.user_id
WHERE a.deleted_at IS NULL AND u.deleted_at IS NULL;

-- Vue : statistiques tableau de bord
CREATE OR REPLACE VIEW v_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL) AS total_users,
  (SELECT COUNT(*) FROM guides WHERE deleted_at IS NULL) AS total_guides,
  (SELECT COUNT(*) FROM agencies WHERE deleted_at IS NULL) AS total_agencies,
  (SELECT COUNT(*) FROM bookings WHERE deleted_at IS NULL) AS total_bookings,
  (SELECT COUNT(*) FROM bookings WHERE status = 'completed' AND deleted_at IS NULL) AS completed_bookings,
  (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE deleted_at IS NULL) AS total_revenue,
  (SELECT COUNT(*) FROM guides WHERE status = 'pending') AS pending_guides,
  (SELECT COUNT(*) FROM agencies WHERE status = 'pending') AS pending_agencies,
  (SELECT COUNT(*) FROM users WHERE created_at >= date_trunc('month', NOW())) AS new_users_this_month;

-- ============================================================
-- DONNÉES DE TEST
-- ============================================================

-- Admin
INSERT INTO users (id, email, password, name, role, status, email_verified)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@mikalo.mg',
  crypt('Admin@2026', gen_salt('bf', 12)),
  'Admin Mikalo',
  'admin',
  'active',
  TRUE
);

-- Touristes
INSERT INTO users (id, email, password, name, role, languages, preferences)
VALUES
  ('00000000-0000-0000-0000-000000000010', 'jean@example.com', crypt('Pass1234', gen_salt('bf', 12)), 'Jean Dupont', 'tourist', ARRAY['french', 'english'], '{"budget": 2000, "currency": "EUR", "interests": ["beach", "nature"]}'),
  ('00000000-0000-0000-0000-000000000011', 'sarah@example.com', crypt('Pass1234', gen_salt('bf', 12)), 'Sarah Johnson', 'tourist', ARRAY['english', 'spanish'], '{"budget": 3000, "currency": "USD", "interests": ["culture", "hiking"]}');

-- Guides
INSERT INTO users (id, email, password, name, role, status, email_verified, phone, avatar)
VALUES
  ('00000000-0000-0000-0000-000000000020', 'rajao@example.com', crypt('Pass1234', gen_salt('bf', 12)), 'Rajaobelina Andry', 'guide', 'active', TRUE, '+261 34 12 345 67', NULL),
  ('00000000-0000-0000-0000-000000000021', 'mialy@example.com', crypt('Pass1234', gen_salt('bf', 12)), 'Mialy Razafy', 'guide', 'active', TRUE, '+261 33 98 765 43', NULL),
  ('00000000-0000-0000-0000-000000000022', 'tovo@example.com', crypt('Pass1234', gen_salt('bf', 12)), 'Tovo Heriniaina', 'guide', 'active', TRUE, '+261 32 56 789 01', NULL);

INSERT INTO guides (id, user_id, certification, experience, specialties, zones, languages, status, hourly_rate, daily_rate, rating, review_count, total_bookings)
VALUES
  ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000020', 'Guide national certifié', 8,
   ARRAY['Randonnée', 'Culture', 'Photographie'], ARRAY['Antananarivo', 'Andasibe', 'Tsingy'],
   ARRAY['malagasy', 'french', 'english'], 'certified', 25000, 150000, 4.8, 45, 120),
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000021', 'Guide nature spécialisé', 5,
   ARRAY['Plongée', 'Snorkeling', 'Bateau'], ARRAY['Nosy Be', 'Sainte-Marie', 'Ifaty'],
   ARRAY['malagasy', 'french', 'english', 'spanish'], 'certified', 30000, 180000, 4.9, 32, 85),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000022', 'Guide parc national', 3,
   ARRAY['Safari', 'Observation faune', 'Botanique'], ARRAY['Ranomafana', 'Isalo', 'Ankarafantsika'],
   ARRAY['malagasy', 'french'], 'certified', 20000, 120000, 4.6, 18, 45);

-- Agences
INSERT INTO users (id, email, password, name, role, status, email_verified)
VALUES
  ('00000000-0000-0000-0000-000000000030', 'contact@travel-mada.com', crypt('Pass1234', gen_salt('bf', 12)), 'Travel Mada', 'agency', 'active', TRUE),
  ('00000000-0000-0000-0000-000000000031', 'info@explore-mada.mg', crypt('Pass1234', gen_salt('bf', 12)), 'Explore Madagascar', 'agency', 'active', TRUE);

INSERT INTO agencies (id, user_id, name, description, city, region, phone, website, services, regions, status, rating, review_count, total_bookings)
VALUES
  ('00000000-0000-0000-0000-000000000200', '00000000-0000-0000-0000-000000000030', 'Travel Mada SARL',
   'Agence de voyage spécialisée dans les circuits Nord et Ouest de Madagascar. 10 ans d''expérience.',
   'Antananarivo', 'Analamanga', '+261 20 22 345 67', 'https://travel-mada.com',
   ARRAY['Circuits organisés', 'Location véhicule', 'Réservation hôtel', 'Guide privé'],
   ARRAY['Antananarivo', 'Nosy Be', 'Tsingy', 'Majunga'], 'verified', 4.7, 28, 350),
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000031', 'Explore Madagascar',
   'Agence premium pour voyages sur mesure à Madagascar. Circuits écologiques et responsables.',
   'Antananarivo', 'Analamanga', '+261 20 24 567 89', 'https://explore-mada.mg',
   ARRAY['Voyages sur mesure', 'Écotourisme', 'Expeditions', 'Circuit Sud'],
   ARRAY['Antananarivo', 'Ranomafana', 'Isalo', 'Fort-Dauphin', 'Tuléar'], 'verified', 4.9, 42, 520);

-- Partenariats guide-agence
INSERT INTO guide_agencies (guide_id, agency_id, status, commission_rate, started_at)
VALUES
  ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200', 'active', 12.00, NOW() - INTERVAL '2 years'),
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', 'active', 10.00, NOW() - INTERVAL '1 year'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000200', 'pending', 15.00, NULL);

-- Circuits
INSERT INTO circuits (id, author_id, author_type, title, description, region, duration, price, currency, difficulty, itinerary, tags, rating, review_count)
VALUES
  ('00000000-0000-0000-0000-000000000300', '00000000-0000-0000-0000-000000000030', 'agency',
   'Circuit Nord – Nosy Be et Tsingy',
   'Un circuit de 7 jours combinant les plages paradisiaques de Nosy Be et les formations calcaires uniques du Tsingy de Bemaraha.',
   'Nosy Be / Tsingy', 7, 1200000, 'MGA', 'moderate',
   '[{"day": 1, "title": "Arrivée à Nosy Be", "activities": ["Installation", "Plage"], "accommodation": "Hôtel 3*"}, {"day": 2, "title": "Exploration Nosy Be", "activities": ["Visite des plantations", "Snorkeling"]}, {"day": 3, "title": "Vol vers Morondava", "activities": ["Route vers Tsingy"]}, {"day": 4, "title": "Tsingy de Bemaraha", "activities": ["Randonnée", "Canoë"], "accommodation": "Lodge"}, {"day": 5, "title": "Suite Tsingy", "activities": ["Visite des canyons"]}, {"day": 6, "title": "Retour Morondava", "activities": ["Baobabs au coucher du soleil"]}, {"day": 7, "title": "Départ", "activities": ["Vol retour"]}]',
   ARRAY['Nosy Be', 'Tsingy', 'Baobabs', 'Plage'], 4.8, 15),

  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000031', 'agency',
   'Circuit Sud – Aventure et Nature',
   '8 jours à travers le sud de Madagascar : Ranomafana, Isalo, Tuléar. Pour les amateurs de nature et d''aventure.',
   'Sud Madagascar', 8, 1800000, 'MGA', 'hard',
   '[{"day": 1, "title": "Tana vers Ranomafana", "activities": ["Route pittoresque"]}, {"day": 2, "title": "Parc Ranomafana", "activities": ["Randonnée", "Lémuriens dorés"]}, {"day": 3, "title": "Route vers Isalo", "activities": ["Paysages"], "accommodation": "Lodge"}, {"day": 4, "title": "Parc national Isalo", "activities": ["Canyons", "Piscines naturelles"]}, {"day": 5, "title": "Suite Isalo", "activities": ["Randonnée intégrale"]}, {"day": 6, "title": "Vers Tuléar", "activities": ["Route", "Village Antanosy"]}, {"day": 7, "title": "Ifaty", "activities": ["Plongée", "Plage"], "accommodation": "Hôtel plage"}, {"day": 8, "title": "Départ", "activities": ["Vol retour"]}]',
   ARRAY['Ranomafana', 'Isalo', 'Ifaty', 'Aventure'], 4.9, 22);

-- Activités
INSERT INTO activities (id, author_id, author_type, title, description, category, region, duration, price, currency, max_participants)
VALUES
  ('00000000-0000-0000-0000-000000000400', '00000000-0000-0000-0000-000000000021', 'guide',
   'Plongée sous-marine à Nosy Be', 'Explorez les fonds marins exceptionnels de Nosy Be. Récifs coralliens, tortues, poissons tropicaux.',
   'diving', 'Nosy Be', 4, 80000, 'MGA', 8),
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000020', 'guide',
   'Randonnée Tsingy – Journée complète', 'Une journée d''exploration des Tsingy de Bemaraha avec guide certifié. Équipement fourni.',
   'hiking', 'Tsingy', 8, 120000, 'MGA', 6),
  ('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000030', 'agency',
   'Safari photo Allée des Baobabs', 'Session photo au coucher du soleil dans l''allée mythique des Baobabs.',
   'safari', 'Morondava', 3, 45000, 'MGA', 15);

-- Réservations
INSERT INTO bookings (id, reference, tourist_id, guide_id, agency_id, type, status, start_date, end_date, duration, total_amount, commission_amount, net_amount, currency, adults, notes)
VALUES
  ('00000000-0000-0000-0000-000000000500', 'MT-A3B7K9X1', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000100', NULL, 'guide_daily', 'completed',
   NOW() - INTERVAL '30 days', NOW() - INTERVAL '27 days', 3, 450000, 45000, 405000, 'MGA', 2, 'Excellent guide, très professionnel'),
  ('00000000-0000-0000-0000-000000000501', 'MT-C5D8F2E6', '00000000-0000-0000-0000-000000000011', NULL, '00000000-0000-0000-0000-000000000200', 'agency_package', 'confirmed',
   NOW() + INTERVAL '15 days', NOW() + INTERVAL '22 days', 7, 1200000, 96000, 1104000, 'MGA', 1, 'Circuit Nord complet');

-- Paiements
INSERT INTO payments (booking_id, payer_id, payee_id, amount, commission, net_amount, currency, method, status, transaction_id, paid_at)
VALUES
  ('00000000-0000-0000-0000-000000000500', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000020', 450000, 45000, 405000, 'MGA', 'mvola', 'success', 'MVOLA-TX-20260601-001', NOW() - INTERVAL '30 days'),
  ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000030', 1200000, 96000, 1104000, 'MGA', 'orange_money', 'success', 'OM-TX-20260605-001', NOW() - INTERVAL '5 days');

-- Avis
INSERT INTO reviews (reviewer_id, target_type, target_id, booking_id, rating, comment, is_verified)
VALUES
  ('00000000-0000-0000-0000-000000000010', 'guide', '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000500',
   5, 'Andry est un guide exceptionnel ! Il connaît parfaitement la région et ses explications sont passionnantes. Je recommande vivement.', TRUE),
  ('00000000-0000-0000-0000-000000000011', 'agency', '00000000-0000-0000-0000-000000000200', '00000000-0000-0000-0000-000000000501',
   4, 'Très bonne organisation, circuit bien planifié. Petit bémol sur le transport qui était en retard.', TRUE);

-- Posts (réseau social)
INSERT INTO posts (author_id, author_type, content, images, tags, like_count, comment_count)
VALUES
  ('00000000-0000-0000-0000-000000000010', 'tourist',
   'Quelle journée incroyable à l''Allée des Baobabs ! Le coucher de soleil était magique 🌅',
   ARRAY['https://images.tourisme.gov.mg/wp-content/uploads/2022/07/Allee-des-Baobabs.jpg'],
   ARRAY['baobabs', 'madagascar', 'sunset'], 24, 5),
  ('00000000-0000-0000-0000-000000000020', 'guide',
   'Nouveau circuit découverte du Tsingy de Bemaraha. Préparez-vous pour une aventure inoubliable ! 🇲🇬',
   ARRAY['https://images.tourisme.gov.mg/wp-content/uploads/2022/07/Avenue-des-baobabs-a-Madagascar.jpg'],
   ARRAY['tsingy', 'guide', 'aventure'], 18, 3),
  ('00000000-0000-0000-0000-000000000030', 'agency',
   'Promotion spéciale été : -20% sur tous les circuits Nord. Réservez avant le 31 juillet !',
   NULL, ARRAY['promotion', 'circuit', 'nosybe'], 45, 8);

-- Notifications
INSERT INTO notifications (user_id, type, title, body, data)
VALUES
  ('00000000-0000-0000-0000-000000000010', 'booking_confirmed', 'Réservation confirmée',
   'Votre réservation #MT-A3B7K9X1 a été confirmée.', '{"bookingId": "00000000-0000-0000-0000-000000000500", "reference": "MT-A3B7K9X1"}'),
  ('00000000-0000-0000-0000-000000000020', 'new_review', '⭐ Nouvel avis reçu',
   'Jean Dupont a laissé un avis 5 étoiles.', '{"rating": 5}'),
  ('00000000-0000-0000-0000-000000000011', 'payment_received', 'Paiement reçu',
   '1 200 000 MGA reçu pour la réservation #MT-C5D8F2E6.', '{"amount": 1200000, "reference": "MT-C5D8F2E6"}');

-- Favorites
INSERT INTO favorites (user_id, target_type, target_id)
VALUES
  ('00000000-0000-0000-0000-000000000010', 'guide', '00000000-0000-0000-0000-000000000100'),
  ('00000000-0000-0000-0000-000000000010', 'circuit', '00000000-0000-0000-0000-000000000301'),
  ('00000000-0000-0000-0000-000000000011', 'agency', '00000000-0000-0000-0000-000000000201');

-- ============================================================
-- RAPPORT FINAL
-- ============================================================
SELECT
  'Base de données Mikalo Tour créée avec succès !' AS message,
  (SELECT COUNT(*) FROM users) AS total_users,
  (SELECT COUNT(*) FROM guides) AS total_guides,
  (SELECT COUNT(*) FROM agencies) AS total_agencies,
  (SELECT COUNT(*) FROM bookings) AS total_bookings,
  (SELECT COUNT(*) FROM circuits) AS total_circuits,
  (SELECT COUNT(*) FROM activities) AS total_activities,
  (SELECT COUNT(*) FROM payments) AS total_payments,
  (SELECT COUNT(*) FROM reviews) AS total_reviews;
