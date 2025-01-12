import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:5000/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  persistUser: (userData, token) => {
    if (!userData) {
      console.warn("Attempted to persist null/undefined user data");
      return;
    }
    try {
      const dataToStore = {
        user: userData,
        token: token || userData.token
      };
      localStorage.setItem("authData", JSON.stringify(dataToStore));
      
      if (dataToStore.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${dataToStore.token}`;
      }
      set({ 
        user: userData, 
        token: dataToStore.token,
        isAuthenticated: true 
      });
    } catch (error) {
      console.error("Failed to persist auth data:", error);
    }
  },

  rehydrateUser: () => {
	set({ isCheckingAuth: true }); // Set it to true before rehydrating
	try {
	  const storedData = localStorage.getItem("authData");
	  if (storedData) {
		const parsedData = JSON.parse(storedData);
		
		if (parsedData.token) {
		  axios.defaults.headers.common['Authorization'] = `Bearer ${parsedData.token}`;
		}
		
		set({
		  user: parsedData.user,
		  token: parsedData.token,
		  isAuthenticated: true,
		  isCheckingAuth: false, // Auth checked and user rehydrated
		});
	  } else {
		set({ isCheckingAuth: false }); // No user to rehydrate
	  }
	} catch (error) {
	  console.error("Rehydration failed:", error);
	  localStorage.removeItem("authData");
	  set({ isCheckingAuth: false });
	}
  },
  

  signup: async (firstName, lastName,email, password, confirmPassword, phoneNumber, panCardNumber) => {
    set({ isLoading: true, error: null });
    
    if (password !== confirmPassword) {
      set({ isLoading: false });
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phoneNumber,
        panCardNumber,
      });

      const userData = response.data.user;
      const token = response.data.token;

      get().persistUser(userData, token);
      set({ isLoading: false });
      toast.success("Signup successful!");
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error Signing Up",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Signup failed");
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
  
      const userData = response.data.user;
      const token = response.data.token || get().token;
  
      get().persistUser(userData, token); // Persist updated user data
      await get().rehydrateUser(); // Ensure updated state is reflected
  
      set({ isLoading: false });
      toast.success("Email verified successfully!");
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error in Verifying Email",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Email verification failed");
      throw error;
    }
  },
  

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      const token = response.data.token || response.headers['authorization']?.split(' ')[1];
      const userData = response.data.user || response.data;

      get().persistUser(userData, token);
      set({ isLoading: false });
      
      toast.success("Login successful!");
      return userData;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      
      if (response.data.user) {
        const userData = response.data.user;
        get().persistUser(userData, get().token);
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isCheckingAuth: false,
        });
        localStorage.removeItem("authData");
      }
    } catch (error) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
        isCheckingAuth: false,
      });
      localStorage.removeItem("authData");
      delete axios.defaults.headers.common['Authorization'];
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem("authData");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
        isCheckingAuth: false,
      });
      toast.success("Logged out successfully");
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      toast.error("Logout failed");
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ message: response.data.message, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },
}));

// Initialize auth state
const initializeAuth = async () => {
	const store = useAuthStore.getState();
	await store.rehydrateUser();  // Await rehydration
	
	if (store.token) {
	  try {
		await store.checkAuth();
	  } catch (error) {
		console.error("Server verification failed:", error);
	  }
	}
  };
  

// Initialize authentication on load
initializeAuth();

export default useAuthStore;