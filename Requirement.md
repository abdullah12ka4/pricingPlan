# SkilTrak Backend API Requirements
## Complete Backend Development Specification

**Version:** 1.0.0  
**Last Updated:** January 14, 2026  
**Status:** Ready for Implementation

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Entity Relationship Diagram](#entity-relationship-diagram)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Business Logic](#business-logic)
6. [Authentication & Authorization](#authentication--authorization)
7. [Validation Rules](#validation-rules)
8. [Error Handling](#error-handling)
9. [Webhooks & Events](#webhooks--events)
10. [Integration Requirements](#integration-requirements)

---

## 🎯 System Overview

SkilTrak is a comprehensive pricing and package management system that handles:
- Multi-tenant organization management
- Tiered pricing with volume-based student limits
- Quarterly network credit packages (WPO - Work Placement Opportunities)
- Add-on management with complex eligibility rules
- Sales agent quote generation with approval workflows
- Payment processing and invoicing
- Real-time credit consumption tracking
- Analytics and reporting

### Technology Stack (Recommended)
- **Runtime:** Node.js 18+ or Python 3.11+
- **Framework:** Express.js / Fastify / Django / FastAPI
- **Database:** PostgreSQL 14+
- **Cache:** Redis 7+
- **Message Queue:** RabbitMQ / AWS SQS
- **File Storage:** AWS S3 / Azure Blob Storage
- **Payment Gateway:** Stripe
- **Email Service:** SendGrid / AWS SES

---

## 🗂️ Entity Relationship Diagram

```
┌─────────────────┐
│  Organization   │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────┴────────┐       ┌──────────────────┐
│  Subscription   │──────│  NetworkCreditPack│
└────────┬────────┘  N:1  └──────────────────┘
         │ 1
         ├─────────────────┐
         │                 │
         │ N               │ N
┌────────┴────────┐ ┌─────┴──────────────┐
│SubscriptionAddOn│ │NetworkCreditBalance│
└────────┬────────┘ └─────┬──────────────┘
         │ N:1            │ 1
         │                │
         │                │ N
┌────────┴────────┐ ┌─────┴──────────────┐
│     AddOn       │ │NetworkCreditUsage  │
└─────────────────┘ └────────────────────┘

┌─────────────────┐       ┌──────────────────┐
│   PricingTier   │       │     Feature      │
└────────┬────────┘       └──────────────────┘
         │ N:1
         │
┌────────┴────────┐
│ OrganizationType│
└─────────────────┘

┌─────────────────┐       ┌──────────────────┐
│      User       │       │      Quote       │
│  (Sales Agent)  │───────│   (Sales Quote)  │
└─────────────────┘  1:N  └────────┬─────────┘
                                   │ 1
                                   │
                                   │ N
                            ┌──────┴──────────┐
                            │   QuoteItem     │
                            └─────────────────┘

┌─────────────────┐       ┌──────────────────┐
│  Subscription   │───────│     Payment      │
└─────────────────┘  1:N  └──────────────────┘

┌─────────────────┐       ┌──────────────────┐
│   AuditLog      │       │  BillingRule     │
└─────────────────┘       └──────────────────┘

┌─────────────────┐       ┌──────────────────┐
│    Discount     │       │     Invoice      │
└─────────────────┘       └────────┬─────────┘
                                   │ 1
                                   │
                                   │ N
                            ┌──────┴──────────┐
                            │  InvoiceItem    │
                            └─────────────────┘
```

---

## 💾 Database Schema

### 1. organizations

**Purpose:** Store training organization/customer information

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  organization_type VARCHAR(50) NOT NULL CHECK (organization_type IN ('school', 'rto', 'tafe', 'university', 'corporate')),
  abn_acn VARCHAR(20),
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Australia',
  primary_contact_name VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'trial')),
  billing_email VARCHAR(255),
  billing_contact_name VARCHAR(255),
  billing_phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT email_format CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_organizations_type ON organizations(organization_type);
CREATE INDEX idx_organizations_status ON organizations(status);
CREATE INDEX idx_organizations_email ON organizations(contact_email);
```

**Relationships:**
- Has many: subscriptions, network_credit_balances, quotes

---

### 2. users

**Purpose:** Store sales agents, admins, and system users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'sales_manager', 'sales_agent', 'finance', 'support')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  avatar_url TEXT,
  phone VARCHAR(50),
  department VARCHAR(100),
  employee_id VARCHAR(50),
  
  -- Sales-specific fields
  sales_target DECIMAL(12, 2),
  commission_rate DECIMAL(5, 2),
  
  -- Authentication
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  
  -- Security
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```

**Relationships:**
- Has many: quotes, audit_logs

---

### 3. pricing_tiers

**Purpose:** Store volume-based pricing tiers for each org type and plan

```sql
CREATE TABLE pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  organization_type VARCHAR(50) NOT NULL CHECK (organization_type IN ('school', 'rto', 'tafe', 'university', 'corporate')),
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('basic', 'premium')),
  min_students INTEGER NOT NULL,
  max_students INTEGER,
  annual_price DECIMAL(12, 2) NOT NULL,
  storage_gb INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deprecated')),
  description TEXT,
  
  -- Overage rules
  student_overage_rate DECIMAL(12, 2),
  storage_overage_rate DECIMAL(12, 2) DEFAULT 1.00,
  
  -- Display order
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT min_max_students CHECK (max_students IS NULL OR max_students > min_students),
  CONSTRAINT positive_price CHECK (annual_price >= 0)
);

CREATE INDEX idx_pricing_tiers_org_type ON pricing_tiers(organization_type);
CREATE INDEX idx_pricing_tiers_plan_type ON pricing_tiers(plan_type);
CREATE INDEX idx_pricing_tiers_status ON pricing_tiers(status);
CREATE UNIQUE INDEX idx_pricing_tiers_unique ON pricing_tiers(organization_type, plan_type, min_students) WHERE deleted_at IS NULL;
```

**Relationships:**
- Belongs to: organization_type
- Has many: subscriptions

---

### 4. features

**Purpose:** Store plan features for comparison

```sql
CREATE TABLE features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  
  -- Feature availability
  available_basic BOOLEAN DEFAULT TRUE,
  available_premium BOOLEAN DEFAULT TRUE,
  
  -- Feature values (can be boolean or custom text)
  value_basic VARCHAR(255),
  value_premium VARCHAR(255),
  
  -- Display
  sort_order INTEGER DEFAULT 0,
  icon VARCHAR(50),
  
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_features_category ON features(category);
CREATE INDEX idx_features_status ON features(status);
```

---

### 5. network_credit_packages

**Purpose:** Define available network credit packages

```sql
CREATE TABLE network_credit_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  credits INTEGER NOT NULL,
  price_per_credit DECIMAL(6, 4) NOT NULL,
  total_cost DECIMAL(12, 2) NOT NULL,
  billing_cycle VARCHAR(20) DEFAULT 'quarterly' CHECK (billing_cycle IN ('quarterly')),
  savings_percent DECIMAL(5, 2),
  is_best_value BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  description TEXT,
  
  -- Display
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT positive_credits CHECK (credits > 0),
  CONSTRAINT positive_price CHECK (price_per_credit > 0),
  CONSTRAINT valid_total CHECK (total_cost = credits * price_per_credit)
);

CREATE INDEX idx_network_packages_status ON network_credit_packages(status);
```

**Relationships:**
- Has many: subscriptions, network_credit_balances

---

### 6. addons

**Purpose:** Store add-on products and services

```sql
CREATE TABLE addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  
  -- Pricing
  pricing_model VARCHAR(50) NOT NULL CHECK (pricing_model IN ('recurring', 'one_time', 'pack', 'seat_based', 'per_student', 'usage_based')),
  price DECIMAL(12, 2),
  price_per_seat DECIMAL(12, 2),
  price_per_student DECIMAL(12, 2),
  price_per_unit DECIMAL(12, 2),
  billing_frequency VARCHAR(20) CHECK (billing_frequency IN ('annual', 'quarterly', 'monthly')),
  
  -- Eligibility
  eligible_plans TEXT[], -- ['basic', 'premium'] or ['premium']
  min_tier_required INTEGER,
  network_only BOOLEAN DEFAULT FALSE,
  requires_compliance BOOLEAN DEFAULT FALSE,
  
  -- Display
  icon VARCHAR(50),
  badge_text VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'coming_soon')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_addons_category ON addons(category);
CREATE INDEX idx_addons_status ON addons(status);
CREATE INDEX idx_addons_pricing_model ON addons(pricing_model);
```

**Relationships:**
- Has many: subscription_addons, quote_items

---

### 7. subscriptions

**Purpose:** Store active customer subscriptions

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  pricing_tier_id UUID NOT NULL REFERENCES pricing_tiers(id),
  network_package_id UUID REFERENCES network_credit_packages(id),
  
  -- Plan details
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('basic', 'premium')),
  current_students INTEGER NOT NULL DEFAULT 0,
  storage_used_gb DECIMAL(10, 2) DEFAULT 0,
  
  -- Billing
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial', 'past_due', 'suspended')),
  billing_cycle VARCHAR(20) DEFAULT 'annual' CHECK (billing_cycle IN ('annual', 'quarterly', 'monthly')),
  auto_renew BOOLEAN DEFAULT TRUE,
  
  -- Dates
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  trial_end_date DATE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  -- Setup fee
  setup_fee_paid BOOLEAN DEFAULT FALSE,
  setup_fee_amount DECIMAL(12, 2) DEFAULT 1000.00,
  
  -- Pricing snapshot (at time of subscription)
  annual_price DECIMAL(12, 2) NOT NULL,
  quarterly_price DECIMAL(12, 2),
  monthly_price DECIMAL(12, 2),
  
  -- Upgrade/downgrade tracking
  previous_subscription_id UUID REFERENCES subscriptions(id),
  upgrade_scheduled_date DATE,
  downgrade_scheduled_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_dates CHECK (end_date > start_date),
  CONSTRAINT positive_students CHECK (current_students >= 0)
);

CREATE INDEX idx_subscriptions_org ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_dates ON subscriptions(start_date, end_date);
CREATE INDEX idx_subscriptions_tier ON subscriptions(pricing_tier_id);
```

**Relationships:**
- Belongs to: organization, pricing_tier, network_credit_package
- Has many: subscription_addons, payments, invoices, network_credit_balance

---

### 8. subscription_addons

**Purpose:** Junction table for subscription add-ons

```sql
CREATE TABLE subscription_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  addon_id UUID NOT NULL REFERENCES addons(id),
  
  -- Quantity/configuration
  quantity INTEGER DEFAULT 1,
  
  -- Price snapshot at time of purchase
  price_snapshot DECIMAL(12, 2) NOT NULL,
  billing_frequency VARCHAR(20),
  
  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  start_date DATE NOT NULL,
  end_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_quantity CHECK (quantity > 0)
);

CREATE INDEX idx_subscription_addons_subscription ON subscription_addons(subscription_id);
CREATE INDEX idx_subscription_addons_addon ON subscription_addons(addon_id);
CREATE INDEX idx_subscription_addons_status ON subscription_addons(status);
CREATE UNIQUE INDEX idx_subscription_addons_unique ON subscription_addons(subscription_id, addon_id) WHERE status = 'active';
```

**Relationships:**
- Belongs to: subscription, addon

---

### 9. network_credit_balance

**Purpose:** Track credit balance per organization

```sql
CREATE TABLE network_credit_balance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  package_id UUID REFERENCES network_credit_packages(id),
  
  -- Balance
  credits_purchased INTEGER NOT NULL,
  credits_used INTEGER DEFAULT 0,
  credits_remaining INTEGER NOT NULL,
  
  -- Billing period
  quarter_start_date DATE NOT NULL,
  quarter_end_date DATE NOT NULL,
  
  -- Alerts
  low_credit_alert_sent BOOLEAN DEFAULT FALSE,
  expiry_warning_sent BOOLEAN DEFAULT FALSE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'depleted')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_credits CHECK (credits_used <= credits_purchased),
  CONSTRAINT valid_remaining CHECK (credits_remaining = credits_purchased - credits_used),
  CONSTRAINT valid_quarter CHECK (quarter_end_date > quarter_start_date)
);

