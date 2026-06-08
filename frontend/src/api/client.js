import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL;
export const API = `${BASE}/api`;

const client = axios.create({ baseURL: API, timeout: 20000, withCredentials: true });

// Public
export const getProducts = (params = {}) => client.get("/products", { params }).then(r => r.data);
export const getProduct = (id) => client.get(`/products/${id}`).then(r => r.data);
export const getCategories = () => client.get("/categories").then(r => r.data);
export const getTestimonials = () => client.get("/testimonials").then(r => r.data);
export const subscribeNewsletter = (email) => client.post("/newsletter", { email }).then(r => r.data);
export const placeOrder = (payload) => client.post("/orders", payload).then(r => r.data);

// Auth
export const exchangeSession = (session_id) => client.post("/auth/session", { session_id }).then(r => r.data);
export const getMe = () => client.get("/auth/me").then(r => r.data);
export const logout = () => client.post("/auth/logout").then(r => r.data);

// User
export const myOrders = () => client.get("/orders/me").then(r => r.data);
export const getProductReviews = (pid) => client.get(`/products/${pid}/reviews`).then(r => r.data);
export const postReview = (payload) => client.post("/reviews", payload).then(r => r.data);

// Admin
export const adminStats = () => client.get("/admin/stats").then(r => r.data);
export const adminOrders = (params = {}) => client.get("/admin/orders", { params }).then(r => r.data);
export const adminUpdateOrder = (oid, status) => client.patch(`/admin/orders/${oid}`, { status }).then(r => r.data);
export const adminSubscribers = () => client.get("/admin/subscribers").then(r => r.data);
export const adminReviews = () => client.get("/admin/reviews").then(r => r.data);
export const adminDeleteReview = (rid) => client.delete(`/admin/reviews/${rid}`).then(r => r.data);
export const adminCreateProduct = (payload) => client.post("/admin/products", payload).then(r => r.data);
export const adminUpdateProduct = (pid, payload) => client.patch(`/admin/products/${pid}`, payload).then(r => r.data);
export const adminDeleteProduct = (pid) => client.delete(`/admin/products/${pid}`).then(r => r.data);

export default client;
