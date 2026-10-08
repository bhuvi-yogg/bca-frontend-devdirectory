import apiClient from './api';
 
/*
 * ------------------------------------------------------------------
 *  CHANGE DEVELOPER DETAILS HERE
 * ------------------------------------------------------------------
 *  The API (JSONPlaceholder) always returns the same 10 users.
 *  Edit the details below for each developer (key = user id, 1 to 10).
 *  Fields: name, username, email, phone, website, city, company
 *  (all optional - anything you remove keeps the value from the API).
 *  The details are applied everywhere: directory cards, search,
 *  profile page, Home stats and the Author dropdown in Add Post.
 */
const DEVELOPER_OVERRIDES = {
  1: {
    name: 'bhumnesh labana',
    username: 'iambhuvi',
    email: 'bhumneshnayak00@gmail.com',
    phone: '+91 7623834047',
    website: 'iambhuvi.dev',
    city: 'jaipur',
    company: 'blackhat',
  },
  2: {
    name: 'yogita sharma',
    username: 'yogee.verma',
    email: 'yogitasharmu@gmail.com',
    phone: '+91 98107*****',
    website: 'yogg.com',
    city: 'gujrat',
    company: 'Blackhat',
  },
  3: {
    name: 'ankit chauhan',
    username: 'yash',
    email: 'ankitchauhan@gmail.com',
    phone: '+91 9335266036',
    website: 'jarvis.com',
    city: 'himachal',
    company: 'PixelForge Studio',
  },
  4: {
    name: 'pintu jatav',
    username: 'pintu',
    email: 'pintujatav@gmail.com',
    phone: '+91 98100 *****',
    website: 'pintu.com',
    city: 'jaipur',
    company: 'CloudNest Labs',
  },
  5: {
    name: 'zaid khan',
    username: 'zaid ',
    email: 'zaidkhan@gmail.com',
    phone: '+91 98100 *****',
    website: 'zaid.com',
    city: 'Jaipur',
    company: 'CodeCraft Technologies',
  },
  6: {
    name: 'Neha Gupta',
    username: 'neha.gupta',
    email: 'neha.gupta@databridge.dev',
    phone: '+91 98100 10006',
    website: 'nehagupta.dev',
    city: 'Lucknow',
    company: 'DataBridge Analytics',
  },
  7: {
    name: 'Vikram Patel',
    username: 'vikram.patel',
    email: 'vikram.patel@quantumleap.dev',
    phone: '+91 98100 10007',
    website: 'vikrampatel.dev',
    city: 'Ahmedabad',
    company: 'Quantum Leap IT',
  },
  8: {
    name: 'Sneha Reddy',
    username: 'sneha.reddy',
    email: 'sneha.reddy@brightpath.dev',
    phone: '+91 98100 10008',
    website: 'snehareddy.dev',
    city: 'Hyderabad',
    company: 'BrightPath Software',
  },
  9: {
    name: 'Arjun Nair',
    username: 'arjun.nair',
    email: 'arjun.nair@skyline.dev',
    phone: '+91 98100 10009',
    website: 'arjunnair.dev',
    city: 'Kochi',
    company: 'SkyLine Digital',
  },
  10: {
    name: 'Meera Joshi',
    username: 'meera.joshi',
    email: 'meera.joshi@bytewave.dev',
    phone: '+91 98100 10010',
    website: 'meerajoshi.dev',
    city: 'Pune',
    company: 'ByteWave Systems',
  },
};
 
// Edits saved from the Edit button on the profile page (kept in the browser)
const EDITS_KEY = 'dd_developer_edits';
const loadEdits = () => {
  try {
    return JSON.parse(localStorage.getItem(EDITS_KEY)) || {};
  } catch {
    return {};
  }
};
 
// Save / clear edits made in the app (used by UserProfile.jsx)
export const saveDeveloperEdit = (id, values) => {
  const edits = loadEdits();
  edits[id] = { ...edits[id], ...values };
  localStorage.setItem(EDITS_KEY, JSON.stringify(edits));
};
export const resetDeveloperEdit = (id) => {
  const edits = loadEdits();
  delete edits[id];
  localStorage.setItem(EDITS_KEY, JSON.stringify(edits));
};
 
// Merges: API data  <-  DEVELOPER_OVERRIDES (this file)  <-  edits made in the app
const applyOverride = (user) => {
  const o = { ...DEVELOPER_OVERRIDES[user.id], ...loadEdits()[user.id] };
  if (Object.keys(o).length === 0) return user;
  const { city, company, ...rest } = o;
  return {
    ...user,
    ...rest,
    address: city ? { ...user.address, city } : user.address,
    company: company ? { ...user.company, name: company } : user.company,
  };
};
 
const withOverrides = (res) => ({
  ...res,
  data: Array.isArray(res.data) ? res.data.map(applyOverride) : applyOverride(res.data),
});
 
// GET /users
export const getUsers = () => apiClient.get('/users').then(withOverrides);
 
// GET /users/:id
export const getUserById = (id) => apiClient.get(`/users/${id}`).then(withOverrides);
 
