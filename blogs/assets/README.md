# Blog assets

Place images and video assets for blog posts here. Reference them from blog post HTML files using paths like `assets/filename.jpg` (from within the `blogs/` folder).

## Pulling images and videos from TravelAI.com

1. **Open the source post** on [TravelAI.com Resources](https://www.travelai.com/resources/) (e.g. `https://www.travelai.com/resources/humanizing-travel-ai/`).
2. **Images**: Right‑click each image → “Save image as…” and save into this `blogs/assets/` folder. Use a clear name (e.g. `humanizing-travel-ai-hero.jpg`, `dynamic-pricing-chart.png`).
3. **Videos**: If the post embeds YouTube/Vimeo, the blog page can embed the same video using an iframe (e.g. `https://www.youtube.com/embed/VIDEO_ID`). No need to save video files here.
4. **Update the blog HTML**: In the post’s `.html` file under `blogs/`, replace the placeholder `<div class="article-img">` or figure blocks with:
   ```html
   <img src="assets/your-filename.jpg" alt="Description" style="width:100%;height:auto;border-radius:12px;">
   ```

## Local blog post → TravelAI URL mapping

Use this mapping to find the source post for each local blog file when pulling content or assets:

| Local file (blogs/) | TravelAI URL |
|--------------------|--------------|
| ai-assistant-bundled-travel-bookings.html | /resources/ai-assistant-for-bundled-travel-bookings/ |
| dynamic-pricing-algorithms-travel-business-profitability.html | /resources/dynamic-pricing-travel-profitability/ |
| humanizing-travel-ai-virtuoso-matthew-upchurch.html | /resources/humanizing-travel-ai/ |
| trip-ai-shopping.html | /resources/trip-ai-shopping/ |
| how-chatbots-provide-instant-travel-information-from-visa-rules-to-local-customs.html | /resources/how-chatbots-provide-instant-travel-information-from-visa-rules-to-local-customs/ |
| use-ai-predictive-analytics-travel-booking.html | /resources/use-ai-predictive-analytics-travel-booking/ |
| (other posts) | Match by title on [TravelAI Sitemap](https://www.travelai.com/site-map) |

Original blog images and media from [TravelAI.com/resources](https://www.travelai.com/resources/) can be downloaded and added here to replace placeholder areas in the blog posts.
