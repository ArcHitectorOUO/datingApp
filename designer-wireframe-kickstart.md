# SIFU Love Matching Platform - Wireframe Kickstart Guide

**Project:** Serious Relationship Matching Platform (Accelerated MVP)  
**Target Launch:** Valentine's Day (mid-February 2026)  
**Timeline:** 10-11 weeks (Wireframing: Week 1)  
**Platform:** Mobile-responsive web application (installable to home screen)

---

## User Types

### Normal User

- 2 questions with Cifu (self-problems only)
- Limited in-app chats
- Basic matching features
- Standard message retention (audio/images: 3 days to 1 week)

### VIP User

- More matching quota
- Audio chat with Cifu
- Priority replies from Cifu
- Profile hiding option (visible to admin/Cifu only)
  - Indicated with gray color lock icon
  - Text: "Not visible to public, only visible to Cifu"
- Extended message retention (audio/images: up to 1 month)

### Admin/Cifu

- User approval/rejection
- Manual matching
- Moderation tools
- View chat history
- Handle reports

---

## Key User Flows

### 1. New User Registration & Onboarding Flow

**Steps:**

1. Landing/Welcome screen
2. Authentication selection (SMS, Email, Facebook, Instagram)
3. Authentication verification
4. Profile creation:
   - Basic info (gender, age, district)
   - Profile pictures (max 10)
   - Preferences (matching criteria)
5. **User feedback submission** (during registration):
   - User expectation (what do you expect from the app)
   - Suggesting area of improvement
   - Aspect of appreciation
6. KYC verification submission
   - Optional HKID verification
7. Waiting for approval screen
8. Approval notification

**Visual Indicators:**

- Green tick for HKID verified users
- Status indicators (pending approval, approved, rejected)

### 2. Post-Login User Flow

**Main Actions:**

1. Dashboard/Home screen
2. View matches (basic + manual)
3. Start chat with matches
4. **User feedback submission** (after login - same form structure as registration):
   - User expectation (what do you expect from the app)
   - Suggesting area of improvement
   - Aspect of appreciation
