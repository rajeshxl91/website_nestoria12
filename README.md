# Nestoria — Live Elevated

A multi-page, frontend-only real estate website built with HTML5, CSS3 and Vanilla JavaScript. No frameworks, no build step and no backend.

## Run It

1. Open the `nestoria_project/` folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.

Alternatively, start a static server:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

An internet connection is needed for Google Fonts, the Lucide icon CDN and Unsplash property photos. A house placeholder appears if a photo fails to load.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage, search, featured properties, benefits and testimonials |
| `listings.html` | Filterable, sortable property grid with Load More |
| `property-details.html?id=1` | Photo gallery, details, agent contact and visit request form |
| `services.html` | Services, process and FAQ |
| `favorites.html` | Saved properties dashboard |
| `blog.html` | Featured article, search, categories and newsletter form |
| `about.html` | Company story, statistics, team and values |
| `contact.html` | Contact details, contact form, FAQ and map-style visual |

## Project Structure

```text
nestoria_project/
├── *.html
├── css/
│   └── Shared and page-specific styles
├── js/
│   ├── properties-data.js
│   │   └── Sample properties, agents and filter options
│   ├── main.js
│   │   └── Shared header/footer, favorites, filtering helpers and validation
│   └── <page>.js
│       └── Page-specific behaviour
└── assets/
    └── Logo and image assets
```

## Site Customizations

- **Contact location:** Greater Noida, Uttar Pradesh, India
- **Phone:** +91 912294077
- **Email:** [rajeshgond00322@gmail.com](mailto:rajeshgond00322@gmail.com)
- **Team:**
  - Rajesh Sah Gond — Team Leader
  - Shubham Yadav — Property Advisor
- Property prices use Indian Rupees (`₹`) and Indian number formatting.
- Favorites are stored in `localStorage` under `nestoria:favorites`.
- Forms validate on the frontend only. Success messages explain that no message is sent and no appointment is booked by this demo.

## Testing Checklist

1. Open every page through Live Server and click every navigation link.
2. **Homepage:** Choose Greater Noida, any type and any price, then press Search.
3. **Listings:** Change filters, sort order, Clear Filters and Load More.
4. **Favorites:** Click a heart, refresh, and confirm the property remains saved. Remove it on Favorites.
5. **Property details:** Open `property-details.html?id=4`, switch gallery thumbnails and test the visit form. Try `?id=999` for the not-found state.
6. **Blog:** Search, switch categories, press Read More and test the newsletter form.
7. **Contact:** Submit empty, invalid and valid forms.
8. Resize to 320, 375, 768, 1024 and 1440 px and check for horizontal scrolling.
9. Check the browser console for errors.

## Notes

- Listings are sample data for demonstration and are not live property offers.
- The map is an illustrative placeholder, not an interactive map.
- Social, privacy and terms pages are not included in this frontend demo.