// GET /posts?userId=:id
const MY_POSTS = {
  1: [
    { title: 'Designing REST APIs that age well', body: 'Consistent naming, clear versioning and predictable error responses keep an API easy to maintain as the team grows.' },
    { title: 'Lessons from our first microservice split', body: 'We moved billing into its own service and learned to agree on ownership and contracts before writing any code.' },
    { title: 'A practical checklist for code reviews', body: 'Review for readability first, then correctness, then performance, and always leave at least one positive comment.' },
  ],
  2: [
    { title: 'Getting started with React hooks', body: 'useState and useEffect cover most daily needs, and custom hooks let you share logic without duplicating code.' },
    { title: 'Building accessible forms', body: 'Real labels, visible focus states and clear inline errors help every user complete a form without frustration.' },
    { title: 'Why we adopted a design system', body: 'Shared components reduced UI bugs and made it much faster to build new screens that look consistent.' },
  ],
  3: [
    { title: 'Responsive layouts with CSS Grid', body: 'Grid makes it simple to build card layouts that adapt from one column on phones to many columns on desktops.' },
    { title: 'Skeleton screens versus spinners', body: 'Skeleton loaders show the shape of the page while data loads, which feels faster and avoids layout jumps.' },
    { title: 'Dark mode without the headaches', body: 'Define colours as variables once, then switch the whole theme by changing a single set of values.' },
  ],
  4: [
    { title: 'Deploying a React app on Vercel', body: 'Connect the repository, set the build command and add a rewrite rule so client-side routes work after a refresh.' },
    { title: 'Understanding CI/CD pipelines', body: 'Automated builds and tests on every push catch problems early and make releases calm and repeatable.' },
    { title: 'Monitoring basics every team needs', body: 'Track errors, response times and uptime so you hear about problems before your users do.' },
  ],
  5: [
    { title: 'Structuring a Node and React project', body: 'Keep the API and the user interface in separate folders with clear boundaries, and share only what is truly common.' },
    { title: 'Handling errors gracefully in the UI', body: 'Show friendly messages with a retry button instead of a blank screen, and never let one failure break the page.' },
    { title: 'Git branching strategies for small teams', body: 'Short-lived feature branches and small pull requests keep the main branch stable and reviews quick.' },
  ],
  6: [
    { title: 'From raw data to a clean dashboard', body: 'Start with the question, clean the data once, and show only the few numbers that help people decide.' },
    { title: 'SQL tips for faster reports', body: 'Select only the columns you need, add indexes on filter fields and check the query plan before optimising.' },
    { title: 'Visualising data honestly', body: 'Start bar charts at zero, label axes clearly and choose colours that stay readable for everyone.' },
  ],
  7: [
    { title: 'Web performance quick wins', body: 'Compress images, split large bundles and cache static files to cut load time without rewriting the application.' },
    { title: 'Authentication basics: sessions and tokens', body: 'Understand where credentials are stored, how long they live and how they are checked on every request.' },
    { title: 'Writing tests that catch real bugs', body: 'Test behaviour that users care about instead of implementation details, and keep each test small and focused.' },
  ],
  8: [
    { title: 'Testing React components with Vitest', body: 'Render the component, interact like a user and assert on what appears on the screen rather than internal state.' },
    { title: 'Writing clear bug reports', body: 'Include the steps to reproduce, the expected result, the actual result and a screenshot to save everyone time.' },
    { title: 'Release checklists that prevent surprises', body: 'A short, shared checklist for testing, backups and rollback plans makes every release less stressful.' },
  ],
  9: [
    { title: 'Managing environment variables safely', body: 'Keep secrets out of the repository, use separate values for each environment and rotate keys regularly.' },
    { title: 'Docker for beginners', body: 'Containers package the app with its dependencies so it runs the same way on every machine.' },
    { title: 'Documenting your code for future you', body: 'Short comments on why a decision was made, plus a clear README, save hours when you return to a project.' },
  ],
  10: [
    { title: 'Mentoring junior developers', body: 'Pair on real tasks, explain the reasoning behind decisions and let them make small, safe mistakes.' },
    { title: 'Running effective stand-ups', body: 'Keep it under ten minutes, focus on blockers and move longer discussions to a separate conversation.' },
    { title: 'How we plan a one-week sprint', body: 'Pick a small goal, break it into tasks with owners and review progress together at the end of every day.' },
  ],
};

// GET /posts?userId=:id  (still requested through Axios, then replaced with MY_POSTS)
export const getPostsByUser = (id) =>
  apiClient.get('/posts', { params: { userId: id } }).then((res) => {
    const mine = MY_POSTS[id];
    if (!mine) return res;
    return {
      ...res,
      data: mine.map((p, i) => ({ id: Number(id) * 100 + i + 1, userId: Number(id), ...p })),
    };
  });
 
// POST /posts  payload: { title, body, userId }
export const createPost = (payload) => apiClient.post('/posts', payload);
 
// Turns an Axios error into a readable message
export const getErrorMessage = (err) => {
  if (err.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (err.response) return `Server error (${err.response.status}). Please try again.`;
  return 'Network error. Check your connection and try again.';
};
 