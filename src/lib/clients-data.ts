export type Client = {
  id: number;
  clientId: number;
  clientName: string;
  mobile: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  gstNumber: string;
  notes: string;
  status: boolean; // Just in case, similar to contacts
};

export const CLIENTS_STORAGE_KEY = "masters-clients-list-v1";

export const initialClients: Client[] = [];

export function parseStatus(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;
  const s = String(value ?? "").toLowerCase();
  return s === "true" || s === "yes" || s === "active";
}

export function mapApiClient(raw: Record<string, unknown>, idx: number): Client {
  return {
    id: typeof raw.id === "number" ? raw.id : parseInt(String(raw.id ?? idx + 1), 10),
    clientId: typeof raw.clientId === "number" ? raw.clientId : parseInt(String(raw.clientId ?? raw.client_id ?? 1), 10),
    clientName: String(raw.clientName ?? raw.client_name ?? raw.client ?? "N/A"),
    mobile: String(raw.mobile ?? raw.phone ?? ""),
    email: String(raw.email ?? ""),
    website: String(raw.website ?? ""),
    address: String(raw.address ?? ""),
    city: String(raw.city ?? ""),
    state: String(raw.state ?? ""),
    pinCode: String(raw.pinCode ?? raw.pin_code ?? ""),
    gstNumber: String(raw.gstNumber ?? raw.gst_number ?? ""),
    notes: String(raw.notes ?? ""),
    status: parseStatus(raw.status),
  };
}
