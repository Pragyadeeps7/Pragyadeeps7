import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL;
export const API = `${BASE}/api`;

const client = axios.create({ baseURL: API, timeout: 15000 });

export const getProducts = (params = {}) => client.get("/products", { params }).then(r => r.data);
export const getProduct = (id) => client.get(`/products/${id}`).then(r => r.data);
export const getCategories = () => client.get("/categories").then(r => r.data);
export const getTestimonials = () => client.get("/testimonials").then(r => r.data);
export const subscribeNewsletter = (email) => client.post("/newsletter", { email }).then(r => r.data);
export const placeOrder = (payload) => client.post("/orders", payload).then(r => r.data);

export default client;