CREATE INDEX idx_credit_balance_org ON network_credit_balance(organization_id);
CREATE INDEX idx_credit_balance_subscription ON network_credit_balance(subscription_id);
CREATE INDEX idx_credit_balance_status ON network_credit_balance(status);
CREATE INDEX idx_credit_balance_expiry ON network_credit_balance(quarter_end_date);
```

**Relationships:**
- Belongs to: organization, subscription, network_credit_package
- Has many: network_credit_usage

---

### 10. network_credit_usage

**Purpose:** Track individual credit consumption per student placement

```sql
CREATE TABLE network_credit_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  credit_balance_id UUID NOT NULL REFERENCES network_credit_balance(id),
  
  -- Student details
  student_id VARCHAR(100) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  student_course VARCHAR(255),
  
  -- Placement details
  industry_category VARCHAR(100) NOT NULL,
  placement_organization VARCHAR(255) NOT NULL,
  activity_type VARCHAR(100) DEFAULT 'placement_matching',
  
  -- Credit consumption
  credits_used INTEGER DEFAULT 1,
  
  -- Status
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled', 'refunded')),
  
  -- Tracking
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_credits CHECK (credits_used > 0)
);

CREATE INDEX idx_credit_usage_org ON network_credit_usage(organization_id);
CREATE INDEX idx_credit_usage_balance ON network_credit_usage(credit_balance_id);
CREATE INDEX idx_credit_usage_student ON network_credit_usage(student_id);
CREATE INDEX idx_credit_usage_industry ON network_credit_usage(industry_category);
CREATE INDEX idx_credit_usage_date ON network_credit_usage(matched_at);
```

**Relationships:**
- Belongs to: organization, network_credit_balance

---

### 11. quotes

**Purpose:** Store sales quotes created by agents

```sql
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  sales_agent_id UUID NOT NULL REFERENCES users(id),
  
  -- Client information
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50),
  client_organization VARCHAR(255) NOT NULL,
  organization_type VARCHAR(50) NOT NULL,
  
  -- Quote configuration
  plan_type VARCHAR(20) NOT NULL,
  pricing_tier_id UUID NOT NULL REFERENCES pricing_tiers(id),
  network_package_id UUID REFERENCES network_credit_packages(id),
  
  -- Totals
  subtotal DECIMAL(12, 2) NOT NULL,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL,
  
  -- Annual/quarterly breakdown
  annual_total DECIMAL(12, 2),
  quarterly_total DECIMAL(12, 2),
  monthly_total DECIMAL(12, 2),
  one_time_total DECIMAL(12, 2),
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'paid', 'expired', 'declined')),
  
  -- Dates
  valid_until DATE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Notes
  internal_notes TEXT,
  client_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_quotes_agent ON quotes(sales_agent_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_client_email ON quotes(client_email);
CREATE INDEX idx_quotes_number ON quotes(quote_number);
CREATE INDEX idx_quotes_dates ON quotes(created_at, valid_until);
```

**Relationships:**
- Belongs to: user (sales_agent), pricing_tier, network_credit_package
- Has many: quote_items, discounts, payment_links

---

### 12. quote_items

**Purpose:** Store line items for quotes (add-ons)

```sql
CREATE TABLE quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  addon_id UUID REFERENCES addons(id),
  
  -- Item details
  item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('addon', 'tier', 'network_package', 'setup_fee', 'custom')),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Pricing
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  billing_frequency VARCHAR(20),
  
  -- Display
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  CONSTRAINT valid_total CHECK (total_price = quantity * unit_price)
);

