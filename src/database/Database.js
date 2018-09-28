import {app} from "./Auth.js";
require("firebase/database");

export const db = app.database();

export function on(url, callback) {
	return db.ref(url).on("value", callback, (error) => console.log(error));
}

export function once(url, callback) {
	return db.ref(url).once("value", callback, (error) => console.log(error));
}

export function update(obj) {
	return db.ref().update(obj)
}