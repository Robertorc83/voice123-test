# Voice123 Test

The app implements a text search functionality using the Voice123 API. It features:

- A search input and button that trigger a query when the Enter key is pressed or the Search button is clicked.
- URL query parameters for bookmarking and sharing search results.
- Lottie animations for loading and error states.
- A results list displaying voice actor details, including highlighted matching text, profile pictures, and an audio player.
- A pagination component using MUI's Pagination (with custom styling).
- In this prototype, a fixed audio sample URL was used because most audio samples are protected by authentication

---

## Application Setup Guide

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/voice123-test.git
   cd voice123-test
   ```

2. **Install Dependencies:**

   Using PNPM:

   ```bash
   pnpm install
   ```

3. **Run the Development Server:**

   ```bash
   pnpm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

4. **Run the Test Suite:**

   ```bash
   pnpm run test
   ```

---

## Worklog

- **Total Hours Spent:** Approximately 3 hours and some minutes.

- **Tasks Completed:**
  - **Search Functionality:** Implemented a search input and button that triggers a query using both click and Enter key events.
  - **URL Query Parameters:** Added logic to read and update query parameters from the URL so that search results can be bookmarked and shared.
  - **Animations:** Integrated animations for loading and error states.
  - **Results List:** Built a responsive results list showing voice actor details, with text highlighting for search terms, profile images, and an audio player.
  - **Pagination:** Integrated MUI’s built-in Pagination component with custom styling (black borders, black text, white background for the selected page).
  - **TDD & Testing:** Wrote tests using React Testing Library and Jest from the beginning. Mocks were set up for global fetch, Next.js navigation hooks, and Lottie to ensure tests run in a jsdom environment.

---

## Future Improvements and Recommendations

- **Enhanced Audio Player Integration:**  
  Consider integrating a dedicated audio player library (e.g. `react-h5-audio-player`) that supports advanced features such as customizable controls, better streaming support, and improved performance. This is particularly important for a voice app where high-quality playback and responsive controls are crucial—especially when samples are protected by authentication.

- **Global Error Handling:**  
  Implement an Error Boundary component to catch and gracefully handle errors throughout the UI. This can be extended with error logging services like Sentry to provide real-time error tracking and to ensure safe deployments. A scalable error-handling solution would help maintain a consistent user experience even when unexpected issues occur.

- **Caching and Data Fetching Enhancements:**  
  Use a library such as React Query (or SWR) to manage server state and caching. This will reduce redundant API calls, improve performance, and ensure that search results remain consistent. Leveraging Next.js’s built-in caching features can further optimize data fetching.

- **CI/CD Integration:**  
  Set up continuous integration and deployment pipelines (using GitHub Actions, CircleCI, or Vercel’s built‑in CI/CD) to automatically run your tests, lint your code, and deploy only when all checks pass. This ensures that every commit is validated, reducing the risk of deploying broken code.

- **Favorites Functionality:**  
  Add the ability for users to mark their favorite voice providers. This could be implemented using a backend service or client-side storage (such as localStorage or cookies) to save and display favorite providers, enhancing the personalization of the app.

