import { cache } from "react"
import { auth } from "./auth"

/**
 * React-cached wrapper around auth().
 * Within a single server render, multiple calls return the same promise —
 * the JWT is only verified once per request instead of once per component.
 */
export const getSession = cache(auth)
