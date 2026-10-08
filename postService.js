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
    name: 'Aarav Sharma',
    username: 'aarav.sharma',
    email: 'aarav.sharma@novatech.dev',
    phone: '+91 98100 10001',
    website: 'aaravsharma.dev',
    city: 'Mumbai',
    company: 'NovaTech Solutions',
  },
  2: {
    name: 'Priya Verma',
    username: 'priya.verma',
    email: 'priya.verma@blueorbit.dev',
    phone: '+91 98100 10002',
    website: 'priyaverma.dev',
    city: 'Delhi',
    company: 'BlueOrbit Systems',
  },
  3: {
    name: 'Rohan Mehta',
    username: 'rohan.mehta',
    email: 'rohan.mehta@pixelforge.dev',
    phone: '+91 98100 10003',
    website: 'rohanmehta.dev',
    city: 'Bengaluru',
    company: 'PixelForge Studio',
  },
  4: {
    name: 'Ananya Iyer',
    username: 'ananya.iyer',
    email: 'ananya.iyer@cloudnest.dev',
    phone: '+91 98100 10004',
    website: 'ananyaiyer.dev',
    city: 'Chennai',
    company: 'CloudNest Labs',
  },
  5: {
    name: 'Karan Singh',
    username: 'karan.singh',
    email: 'karan.singh@codecraft.dev',
    phone: '+91 98100 10005',
    website: 'karansingh.dev',
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
export const getPostsByUser = (id) =>
  apiClient.get('/posts', { params: { userId: id } });

// POST /posts  payload: { title, body, userId }
export const createPost = (payload) => apiClient.post('/posts', payload);

// Turns an Axios error into a readable message
export const getErrorMessage = (err) => {
  if (err.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (err.response) return `Server error (${err.response.status}). Please try again.`;
  return 'Network error. Check your connection and try again.';
};