CREATE INDEX idx_quote_items_quote ON quote_items(quote_id);
CREATE INDEX idx_quote_items_addon ON quote_items(addon_id);
```

**Relationships:**
- Belongs to: quote, addon (optional)

---

### 13. discounts

**Purpose:** Store discount information for quotes

```sql
CREATE TABLE discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  
  -- Discount details
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'bundle', 'volume', 'seasonal')),
  discount_value DECIMAL(12, 4) NOT NULL,
  discount_amount DECIMAL(12, 2) NOT NULL,
  
  -- Justification
  reason TEXT NOT NULL,
  code VARCHAR(50),
  
  -- Approval
  requires_approval BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  approval_status VARCHAR(20) CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  
  -- Validity
  valid_from DATE,
  valid_until DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_value CHECK (discount_value > 0),
  CONSTRAINT percentage_range CHECK (discount_type != 'percentage' OR discount_value <= 100)
);

CREATE INDEX idx_discounts_quote ON discounts(quote_id);
CREATE INDEX idx_discounts_subscription ON discounts(subscription_id);
CREATE INDEX idx_discounts_approval ON discounts(approval_status);
CREATE INDEX idx_discounts_code ON discounts(code);
```

**Relationships:**
- Belongs to: quote, subscription, user (approver)

---

### 14. payment_links

**Purpose:** Store unique payment links for quotes

```sql
CREATE TABLE payment_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  
  -- Link details
  token VARCHAR(255) UNIQUE NOT NULL,
  url TEXT NOT NULL,
  
  -- Expiry
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expiry_days INTEGER DEFAULT 7,
  
  -- Tracking
  viewed BOOLEAN DEFAULT FALSE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'used', 'cancelled')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_links_quote ON payment_links(quote_id);
CREATE INDEX idx_payment_links_token ON payment_links(token);
CREATE INDEX idx_payment_links_status ON payment_links(status);
CREATE INDEX idx_payment_links_expiry ON payment_links(expires_at);
```

**Relationships:**
- Belongs to: quote

---

### 15. payments

**Purpose:** Store payment transactions

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id),
  quote_id UUID REFERENCES quotes(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  invoice_id UUID REFERENCES invoices(id),
  
  -- Payment details
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'AUD',
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('card', 'bank_transfer', 'paypal', 'invoice', 'stripe')),
  
  -- External references
  transaction_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  
  -- Payment method details
  card_last4 VARCHAR(4),
  card_brand VARCHAR(50),
  bank_reference VARCHAR(255),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
  
  -- Failure details
  failure_code VARCHAR(100),
  failure_message TEXT,
  
  -- Receipt
  receipt_url TEXT,
  receipt_number VARCHAR(100),
  
  -- Dates
  processed_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_amount CHECK (amount > 0)
);

CREATE INDEX idx_payments_subscription ON payments(subscription_id);
CREATE INDEX idx_payments_quote ON payments(quote_id);
CREATE INDEX idx_payments_organization ON payments(organization_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_date ON payments(created_at);
```

**Relationships:**
- Belongs to: subscription, quote, organization, invoice

---

### 16. invoices

**Purpose:** Store invoice records

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  subscription_id UUID REFERENCES subscriptions(id),
  quote_id UUID REFERENCES quotes(id),
  
  -- Invoice details
  description TEXT,
  
  -- Amounts
  subtotal DECIMAL(12, 2) NOT NULL,
  tax_rate DECIMAL(5, 4) DEFAULT 0.10,
  tax_amount DECIMAL(12, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  amount_paid DECIMAL(12, 2) DEFAULT 0,
  amount_due DECIMAL(12, 2) NOT NULL,
  
  -- Dates
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'pending', 'paid', 'overdue', 'cancelled', 'refunded')),
  
  -- Payment details
  payment_method VARCHAR(50),
  payment_reference VARCHAR(255),
  
  -- Bank transfer details
  bank_name VARCHAR(255),
  account_name VARCHAR(255),
  bsb VARCHAR(10),
  account_number VARCHAR(20),
  
  -- PDF
  pdf_url TEXT,
  
  -- Notes
  notes TEXT,
  terms TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_total CHECK (total_amount = subtotal + tax_amount),
  CONSTRAINT valid_due CHECK (amount_due = total_amount - amount_paid)
);