5. **User report** (report scammers/issues)
6. Profile management
   - Pause matching functionality (so Cifu won't pick the user)
7. Counsellor information page
8. VIP membership (if not VIP)

### 3. Matching Flow

**For Users:**

1. View available matches
2. See match details
3. Express interest or start chat
4. Receive manual matches from Cifu

**For Cifu (Admin):**

1. Search and look up users using filters:
   - Gender
   - Age (range)
   - District
   - Name
   - Occupation / Professional
   - Remark (input by Cifu)
   - Chat message history (between user and Cifu)
2. View user profiles and details
3. Create matches based on Cifu's own logic/analysis/memory
4. System provides search tools; Cifu decides matches
5. Note: Users who paused matching won't appear in matching pool

### 4. Messaging Flow

**Features:**

- Real-time chat interface
- List of users → Select user → Enter chatroom
- Send text, images, audio
- Image messages show expiration text (when image will expire)
- Long press on images to save to other apps
- View message history
- Option to move to WhatsApp for long conversations
- Message retention notice (different for VIP vs Normal)
- No group chat functionality
- Single chatroom view (no split view showing list when inside chatroom - app is for serious relationships, not multitasking)

### 5. VIP Membership Flow

**For Normal Users:**

1. View VIP benefits
2. Purchase/Subscribe (monthly or per-question credit)
3. Upgrade confirmation
4. Access VIP features

**VIP Features to Highlight:**

- More matching quota
- Audio chat with Cifu
- Priority replies
- Profile hiding option
- Extended message retention

### 6. Admin/Cifu Dashboard Flow

**Key Functions:**

1. User approval/rejection queue
2. User management (ban/unban)
3. Manual matching interface
4. View chat history
5. Handle user reports
6. System monitoring (stats dashboard)
7. User statistics

---

## Screens to Wireframe

### Priority 1: Core User Experience

1. **Landing/Welcome Screen**

   - Authentication options
   - Value proposition

2. **Authentication Screens**

   - SMS verification
   - Email verification
   - Facebook/Instagram OAuth
   - Verification code input

3. **Profile Creation Flow**

   - Step-by-step form
   - Photo upload (max 10)
   - Preferences selection (gender, age, district)
   - User feedback form (during registration):
     - User expectation (what do you expect from the app)
     - Suggesting area of improvement
     - Aspect of appreciation

4. **KYC Verification Screen**

   - Document upload
   - Optional HKID verification
   - Submission confirmation

5. **Waiting for Approval Screen**

   - Status indicator
   - What to expect

6. **Dashboard/Home Screen**

   - Match overview
   - Quick actions
   - Navigation

7. **Matching Interface**

   - Match list (cards displayed in list format)
   - Each day shows 3 matches (configurable by admin in admin UI)
   - Match details
   - Match actions (like, chat, etc.)

8. **Chat/Messaging Interface**

   - List of users (chat list view)
   - Chatroom view (single chat screen, no split view)
   - No group chat functionality
   - Message input (text, image, audio)
   - Image messages: Show expiration text (small text showing when image will expire)
   - Image long press: Save image to other apps
   - Message retention notice
   - Note: App is for serious relationships, not multitasking - don't show list when inside chatroom

9. **Profile Management** (Profile Tab - includes settings)

   - View own profile
   - Edit profile
   - Settings (inside profile tab, not separate tab):
     - Profile settings
     - Pause matching functionality (so Cifu won't pick the user)
     - Profile hiding (VIP only):
       - Gray color lock icon
       - Text: "Not visible to public, only visible to Cifu"
   - VIP upgrade option (if not VIP)
   - Note: Settings integrated into profile tab to reduce number of tabs in bottom navigation

10. **User Feedback Form** (post-login)

    - Same form structure as registration (can be same or different):
      - User expectation (what do you expect from the app)
      - Suggesting area of improvement
      - Aspect of appreciation

11. **User Report Form**

    - Report categories
    - Report submission
    - Report confirmation

12. **Counsellor Information Page**

    - Counsellor details
    - Contact information
    - Services offered

13. **VIP Membership Page**
    - Benefits overview
    - Pricing options
    - Purchase/subscribe flow

### Priority 2: Admin Experience

14. **Admin Dashboard Home**

    - Overview stats
    - Quick actions
    - Navigation

15. **User Approval Queue**

    - Pending users list
    - User profile review
    - Approve/reject actions

16. **User Management**

    - User list
    - User details
    - Ban/unban actions

17. **User Search & Matching Interface (for Cifu)**

    - User search with multiple optional input fields:
      - Gender
      - Age (range)
      - District
      - Name
      - Occupation / Professional
      - Remark (input by Cifu)
      - Chat message history (between user and Cifu, multiple keywords search)
    - Search results: List of matched users
    - User profile viewing
    - Match creation (Cifu uses own logic/analysis/memory)
    - Match management

18. **Chat History Viewer**

    - User selection
    - Chat log display

19. **Report Handling**

    - Report queue
    - Report details
    - Action taken

20. **System Monitoring Dashboard**

    - System stats (CPU, memory, usage)
    - User stats (registered, online, chats)
    - Storage stats (pictures, audio)

21. **System Configuration**
    - Configure number of matches per day (default: 3)
    - Other system settings

---

## Key Design Considerations

### Visual Indicators

- **Green Tick:** HKID verified users (display on profile)
- **VIP Badge/Indicator:** For VIP members
- **Gray Lock Icon:** Hidden profile (VIP only)
  - Text: "Not visible to public, only visible to Cifu"
- **Status Indicators:**
  - User approval status (pending, approved, rejected)
  - Online/offline status
  - Active/inactive status
  - Matching paused status

### User Experience Priorities

1. **Smooth Onboarding**

   - Clear step-by-step process
   - Progress indicators
   - Helpful guidance

2. **Intuitive Matching**

   - Easy to understand match criteria
   - Clear match presentation
   - Simple actions (like, chat, etc.)

3. **Clear Chat Interface**

   - Easy message sending
   - Clear message retention notices
   - Smooth transition to WhatsApp option

4. **Accessible Admin Tools**
   - Efficient approval workflow
   - Easy user management
   - Clear moderation actions

### Responsive Design

- **Mobile-first approach**
- **Bottom navigation bar** (primary navigation)
- Touch-friendly interactions
- Optimized for mobile screens
- Installable to home screen capability

### Content Areas

- **User Feedback Form:** Same form structure for both instances (during registration and after login)
  - User expectation (what do you expect from the app)
  - Suggesting area of improvement
  - Aspect of appreciation
- **User Report:** Only after login (report scammers/issues)
- **Profile Pictures:** Maximum 10 for all users
- **Message Types:** Text (unlimited), Images (retention varies), Audio (retention varies)

---

## User States & Status

### Registration States

- Not registered
- Registration in progress
- Pending approval
- Approved
- Rejected

### User Types

- Normal user
- VIP user
- Banned user

### Verification Status

- Not verified
- HKID verified (green tick)

### Message Retention Awareness

- Normal users: See notice about 3 days-1 week retention for audio/images
- VIP users: See notice about up to 1 month retention for audio/images
- All users: Text messages unlimited

---

## Wireframe Deliverables Checklist

### Week 1 Deliverables

- [ ] Sitemap
- [ ] User flow diagrams
- [ ] Wireframes for Priority 1 screens (1-13)
- [ ] Wireframes for Priority 2 screens (14-21)
- [ ] Responsive breakpoints considered
- [ ] Navigation structure
- [ ] Form layouts
- [ ] Status indicators placement
- [ ] Visual hierarchy for VIP features

---

## Design Decisions (To be confirmed)

1. **Navigation Structure**

   - **Bottom navigation bar**
   - **Settings inside Profile tab** (not separate tab - fewer tabs is better)

2. **Matching Display**

   - **List of cards**
   - **3 matches per day** (configurable by admin in admin UI)

3. **Chat Interface**

   - **List of users** → **Chatroom view** (single view, no split)
   - **No group chat** functionality
   - **No list shown when inside chatroom** (app is for serious relationships, not multitasking)
   - **Image expiration text** (small text showing when image will expire)
   - **Long press on images** to save to other apps

4. **Admin Dashboard / Cifu Search Interface**

   - Search filter UI: Multiple optional input fields
   - Chat history search: Multiple keywords
   - Search results: List of matched users

5. **Profile Hiding (VIP)**

   - Gray color lock icon
   - Text: "Not visible to public, only visible to Cifu"
   - Settings location: Profile Management screen

6. **User Feedback Forms**

   - Same form structure for both instances (during registration and after login)
   - Form fields:
     - User expectation (what do you expect from the app)
     - Suggesting area of improvement
     - Aspect of appreciation

---

## Timeline Context

**Week 1: Planning & Wireframing**

- Complete all wireframes
- Get stakeholder approval (within 48 hours)

**Week 2: UI/UX Design**

- Visual design based on approved wireframes
- Design system creation

**Weeks 3-8: Development**

- Implementation based on designs

**Week 9: Testing**

- QA and refinement

**Weeks 10-11: Deployment**

- Launch preparation

**Note:** Prompt approvals (within 48 hours) are critical for the accelerated timeline.

---

_Last Updated: 6 Dec 2025_  
_Document Version: 1.0_
