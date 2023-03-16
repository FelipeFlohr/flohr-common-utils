import crypto from "crypto";

export default function getNodeUniqueId(): string {
    return crypto.randomUUID();
}