CREATE INDEX idx_invoices_organization ON invoices(organization_id);
CREATE INDEX idx_invoices_subscription ON invoices(subscription_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_dates ON invoices(issue_date, due_date, paid_date);
```

**Relationships:**
- Belongs to: organization, subscription, quote
- Has many: invoice_items, payments

---

### 17. invoice_items

**Purpose:** Store line items for invoices

```sql
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  
  -- Item details
  item_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  
  -- Pricing
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  
  -- Tax
  taxable BOOLEAN DEFAULT TRUE,
  
  -- Display
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  CONSTRAINT valid_total CHECK (total_price = quantity * unit_price)
);

CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
```

**Relationships:**
- Belongs to: invoice

---

### 18. billing_rules

**Purpose:** Store configurable billing rules

```sql
CREATE TABLE billing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  rule_type VARCHAR(50) NOT NULL CHECK (rule_type IN ('overage', 'upgrade', 'downgrade', 'proration', 'refund', 'payment_terms')),
  
  -- Configuration (JSON)
  configuration JSONB NOT NULL,
  
  -- Applicability
  applies_to_org_types TEXT[],
  applies_to_plan_types TEXT[],
  
  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  effective_from DATE,
  effective_until DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_billing_rules_type ON billing_rules(rule_type);
CREATE INDEX idx_billing_rules_status ON billing_rules(status);
```

---

### 19. audit_logs

**Purpose:** Track all system changes for compliance

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  
  -- Action details
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  
  -- Changes
  old_values JSONB,
  new_values JSONB,
  changes JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  request_id VARCHAR(255),
  
  -- Metadata
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at);
```

**Relationships:**
- Belongs to: user

---

### 20. notification_preferences

**Purpose:** Store user notification settings

```sql
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Credit alerts
  credit_balance_alerts BOOLEAN DEFAULT TRUE,
  low_credit_threshold INTEGER DEFAULT 20,
  credit_expiry_alerts BOOLEAN DEFAULT TRUE,
  
  -- Invoice & payment
  invoice_reminders BOOLEAN DEFAULT TRUE,
  payment_confirmations BOOLEAN DEFAULT TRUE,
  payment_failed_alerts BOOLEAN DEFAULT TRUE,
  
  -- Subscription
  renewal_reminders BOOLEAN DEFAULT TRUE,
  upgrade_opportunities BOOLEAN DEFAULT FALSE,
  
  -- Marketing
  marketing_emails BOOLEAN DEFAULT FALSE,
  product_updates BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_org_preferences UNIQUE (organization_id)
);

CREATE INDEX idx_notification_prefs_org ON notification_preferences(organization_id);
```

**Relationships:**
- Belongs to: organization

---

## 🔌 API Endpoints

### Authentication & Authorization

#### POST /api/auth/register
**Purpose:** Register a new sales agent or admin (admin only)

**Request:**
```json
{
  "email": "agent@skiltrak.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Smith",
  "role": "sales_agent",
  "phone": "+61 400 000 000",
  "department": "Sales"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "agent@skiltrak.com",
    "first_name": "John",
    "last_name": "Smith",
    "role": "sales_agent",
    "status": "active",
    "created_at": "2026-01-14T00:00:00Z"
  }
}
```

**Validation:**
- Email must be unique and valid format
- Password min 8 chars, must contain uppercase, lowercase, number, special char
- Role must be valid enum value
- Only admin/super_admin can create users

---

#### POST /api/auth/login
**Purpose:** Authenticate user and return JWT token

**Request:**
```json
{
  "email": "agent@skiltrak.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "user": {
      "id": "uuid",
      "email": "agent@skiltrak.com",
      "first_name": "John",
      "last_name": "Smith",
      "role": "sales_agent"
    }
  }
}
```

**Business Logic:**
- Check if email exists
- Verify password hash with bcrypt
- Check account status (not suspended/locked)
- Check failed login attempts (lock after 5 failed attempts)
- Update last_login_at
- Generate JWT with 1 hour expiry
- Generate refresh token with 30 day expiry

---

#### POST /api/auth/refresh
**Purpose:** Refresh access token using refresh token

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
```

---

#### GET /api/auth/me
**Purpose:** Get current authenticated user

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "agent@skiltrak.com",
    "first_name": "John",
    "last_name": "Smith",
    "role": "sales_agent",
    "status": "active",
    "avatar_url": "https://...",
    "permissions": ["create_quote", "view_analytics", ...]
  }
}
```

---

### Organizations

#### GET /api/organizations
**Purpose:** List all organizations with filtering and pagination

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `status`: Filter by status (active, inactive, suspended, trial)
- `type`: Filter by organization type
- `search`: Search by name, email, or ABN
- `sort`: Sort field (created_at, name, etc.)
- `order`: Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "organizations": [
      {
        "id": "uuid",
        "name": "Melbourne Training Academy",
        "organization_type": "rto",
        "status": "active",
        "contact_email": "admin@mta.edu.au",
        "created_at": "2026-01-01T00:00:00Z",
        "subscription_count": 1,
        "total_revenue": 15000.00
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "pages": 8
    }
  }
}
```

**Business Logic:**
- Apply role-based filtering (sales agents see only their orgs)
- Soft delete filtering (exclude deleted_at IS NOT NULL)
- Search across name, email, ABN fields
- Include aggregated data (subscription count, revenue)

---

#### GET /api/organizations/:id
**Purpose:** Get single organization details

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Melbourne Training Academy",
    "organization_type": "rto",
    "abn_acn": "12 345 678 901",
    "contact_email": "admin@mta.edu.au",
    "contact_phone": "+61 3 9000 0000",
    "address_line1": "123 Training St",
    "city": "Melbourne",
    "state": "VIC",
    "postal_code": "3000",
    "country": "Australia",
    "primary_contact_name": "Jane Smith",
    "status": "active",
    "billing_email": "billing@mta.edu.au",
    "created_at": "2026-01-01T00:00:00Z",
    "subscription": {
      "id": "uuid",
      "plan_type": "premium",
      "status": "active",
      "start_date": "2026-01-01",
      "end_date": "2026-12-31"
    },
    "credit_balance": {
      "credits_remaining": 250,
      "credits_used": 50,
      "package_name": "Medium Package"
    }
  }
}
```

