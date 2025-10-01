# Google Analytics 4 Setup - Sanford and Hun Film and Photography

## Overview
This site now has Google Analytics 4 (GA4) fully integrated with custom event tracking. The analytics system automatically tracks user interactions across the site to help understand visitor behavior and optimize the user experience.

## What's Being Tracked

### Automatic Tracking
- **Page Views**: Automatically tracked on every page load
- **User Sessions**: Time spent on site, bounce rate, etc.
- **Traffic Sources**: Where visitors come from (Google, social media, direct, etc.)
- **Device Information**: Desktop vs mobile, browser types, screen sizes
- **Geographic Location**: Where visitors are located

### Custom Event Tracking

#### 1. **Contact Form Events**
- `form_submission` - Successful contact form submissions
  - Includes whether phone number was provided
  - Tracks message length
- `form_error` - Failed form submissions with error details

#### 2. **Gallery Interactions**
- `gallery_interaction` - User interactions with image galleries
  - **Weddings Gallery**: Opening lightbox, navigating images, loading more photos
  - **Family Gallery**: Same interactions as weddings gallery
  - Actions tracked: `open`, `close`, `next`, `previous`, `load_more`

#### 3. **Navigation Events**
- `navigation` - Page-to-page navigation clicks
  - Tracks source and destination pages
- `mobile_menu_toggle` - Mobile menu open/close events

#### 4. **Slideshow Events**
- `slideshow_interaction` - Automatic slideshow transitions
  - Tracks which slideshow (hero, wedding, family)
  - Auto-advance tracking

#### 5. **External Link Clicks**
- `external_link_click` - Clicks to external sites
  - Automatically tracks social media links
  - YouTube, Instagram, Facebook clicks

## Files Modified/Created

### New Files
- `js/analytics.js` - Core analytics module with all tracking functions

### Modified Files
- All HTML files (index.html, weddings.html, family.html, contact.html, video-portfolio.html)
  - Added GA4 tracking code in `<head>` section
  - Updated script tags to use `type="module"`
  
- `js/contact-form.js` - Added form submission and error tracking
- `js/wedding-gallery.js` - Added gallery interaction tracking
- `js/family-gallery.js` - Added gallery interaction tracking
- `js/navigation.js` - Added navigation and mobile menu tracking
- `js/hero-slideshow.js` - Added slideshow auto-advance tracking
- `package.json` - Added `"type": "module"` for ES6 module support

## Viewing Analytics Data

### Google Analytics Dashboard
1. Go to https://analytics.google.com
2. Select your property (Sanford and Hun Film and Photography)
3. View real-time data: Reports > Realtime
4. View event data: Reports > Engagement > Events

### Key Reports to Monitor

**1. Engagement Overview**
- See which pages get the most views
- Average time on page
- Bounce rate by page

**2. Events Report**
- See all custom events we're tracking
- Which gallery interactions are most popular
- Form submission conversion rate
- External link click-through rates

**3. User Acquisition**
- Where visitors are coming from
- Which marketing channels work best
- Organic search vs paid vs social

**4. Conversions**
- Track form submissions as conversions
- Set up goals for key actions

## Setting Up Conversions (Recommended)

In Google Analytics, mark these events as conversions:
1. Go to Admin > Events
2. Find the `form_submission` event
3. Toggle "Mark as conversion"

This helps track how many visitors become leads!

## Custom Events You Can Add

The analytics module (`js/analytics.js`) includes these helper functions you can use anywhere:

```javascript
import { trackEvent, trackFormSubmission, trackNavigation, 
         trackGalleryInteraction, trackExternalLink, 
         trackVideoInteraction, trackSlideshowInteraction } from './analytics.js';

// Track a custom button click
trackEvent('button_click', { button_name: 'View Pricing' });

// Track video play (if you add videos later)
trackVideoInteraction('play', 'Wedding Highlight Reel');

// Track any external link
trackExternalLink('https://example.com', 'Partner Site');
```

## Privacy & Compliance

- GA4 respects user privacy settings
- No personally identifiable information (PII) is collected
- Users can opt out via browser settings
- Complies with GDPR and CCPA requirements

## Testing Analytics

To verify tracking is working:

1. **Real-Time Report**: 
   - Open your site in an incognito window
   - Go to GA4 > Reports > Realtime
   - You should see yourself as an active user
   
2. **Browser Console**:
   - Open DevTools (F12)
   - Console will show: "Analytics event tracked: [event_name]"
   - This confirms events are firing correctly

3. **Test Each Feature**:
   - Submit contact form (check for `form_submission`)
   - Click through galleries (check for `gallery_interaction`)
   - Click navigation links (check for `navigation`)
   - Click social media links (check for `external_link_click`)

## Troubleshooting

**Events not showing up?**
- Check browser console for errors
- Verify GA4 measurement ID is correct (G-K9016HQ6TY)
- Make sure you're not blocking analytics with an ad blocker
- Wait 24-48 hours for full data processing

**Module errors in console?**
- Ensure all script tags have `type="module"` attribute
- Verify package.json has `"type": "module"`
- Check import paths are correct

## Future Enhancements

Consider tracking these in the future:
- Scroll depth (how far users scroll on pages)
- Time spent viewing galleries
- Video play/pause/complete events (when you add more videos)
- Search functionality (if added)
- Booking calendar interactions (if added)

## Measurement ID
**G-K9016HQ6TY**

Keep this ID safe - you'll need it if you ever migrate to a new site or need to set up additional properties.
