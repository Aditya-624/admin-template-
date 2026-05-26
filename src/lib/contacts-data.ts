export type Contact = {
  id: number;
  clientId: number;
  client: string;
  contact: string;
  designation: string;
  department: string;
  mobile: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  notes: string;
  status: boolean;
};

export const CONTACTS_STORAGE_KEY = "masters-contacts-list-v1";

export const initialContacts: Contact[] = [];

export const clientOptions: { id: number; name: string }[] = [];

export function parseStatus(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;
  const s = String(value ?? "").toLowerCase();
  return s === "true" || s === "yes" || s === "active";
}

export function mapApiContact(raw: Record<string, unknown>, idx: number): Contact {
  return {
    id: typeof raw.id === "number" ? raw.id : parseInt(String(raw.id ?? raw.contact_id ?? idx + 1), 10),
    clientId: typeof raw.clientId === "number" ? raw.clientId : parseInt(String(raw.clientId ?? raw.client_id ?? 1), 10),
    client: String(raw.client ?? raw.client_name ?? "N/A"),
    contact: String(raw.contact ?? raw.contact_name ?? ""),
    designation: String(raw.designation ?? ""),
    department: String(raw.department ?? ""),
    mobile: String(raw.mobile ?? raw.phone ?? ""),
    email: String(raw.email ?? ""),
    website: String(raw.website ?? ""),
    address: String(raw.address ?? ""),
    city: String(raw.city ?? ""),
    state: String(raw.state ?? ""),
    pinCode: String(raw.pinCode ?? raw.pin_code ?? ""),
    notes: String(raw.notes ?? ""),
    status: parseStatus(raw.status),
  };
}