**Business Logic:**
- Check user has permission to view organization
- Include active subscription details
- Include current credit balance
- Include notification preferences

---

#### POST /api/organizations
**Purpose:** Create new organization (admin only)

**Request:**
```json
{
  "name": "Sydney College of Business",
  "organization_type": "rto",
  "abn_acn": "98 765 432 109",
  "contact_email": "admin@scb.edu.au",
  "contact_phone": "+61 2 9000 0000",
  "address_line1": "456 Business Ave",
  "city": "Sydney",
  "state": "NSW",
  "postal_code": "2000",
  "primary_contact_name": "Bob Johnson",
  "billing_email": "billing@scb.edu.au"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Sydney College of Business",
    "organization_type": "rto",
    "status": "active",
    "created_at": "2026-01-14T00:00:00Z"
  }
}
```

**Business Logic:**
- Validate email format
- Check ABN/ACN is unique (if provided)
- Set default notification preferences
- Create audit log entry
- Send welcome email

---

#### PUT /api/organizations/:id
**Purpose:** Update organization details

**Request:**
```json
{
  "name": "Melbourne Training Academy (Updated)",
  "contact_phone": "+61 3 9000 0001",
  "primary_contact_name": "Jane Smith-Jones"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Melbourne Training Academy (Updated)",
    "updated_at": "2026-01-14T00:00:00Z"
  }
}
```

**Business Logic:**
- Check user has permission (org owner or admin)
- Validate changed fields
- Track changes in audit log
- Send notification if critical fields changed (email, billing)

---

#### DELETE /api/organizations/:id
**Purpose:** Soft delete organization (admin only)

**Response:**
```json
{
  "success": true,
  "message": "Organization deleted successfully"
}
```

**Business Logic:**
- Soft delete (set deleted_at)
- Cancel active subscriptions
- Expire credit balances
- Cannot delete if has active payments pending
- Create audit log entry

---

### Pricing Tiers

#### GET /api/pricing/tiers
**Purpose:** Get all pricing tiers with optional filtering

**Query Parameters:**
- `organization_type`: Filter by org type
- `plan_type`: Filter by plan type (basic, premium)
- `status`: Filter by status (active, inactive, deprecated)

**Response:**
```json
{
  "success": true,
  "data": {
    "tiers": [
      {
        "id": "uuid",
        "name": "Tier 1 (0-100 students)",
        "organization_type": "school",
        "plan_type": "basic",
        "min_students": 0,
        "max_students": 100,
        "annual_price": 2500.00,
        "storage_gb": 10,
        "student_overage_rate": 25.00,
        "status": "active"
      }
    ]
  }
}
```

---

