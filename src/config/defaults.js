export const BACKEND_API="http://localhost:1928"

export const ENDPOINTS = {
    "auth": {method: "POST", url: "/api/auth",},
    "refresh": {method: "GET", url: "/api/refresh"},
    "public": {method: "GET", url: "/api/public", secure: false},
    "secret": {method: "GET", url: "/api/secret", secure: true},
    "admin": {method: "GET", url: "/api/admin", secure: true},
    "superUser": {method: "GET", url: "/api/superUser", secure: true},
}

const STATE_IDLE = "IDLE";
const STATE_AUTHORISED = "AUTHORISED";
const STATE_ADMIN = "ADMIN";
const STATE_SUPERUSER = "SUPERUSER";

export const AUTH_STATES = { STATE_IDLE, STATE_AUTHORISED, STATE_ADMIN, STATE_SUPERUSER }