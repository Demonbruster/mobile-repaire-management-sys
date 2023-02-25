import axios from "../lib/axios";

export const getDevices = async() => {
	return await axios
		.get("/device")
		.then((res) => res.data)
		.catch((err) => err);
};