#### GET /api/pricing/tiers/:id
**Purpose:** Get single pricing tier details

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Tier 1 (0-100 students)",
    "organization_type": "school",
    "plan_type": "basic",
    "min_students": 0,
    "max_students": 100,
    "annual_price": 2500.00,
    "storage_gb": 10,
    "student_overage_rate": 25.00,
    "storage_overage_rate": 1.00,
    "status": "active",
    "description": "Perfect for small schools",
    "features": [
      "feature_id_1",
      "feature_id_2"
    ]
  }
}
```

---

#### POST /api/pricing/tiers
**Purpose:** Create new pricing tier (admin only)

**Request:**
```json
{
  "name": "Tier 1 (0-100 students)",
  "organization_type": "school",
  "plan_type": "basic",
  "min_students": 0,
  "max_students": 100,
  "annual_price": 2500.00,
  "storage_gb": 10,
  "student_overage_rate": 25.00,
  "description": "Perfect for small schools"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Tier 1 (0-100 students)",
    "status": "active",
    "created_at": "2026-01-14T00:00:00Z"
  }
}
```

**Business Logic:**
- Validate min_students < max_students
- Validate no overlap with existing tiers for same org/plan type
- Check annual_price is positive
- Create audit log entry
- Invalidate pricing cache

---

#### PUT /api/pricing/tiers/:id
**Purpose:** Update pricing tier (admin only)

**Request:**
```json
{
  "annual_price": 2750.00,
  "storage_gb": 15
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "annual_price": 2750.00,
    "storage_gb": 15,
    "updated_at": "2026-01-14T00:00:00Z"
  }
}
```

**Business Logic:**
- Check impact on existing subscriptions
- Create new version if price changed (versioning)
- Existing subscriptions keep old price until renewal
- Create audit log entry
- Send notification to affected sales agents

---

#### DELETE /api/pricing/tiers/:id
**Purpose:** Deprecate pricing tier (admin only)

**Response:**
```json
{
  "success": true,
  "message": "Pricing tier deprecated successfully"
}
```

**Business Logic:**
- Set status to 'deprecated' (don't delete)
- Cannot deprecate if actively used
- Existing subscriptions continue
- Not available for new quotes
- Create audit log entry

---

### Add-ons

#### GET /api/addons
**Purpose:** Get all add-ons with filtering

**Query Parameters:**
- `category`: Filter by category
- `status`: Filter by status
- `plan_type`: Filter by eligible plan type
- `pricing_model`: Filter by pricing model

**Response:**
```json
{
  "success": true,
  "data": {
    "addons": [
      {
        "id": "uuid",
        "name": "AI Assistant Support",
        "description": "24/7 AI-powered support assistant",
        "category": "AI & Automation",
        "pricing_model": "recurring",
        "price": 1250.00,
        "billing_frequency": "annual",
        "eligible_plans": ["basic", "premium"],
        "status": "active",
        "icon": "bot"
      }
    ]
  }
}
```

---

#### GET /api/addons/eligible/:planType
**Purpose:** Get add-ons eligible for specific plan type

**Response:**
```json
{
  "success": true,
  "data": {
    "addons": [
      {
        "id": "uuid",
        "name": "AI Assistant Support",
        "category": "AI & Automation",
        "price": 1250.00,
        "is_eligible": true,
        "eligibility_reason": "Available for your plan"
      }
    ]
  }
}
```

**Business Logic:**
- Filter by eligible_plans array contains planType
- Check min_tier_required if subscription provided
- Check network_only requirement
- Check requires_compliance flag
- Return eligibility reasons for ineligible items

---

#### POST /api/addons
**Purpose:** Create new add-on (admin only)

**Request:**
```json
{
  "name": "Extra Storage 100GB",
  "description": "Additional 100GB cloud storage",
  "category": "Storage & Infrastructure",
  "pricing_model": "recurring",
  "price": 300.00,
  "billing_frequency": "annual",
  "eligible_plans": ["basic", "premium"],
  "min_tier_required": null,
  "network_only": false,
  "requires_compliance": false,
  "icon": "hard-drive",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Extra Storage 100GB",
    "status": "active",
    "created_at": "2026-01-14T00:00:00Z"
  }
}
```

**Business Logic:**
- Validate pricing model matches pricing fields
- Validate eligible_plans is not empty
- Create audit log entry
- Clear add-ons cache

---

### Network Packages

#### GET /api/network-packages
**Purpose:** Get all network credit packages

**Response:**
```json
{
  "success": true,
  "data": {
    "packages": [
      {
        "id": "uuid",
        "name": "Small Package",
        "credits": 100,
        "price_per_credit": 0.80,
        "total_cost": 80.00,
        "billing_cycle": "quarterly",
        "savings_percent": 0,
        "is_best_value": false,
        "status": "active"
      },
      {
        "id": "uuid",
        "name": "Medium Package",
        "credits": 250,
        "price_per_credit": 0.75,
        "total_cost": 187.50,
        "billing_cycle": "quarterly",
        "savings_percent": 6.25,
        "is_best_value": true,
        "status": "active"
      }
    ]
  }
}
```

---

#### POST /api/network-packages
**Purpose:** Create network package (admin only)

**Request:**
```json
{
  "name": "Enterprise Package",
  "credits": 1000,
  "price_per_credit": 0.65,
  "total_cost": 650.00,
  "savings_percent": 18.75,
  "is_best_value": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Enterprise Package",
    "created_at": "2026-01-14T00:00:00Z"
  }
}
```

**Business Logic:**
- Validate total_cost = credits × price_per_credit
- Calculate savings_percent automatically
- Only one package can be is_best_value (update others)
- Create audit log entry

---

### Network Credits

#### GET /api/credits/balance/:orgId
**Purpose:** Get current credit balance for organization

**Response:**
```json
{
  "success": true,
  "data": {
    "organization_id": "uuid",
    "credits_remaining": 250,
    "credits_used": 50,
    "credits_purchased": 300,
    "package_name": "Medium Package",
    "quarter_start_date": "2026-01-01",
    "quarter_end_date": "2026-03-31",
    "days_until_expiry": 77,
    "status": "active",
    "low_credit_warning": false
  }
}
```

**Business Logic:**
- Get most recent active credit balance
- Check for low credit (≤20 remaining)
- Check for expiry warning (≤30 days)
- Return null if no active balance

---

#### GET /api/credits/usage/:orgId
**Purpose:** Get credit usage history for organization

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `from_date`: Filter from date
- `to_date`: Filter to date
- `industry`: Filter by industry category
- `student_id`: Filter by student

**Response:**
```json
{
  "success": true,
  "data": {
    "usage": [
      {
        "id": "uuid",
        "student_id": "STU001",
        "student_name": "Emma Wilson",
        "student_course": "Certificate IV in Business",
        "industry_category": "Retail",
        "placement_organization": "Big Retail Co",
        "credits_used": 1,
        "matched_at": "2026-01-14T10:30:00Z",
        "status": "completed"
      }
    ],
    "summary": {
      "total_credits_used": 50,
      "unique_students": 45,
      "total_placements": 50,
      "average_per_student": 1.11
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

**Business Logic:**
- Filter by date range
- Group by student for summary stats
- Include only 'completed' status by default
- Sort by matched_at DESC

---

#### POST /api/credits/consume
**Purpose:** Consume credit for student placement

**Request:**
```json
{
  "organization_id": "uuid",
  "student_id": "STU001",
  "student_name": "Emma Wilson",
  "student_course": "Certificate IV in Business",
  "industry_category": "Retail",
  "placement_organization": "Big Retail Co"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "usage_id": "uuid",
    "credits_used": 1,
    "credits_remaining": 249,
    "matched_at": "2026-01-14T10:30:00Z"
  }
}
```

**Business Logic:**
1. Get active credit balance for organization
2. Check if credits_remaining >= 1
3. If insufficient, return error with top-up link
4. Create credit_usage record (status: 'completed')
5. Update credit_balance: credits_used += 1, credits_remaining -= 1
6. If credits_remaining <= 20 and alert not sent, trigger low balance alert
7. If credits_remaining = 0, set balance status to 'depleted'
8. Return updated balance

**Error Handling:**
- Insufficient credits: HTTP 402 Payment Required
- Balance expired: HTTP 400 Bad Request
- Organization has no active balance: HTTP 404 Not Found

---

#### POST /api/credits/topup/:orgId
**Purpose:** Purchase additional credits

**Request:**
```json
{
  "package_id": "uuid",
  "payment_method": "card"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "balance_id": "uuid",
    "credits_purchased": 250,
    "amount_paid": 187.50,
    "quarter_end_date": "2026-03-31",
    "payment_id": "uuid"
  }
}
```

**Business Logic:**
1. Get network package details
2. Calculate quarter dates (current quarter)
3. Create or update credit balance for current quarter
4. Create payment record
5. Process payment through Stripe
6. If payment successful, activate credits
7. Send confirmation email
8. Create audit log entry

---

#### GET /api/credits/alerts/:orgId
**Purpose:** Get credit alerts for organization

**Response:**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "type": "low_balance",
        "severity": "warning",
        "message": "You have 15 credits remaining",
        "action_required": "Consider topping up",
        "action_url": "/topup"
      },
      {
        "type": "expiry_warning",
        "severity": "info",
        "message": "Your credits expire in 30 days",
        "credits_remaining": 15,
        "expiry_date": "2026-03-31"
      }
    ]
  }
}
```

**Business Logic:**
- Check for low balance (≤20 credits)
- Check for expiry warning (≤30 days)
- Check for depleted balance
- Return empty array if no alerts

---

### Quotes

#### GET /api/quotes
**Purpose:** List all quotes with filtering

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status
- `agent_id`: Filter by sales agent
- `from_date`, `to_date`: Date range
- `search`: Search client name, email, org

**Response:**
```json
{
  "success": true,
  "data": {
    "quotes": [
      {
        "id": "uuid",
        "quote_number": "Q-2026-001",
        "client_name": "John Smith",
        "client_organization": "ABC Training College",
        "organization_type": "rto",
        "plan_type": "premium",
        "total_amount": 15000.00,
        "status": "sent",
        "sales_agent": {
          "id": "uuid",
          "name": "Jane Agent"
        },
        "valid_until": "2026-01-21",
        "created_at": "2026-01-14T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

**Business Logic:**
- Sales agents see only their quotes
- Admins see all quotes
- Include agent name and basic details
- Sort by created_at DESC by default

---

#### GET /api/quotes/:id
**Purpose:** Get single quote details

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "quote_number": "Q-2026-001",
    "sales_agent": {
      "id": "uuid",
      "name": "Jane Agent",
      "email": "jane@skiltrak.com"
    },
    "client_info": {
      "name": "John Smith",
      "email": "john@abc.edu.au",
      "phone": "+61 400 000 000",
      "organization": "ABC Training College"
    },
    "organization_type": "rto",
    "plan_type": "premium",
    "pricing_tier": {
      "id": "uuid",
      "name": "Tier 2 (101-500 students)",
      "annual_price": 7500.00
    },
    "network_package": {
      "id": "uuid",
      "name": "Medium Package",
      "credits": 250,
      "total_cost": 187.50
    },
    "items": [
      {
        "id": "uuid",
        "item_type": "addon",
        "name": "AI Assistant Support",
        "quantity": 1,
        "unit_price": 1250.00,
        "total_price": 1250.00,
        "billing_frequency": "annual"
      }
    ],
    "discount": {
      "type": "percentage",
      "value": 10,
      "amount": 893.75,
      "reason": "Early adopter discount",
      "approved_by": "Manager Name",
      "approved_at": "2026-01-14T00:00:00Z"
    },
    "totals": {
      "subtotal": 8937.50,
      "discount_amount": 893.75,
      "tax_amount": 804.38,
      "total_amount": 8848.13,
      "annual_total": 8750.00,
      "quarterly_total": 187.50,
      "one_time_total": 1000.00
    },
    "payment_link": {
      "url": "https://skiltrak.com/pay/abc123",
      "expires_at": "2026-01-21T00:00:00Z",
      "viewed": true,
      "viewed_at": "2026-01-15T10:00:00Z"
    },
    "status": "sent",
    "valid_until": "2026-01-21",
    "created_at": "2026-01-14T00:00:00Z"
  }
}
```

---

#### POST /api/quotes
**Purpose:** Create new quote (sales agent)

**Request:**
```json
{
  "client_info": {
    "name": "John Smith",
    "email": "john@abc.edu.au",
    "phone": "+61 400 000 000",
    "organization": "ABC Training College"
  },
  "organization_type": "rto",
  "plan_type": "premium",
  "pricing_tier_id": "uuid",
  "network_package_id": "uuid",
  "addons": [
    {
      "addon_id": "uuid",
      "quantity": 1
    }
  ],
  "discount": {
    "type": "percentage",
    "value": 10,
    "reason": "Early adopter discount"
  },
  "internal_notes": "VIP client, needs quick turnaround",
  "client_notes": "Thank you for your interest..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "quote_number": "Q-2026-001",
    "total_amount": 8848.13,
    "status": "draft",
    "created_at": "2026-01-14T00:00:00Z"
  }
}
```

**Business Logic:**
1. Generate unique quote_number (Q-YYYY-NNN format)
2. Validate pricing_tier exists and is active
3. Validate network_package if provided
4. Validate all addons exist and are eligible for plan_type
5. Calculate line item totals
6. Calculate subtotal = tier + network + addons + setup_fee
7. Apply discount if provided
8. Calculate tax (10% GST)
9. Calculate total_amount
10. Calculate annual/quarterly/one_time breakdowns
11. Set valid_until = created_at + 7 days
12. If discount > 20%, set status = 'pending_approval'
13. Otherwise, set status = 'draft'
14. Create quote_items records
15. Create discount record if applicable
16. Create audit log entry
17. Send notification to manager if requires approval

---

#### PUT /api/quotes/:id
**Purpose:** Update quote (sales agent, own quotes only)

**Request:**
```json
{
  "client_notes": "Updated terms...",
  "valid_until": "2026-01-28"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "updated_at": "2026-01-14T00:00:00Z"
  }
}
```

**Business Logic:**
- Can only update if status = 'draft'
- Cannot update if status = 'sent', 'accepted', 'paid'
- Recalculate totals if items changed
- Update valid_until if provided
- Create audit log entry

---

#### POST /api/quotes/:id/send
**Purpose:** Send quote to client

**Request:**
```json
{
  "expiry_days": 7,
  "send_email": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "quote_id": "uuid",
    "status": "sent",
    "payment_link": {
      "url": "https://skiltrak.com/pay/abc123",
      "expires_at": "2026-01-21T00:00:00Z"
    },
    "email_sent": true
  }
}
```

**Business Logic:**
1. Validate quote status = 'draft' or 'viewed'
2. If discount requires approval and not approved, return error
3. Generate unique payment link token
4. Create payment_link record
5. Set payment_link.expires_at = now + expiry_days
6. Update quote status = 'sent'
7. If send_email = true:
   - Generate quote PDF
   - Send email to client_email with payment link
   - Include quote PDF as attachment
8. Create audit log entry
9. Send notification to sales agent

---

#### GET /api/quotes/:id/view/:token
**Purpose:** Public endpoint for client to view quote (no auth required)

**Response:**
```json
{
  "success": true,
  "data": {
    "quote_number": "Q-2026-001",
    "client_info": { ... },
    "items": [ ... ],
    "totals": { ... },
    "valid_until": "2026-01-21",
    "sales_agent_contact": {
      "name": "Jane Agent",
      "email": "jane@skiltrak.com",
      "phone": "+61 400 000 000"
    }
  }
}
```

**Business Logic:**
1. Validate token exists and not expired
2. Update payment_link.viewed = true, viewed_at = now, view_count += 1
3. Update quote.status = 'viewed' (if was 'sent')
4. Update quote.viewed_at = now
5. Return quote details (exclude internal_notes)
6. Send notification to sales agent that quote was viewed

---

#### POST /api/quotes/:id/approve
**Purpose:** Approve discount for quote (manager only)

**Request:**
```json
{
  "approved": true,
  "notes": "Approved for strategic client"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "discount_id": "uuid",
    "approval_status": "approved",
    "approved_by": "Manager Name",
    "approved_at": "2026-01-14T00:00:00Z"
  }
}
```

**Business Logic:**
1. Check user role = 'sales_manager', 'admin', or 'super_admin'
2. Check discount.approval_status = 'pending'
3. Update discount record:
   - approval_status = 'approved' or 'rejected'
   - approved_by = current user id
   - approved_at = now
   - rejection_reason = notes (if rejected)
4. If approved, update quote status = 'draft' (allow sending)
5. Send notification to sales agent
6. Create audit log entry

---

### Subscriptions

#### GET /api/subscriptions
**Purpose:** List all subscriptions

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filter by status
- `organization_id`: Filter by organization
- `plan_type`: Filter by plan type
- `from_date`, `to_date`: Date range

**Response:**
```json
{
  "success": true,
  "data": {
    "subscriptions": [
      {
        "id": "uuid",
        "organization": {
          "id": "uuid",
          "name": "Melbourne Training Academy",
          "type": "rto"
        },
        "plan_type": "premium",
        "pricing_tier": {
          "name": "Tier 2 (101-500 students)",
          "annual_price": 7500.00
        },
        "status": "active",
        "current_students": 234,
        "start_date": "2026-01-01",
        "end_date": "2026-12-31",
        "auto_renew": true
      }
    ],
    "pagination": { ... }
  }
}
```

---

#### GET /api/subscriptions/:id
**Purpose:** Get single subscription details

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "organization_id": "uuid",
    "plan_type": "premium",
    "pricing_tier": {
      "id": "uuid",
      "name": "Tier 2 (101-500 students)",
      "min_students": 101,
      "max_students": 500,
      "annual_price": 7500.00,
      "storage_gb": 50
    },
    "network_package": {
      "id": "uuid",
      "name": "Medium Package",
      "credits": 250,
      "quarterly_cost": 187.50
    },
    "addons": [
      {
        "id": "uuid",
        "name": "AI Assistant Support",
        "price": 1250.00,
        "billing_frequency": "annual",
        "status": "active"
      }
    ],
    "current_students": 234,
    "storage_used_gb": 23.5,
    "status": "active",
    "billing_cycle": "annual",
    "auto_renew": true,
    "start_date": "2026-01-01",
    "end_date": "2026-12-31",
    "setup_fee_paid": true,
    "annual_price": 8750.00,
    "next_billing_date": "2026-12-31",
    "next_billing_amount": 8750.00
  }
}
```

