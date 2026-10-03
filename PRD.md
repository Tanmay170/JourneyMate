Project requirement documnet 
What to build?- Journey Mate is a platform or a guide/friend which helps the user to plan their trip to india (specifically offbeat places) and helps them get the best experience out of it. The platform gives you a immense experience a way out. If you are travelling solo you can join the groups or else travel solo to give budget accomodations like zostels, hostellers etc and gives the local experience of that place like local food recommendations, planning iternary, giving recommendations on what places you must go like on interest like if they wants to hike so options accordingly or if they wants to go to a cultural place to look upon the history. Also gives option for transport, help with map of itenary.

Target users?- Mostly the bachelors or the people who are young mind who can do activities and can travel in a group of younsters. Age group of 18-30. Not families but a friends group of 3-4 people or solo travellers. 

Features- 
1. Login/Sign up with google or phone number or email.
2. Onboarding and preference selection
3. Home screen with curated list of places
4. Place details with time, location, how to reach, things to do, what to expect, photos, best time to visit, travel mode, nearest airport, nearest railway station, nearest bus station, reviews, ratings.
5. Create trip
6. Iternary planner
7. Maps and navigation
8. Local guide (Food recommendations, person who guide locally)
9. Accomodation, transport and other services booking.
10. Featuring packages like Zo-Trips.
11. Groups for communication and updates.

---

## Implementation status (maintained by Claude — last updated 2026-10-03)
_Your text above is unchanged. Statuses are from code reading + typecheck/build; nothing has been run against real services yet._

| # | Feature | Status | Notes |
|---|---|---|---|
| 1 | Login/Sign up (Google, phone, email) | 🟡 Google + email coded; **phone not built** | Firebase identity + NextAuth session. Phone needs Firebase Phone provider. |
| 2 | Onboarding & preference selection | ❌ Not started | Needs `User.preferences` + UI. |
| 3 | Home with curated places | 🟡 Basic | Grouped by category; not personalised. Seed content is template data. |
| 4 | Place details | 🟡 Partial | Has overview, things to do, safety, gallery, stays, food, transport, reviews. **Missing:** nearest airport/railway/bus station fields, ratings summary, "what to expect". |
| 5 | Create trip | 🟡 Partial | AI itinerary generation + save to dashboard; no group/dates/budget model. |
| 6 | Itinerary planner | 🟡 Partial | Groq-generated, day-wise; no manual editing. |
| 7 | Maps & navigation | ❌ Not started | Needs maps provider decision. |
| 8 | Local guide | 🟡 Partial | Food recommendations via data + AI chat; no guide profiles. |
| 9 | Booking (stay/transport/services) | 🟡 Partial | Stay booking *requests* saved as Pending; no payments, no transport booking. |
| 10 | Packages (Zo-Trips style) | ❌ Not started | |
| 11 | Groups for communication | ❌ Not started | Needs real-time/chat approach decision. |

Extra built beyond the list: AI travel assistant chat (`/chat`), saved destinations, user dashboard.

**Open product decisions:** payments in scope? maps provider? how groups communicate (in-app chat vs external link)? Are local guides a user type with their own accounts?
