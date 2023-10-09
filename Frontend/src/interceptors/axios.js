import axios from "axios";
import { setCred, logOut } from "../features/auth/userSlice";
import { closeModal, openModal } from "../features/modalSlice";
import store from "../pages/store";

let refresh = false;

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/",
});

axiosInstance.interceptors.response.use(
    (resp) => resp,
    async (error) => {
        const state = store.getState().user;
        if (error?.response?.status === 401 && !refresh) {
            refresh = true;

            const response = await axiosInstance.post(
                "api/user/token/refresh/",
                {
                    refresh: state?.refreshtoken,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                { withCredentials: true }
            );
            if (response.response?.data?.detail.toLowerCase() == "token is invalid or expired") {
                store.dispatch(logOut());
                store.dispatch(openModal());
            }
            if (response.status === 200) {
                store.dispatch(closeModal());
                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data["access"]}`;
                store.dispatch(
                    setCred({
                        response: response.data,
                        name: "refreshedToken",
                    })
                );
                return axiosInstance(error.config);
            }
        }
        refresh = false;
        return error;
    }
);

export default axiosInstance;