---

#### POST /api/subscriptions
**Purpose:** Create new subscription (from quote or direct)

**Request:**
```json
{
  "organization_id": "uuid",
  "quote_id": "uuid",
  "plan_type": "premium",
  "pricing_tier_id": "uuid",
  "network_package_id": "uuid",
  "addon_ids": ["uuid1", "uuid2"],
  "start_date": "2026-01-15",
  "billing_cycle": "annual",
  "auto_renew": true,
  "payment_method": "card",
  "payment_details": {
    "stripe_payment_method_id": "pm_abc123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription_id": "uuid",
    "invoice_id": "uuid",
    "payment_id": "uuid",
    "status": "active",
    "start_date": "2026-01-15",
    "end_date": "2027-01-14"
  }
}
```

**Business Logic:**
1. If quote_id provided:
   - Validate quote exists and status = 'viewed' or 'sent'
   - Use quote configuration
   - Update quote status = 'accepted'
2. Calculate end_date = start_date + 1 year
3. Create subscription record
4. Create subscription_addons for each addon
5. If network_package_id provided:
   - Create network_credit_balance record
   - Set credits_purchased = package credits
   - Set quarter dates
6. Calculate total amount (tier + network + addons + setup_fee if not paid)
7. Create invoice with line items
8. Process payment via Stripe
9. If payment successful:
   - Set subscription status = 'active'
   - Set setup_fee_paid = true
   - Update invoice status = 'paid'
   - Update payment status = 'completed'
