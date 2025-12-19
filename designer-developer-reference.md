# SIFU Love Matching Platform - Designer & Developer Reference

**Project Name:** Serious Relationship Matching Platform (Accelerated MVP)  
**Target Launch:** Valentine's Day (mid-February 2026)  
**Timeline:** Approximately 10-11 weeks  
**Platform:** Web Application Only (Mobile-responsive, installable to home screen)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Core Features](#core-features)
3. [User Types & Permissions](#user-types--permissions)
4. [Technical Requirements](#technical-requirements)
5. [Design Requirements](#design-requirements)
6. [Development Timeline](#development-timeline)
7. [Deliverables](#deliverables)

---

## Project Overview

### Platform Type

- **Web Application Only** - No native iOS/Android apps in Phase 1
- Mobile-responsive design
- Installable to home screen
- HTTPS-enabled with security lock indicator in browser

### Project Goals

- Build a serious relationship matching platform
- Support manual approvals and curated guidance
- Enable offline counselling integration
- Accelerated delivery to launch by Valentine's Day

---

## Core Features

### 1. User Onboarding & KYC Verification

**Registration Process:**

- User registration with profile creation
- KYC-style identity verification via manual review/approval
- Manual approval workflow (admin/Cifu reviews and approves users)

**User Feedback System:**

- Users can submit feedback **during registration** and **after registration** (post-login)
- Same form structure for both instances with three fields:
  - User expectation (what do you expect from the app)
  - Suggesting area of improvement
  - Aspect of appreciation

**User Report System:**

- Users can report scammers and other issues **after login**
- Reports are handled through admin dashboard

### 2. Authentication Methods

**Supported Authentication:**

- SMS authentication
- Email authentication
- Facebook integration (third-party)
- Instagram integration (third-party)
- iAM Smart (智方便) integration assistance
  - Note: Government approval not guaranteed
  - Additional charges may apply if approved

**HKID Verification:**

- Optional verification feature
- Verified users display a **green tick status indicator** on their profile

### 3. Matching System

**Matching Types:**

- **Basic Matching:** Automated matching based on:
  - Gender preferences
  - Age range
  - District/location
- **Manual Matching by Cifu:**
  - System provides straightforward search functionality for Cifu to look up users
  - Search filter UI: Multiple optional input fields
  - Search criteria available:
    - Gender
    - Age (range)
    - District
    - Name
    - Occupation / Professional
    - Remark (input by Cifu)
    - Chat message history (between user and Cifu, multiple keywords search)
  - Search results: List of matched users
  - Cifu uses his own logic, analysis, and memory to decide matches
  - Cifu manually creates matches based on his judgment
  - Available for both VIP and Normal users
  - Note: Users who paused matching won't appear in matching pool

### 4. Messaging System

**Chat Features:**

- Real-time messaging for short-term chat
- Long conversations can be moved to external WhatsApp
- Message retention policies:
  - **Audio & Images:**
    - Normal users: 3 days to 1 week
    - VIP users: Up to 1 month
  - **Text messages:** Unlimited retention

### 5. Admin Dashboard

**Moderation Tools:**

- Ban/unban users
- View chat history
- Handle user reports
- Manual investigation capabilities
- User management controls

**Monitoring & Stats:**

- System statistics: CPU, memory, usage
- User statistics: registered users, online users, chats
- Storage stats: space used for pictures and audio

### 6. Counsellor Information Page

- Dedicated page displaying counsellor information
- Accessible to users

### 7. Storage & Hosting

**Storage Allocation:**

- **Total Storage:** 100GB
- **System Usage:** Typically less than 15GB
- **User Storage:** ~85GB for 2,000 users
- **Per User:** ~42.5MB (sufficient for approximately 100 images)

**Hosting Platform:**

- Google Cloud Platform (GCP)
- HTTPS-enabled
- Two-year hosting included
- Additional storage/cloud functions charged separately by Google Cloud (if needed)

**Backup:**

- Basic database backup included

---

## User Types & Permissions

### VIP Membership (高級會員)

**Features:**

- More matching quota than normal users
- Audio chat with Cifu
- Priority replies from Cifu
- Profile hiding option (visible to admin/Cifu only)
  - Indicated with gray color lock icon
  - Text: "Not visible to public, only visible to Cifu"
- Extended message retention (audio & images up to 1 month)
- Pause matching functionality (so Cifu won't pick the user)

**Pricing Model:**

- Subscription model: Monthly fee (example: HKD 300/month, adjustable)
- Per-question credit plan option
- Mixed subscription + per-usage model (TBC mid-December)

### Normal User

**Features:**

- 2 questions with Cifu (example, adjustable)
- Self-problems only
- Limited in-app chats
- Standard message retention (audio & images: 3 days to 1 week)
- Pause matching functionality (so Cifu won't pick the user)

**Profile Pictures:**

- Maximum 10 profile pictures (applies to all users, both VIP and Normal)

---

## Technical Requirements

### Frontend Development

**Key Components:**

- Web app interface
- Chat interface (real-time messaging)
- User profile journeys
- Registration and onboarding flows
- Matching interface
- Admin dashboard UI

**Responsive Design:**

- Mobile-responsive design
- Installable to home screen

### Backend Development

**Core Systems:**

- Authentication system (SMS, Email, Facebook, Instagram)
- iAM Smart integration (if approved)
- Admin tools and moderation system
- Basic matching system (gender, age, district)
- User search functionality for Cifu:
  - Multiple optional input fields for filters
  - Filters: Gender, Age (range), District, Name, Occupation/Professional, Remark (input by Cifu)
  - Chat message history search with multiple keywords
  - Returns list of matched users
- Pause matching functionality (users can pause, preventing Cifu from picking them)
- Real-time messaging infrastructure
- User report and feedback handling
- RESTful APIs

**Third-Party Integrations:**

- Facebook OAuth
- Instagram OAuth
- SMS service provider
- Email service provider
- iAM Smart API (if approved)

### Security & Compliance

- HTTPS implementation (browser security lock)
- Secure authentication flows
- Data encryption
- User privacy controls (profile hiding for VIP)
- Admin access controls

---

## Design Requirements

### UI/UX Design

**Design Deliverables:**

- Wireframes for all key screens
- Responsive layouts
- Design system

**Key Screens to Design:**

1. Registration/Onboarding flow
2. Profile creation and editing (includes settings - settings inside profile tab, not separate tab)
3. Matching interface
4. Chat/messaging interface
5. Admin dashboard
6. Counsellor information page
7. User feedback form (same form structure for registration and post-login)
8. User report form
9. VIP membership information/purchase

### Branding

- Branding alignment with client requirements
- UX copy guidance
- Launch assets creation

### Visual Indicators

- **Green tick:** HKID verified users
- **VIP badge/indicator:** For VIP members
- **Status indicators:** Online/offline, active/inactive

---

## Development Timeline

### Phase 1: Planning & Wireframing (1 week)

**Deliverables:**

- Product backlog
- Sitemap
- Wireframes

### Phase 2: UI/UX Design (1 week)

**Deliverables:**

- Responsive layouts
- Design system
- Visual design mockups

### Phase 3: Core Development (6 weeks)

**Deliverables:**

- Web application
- Backend APIs
- Admin tools
- Third-party integrations

### Phase 4: Testing & Refinement (1 week)

**Deliverables:**

- QA testing
- User Acceptance Testing (UAT)
- Security & performance tuning

### Phase 5: Deployment & Launch Support (1-2 weeks)

**Deliverables:**

- GCP setup and configuration
- Go-live deployment
- Admin training sessions
- Documentation handover

**Note:** Success of the accelerated schedule relies on prompt approvals (within 48 hours) and limiting change requests to the agreed MVP scope.

---

## Deliverables

### Technical Deliverables

1. **Fully Functional MVP Web Application**

   - Ready for Valentine's Day launch
   - All core features implemented
   - Mobile-responsive design

2. **Complete Source Code**

   - Full source code repository
   - Documentation
   - IP transfer (copyright transfer)

3. **Admin Dashboard**

   - Matching controls
   - Moderation tools
   - Admin operation guide

4. **Cloud Environment**

   - HTTPS-enabled
   - Monitoring dashboard (system stats, user stats)
   - Basic database backup

5. **Documentation**
   - Technical documentation
   - API documentation
   - Admin user guide
   - Developer documentation

### Support & Training

- Training sessions for admin users
- Knowledge transfer sessions
- Launch promotion planning support
- Two-year maintenance support & response plan (technical support only, excludes new feature development)

---

## Key Assumptions

1. Dedicated stakeholders available for weekly check-ins and rapid approvals
2. Content and policy decisions provided by client's team during development
3. Legal and compliance review managed by client's organisation
4. Prompt approvals (within 48 hours) for design and development milestones

---

## Important Notes

### Phase Scope

- **Phase 1:** Current MVP scope as outlined in this document
- **Phase 2 and Phase 3:** Not covered in this scope

### Third-Party Services

- Media spend with third-party platforms (e.g., Google Ads) billed separately by providers
- Additional GCP storage/cloud functions charged separately if needed

### iAM Smart Integration

- Government approval not guaranteed
- Additional charges may apply if approved
- Integration assistance provided

---

## Design & Development Guidelines

### For Designers

1. **User Experience Focus:**

   - Ensure smooth onboarding flow
   - Make matching process intuitive
   - Design clear chat interface
   - Create accessible admin tools

2. **Visual Hierarchy:**

   - Highlight VIP features appropriately
   - Make verification status (green tick) clearly visible
   - Design clear call-to-action buttons

3. **Responsive Design:**

   - Mobile-responsive design
   - Ensure touch-friendly interactions

### For Developers

1. **Code Organization:**

   - Follow project coding standards
   - Use consistent naming conventions
   - Write clear comments for complex logic

2. **Security Best Practices:**

   - Never store passwords in plain text
   - Validate all user inputs
   - Implement proper authentication checks
   - Follow OAuth best practices for third-party integrations

3. **Performance:**

   - Optimize image uploads and storage
   - Implement efficient database queries
   - Monitor message retention policies

4. **Testing:**

   - Test authentication flows thoroughly
   - Test message retention policies
   - Verify admin moderation tools

5. **Documentation:**
   - Document API endpoints
   - Document user search functionality
   - Document third-party integration setup

---

## Feature Checklist

### User Features

- [ ] Registration with profile creation
- [ ] KYC verification submission
- [ ] User feedback submission (during and after registration)
- [ ] User report submission (after login)
- [ ] Multiple authentication methods (SMS, Email, Facebook, Instagram)
- [ ] Optional HKID verification with green tick indicator
- [ ] Basic matching (gender, age, district)
- [ ] Manual matching by Cifu
- [ ] Real-time messaging
- [ ] Message retention (different for VIP vs Normal)
- [ ] Profile management (max 10 pictures)
- [ ] Pause matching functionality
- [ ] VIP membership features
- [ ] Profile hiding (VIP only, gray lock icon with text)
- [ ] Counsellor information page access

### Admin Features

- [ ] User approval/rejection workflow
- [ ] Ban/unban users
- [ ] View chat history
- [ ] Handle user reports
- [ ] Manual investigation tools
- [ ] Matching controls
- [ ] System monitoring dashboard
- [ ] User statistics dashboard

### Technical Features

- [ ] HTTPS implementation
- [ ] GCP hosting setup
- [ ] Database backup system
- [ ] Monitoring and stats collection
- [ ] Third-party OAuth integrations
- [ ] iAM Smart integration (if approved)
- [ ] Installable to home screen

---

_Last Updated: 6 Dec 2025_  
_Document Version: 1.0_