10. If payment fails:
    - Set subscription status = 'past_due'
    - Send payment failed notification
11. Send welcome email to organization
12. Create audit log entry

---

#### POST /api/subscriptions/:id/upgrade
**Purpose:** Upgrade subscription to higher tier or add features

**Request:**
```json
{
  "new_pricing_tier_id": "uuid",
  "new_plan_type": "premium",
  "additional_addon_ids": ["uuid1"],
  "effective_date": "immediate"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription_id": "uuid",
    "old_tier": "Tier 2",
    "new_tier": "Tier 3",
    "prorated_credit": 2500.00,
    "prorated_charge": 3200.00,
    "net_charge": 700.00,
    "effective_date": "2026-01-14"
  }
}
```

**Business Logic:**
1. Validate new tier/plan is higher than current
2. Calculate days remaining in current billing period
3. Calculate pro-rated credit for old subscription
   - credit = old_annual_price × (days_remaining / 365)
4. Calculate pro-rated charge for new subscription
   - charge = new_annual_price × (days_remaining / 365)
5. Calculate net_charge = charge - credit
6. If net_charge > 0, create payment
7. Update subscription with new tier/plan
8. Set previous_subscription_id for audit trail
9. Update end_date to maintain same renewal date
10. Send upgrade confirmation email
11. Create audit log entry

---

#### POST /api/subscriptions/:id/downgrade
**Purpose:** Downgrade subscription (takes effect at renewal)

**Request:**
```json
{
  "new_pricing_tier_id": "uuid",
  "new_plan_type": "basic",
  "remove_addon_ids": ["uuid1"],
  "reason": "Budget constraints"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription_id": "uuid",
    "downgrade_scheduled_date": "2026-12-31",
    "new_tier": "Tier 1",
    "new_annual_price": 5500.00,
    "savings": 2000.00
  }
}
```

**Business Logic:**
1. Validate new tier/plan is lower than current
2. Set downgrade_scheduled_date = current end_date
3. Do NOT change current subscription
4. Create pending downgrade record
5. Send downgrade scheduled notification
6. 30 days before renewal, send reminder
7. On renewal date, apply downgrade
8. Create audit log entry

---

### Payments

#### POST /api/payments/process
**Purpose:** Process payment for subscription or invoice

**Request:**
```json
{
  "invoice_id": "uuid",
  "payment_method": "card",
  "stripe_payment_method_id": "pm_abc123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payment_id": "uuid",
    "amount": 8848.13,
    "status": "completed",
    "transaction_id": "ch_abc123",
    "receipt_url": "https://..."
  }
}
```

**Business Logic:**
1. Get invoice details
2. Validate amount_due > 0
3. Create payment record (status: 'pending')
4. Call Stripe API to create payment intent
5. If payment successful:
   - Update payment status = 'completed'
   - Update payment.transaction_id
   - Update invoice status = 'paid'
   - Update invoice.amount_paid
   - Update invoice.paid_date
   - If subscription