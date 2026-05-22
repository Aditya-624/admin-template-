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

export const initialClients: Client[] = [
  {
    id: 1,
    clientId: 1,
    clientName: "ABC University",
    mobile: "899993489",
    email: "abcuniversity@gmail.com",
    website: "www.abcuniv.com",
    address: "Somer Adddress 1",
    city: "Hyderabad",
    state: "TG",
    pinCode: "500007",
    gstNumber: "",
    notes: "",
    status: true,
  },
  {
    id: 2,
    clientId: 2,
    clientName: "Bell Schools",
    mobile: "988328387",
    email: "bellschools@gmail.com",
    website: "www.bellschools.com",
    address: "Somer Adddress 2",
    city: "Bangalore",
    state: "KR",
    pinCode: "934242",
    gstNumber: "",
    notes: "",
    status: true,
  },
  {
    id: 3,
    clientId: 3,
    clientName: "Crest International",
    mobile: "878234773",
    email: "crestinternational@gmail.com",
    website: "",
    address: "Somer Adddress 3",
    city: "Mumbai",
    state: "MH",
    pinCode: "430123",
    gstNumber: "",
    notes: "",
    status: true,
  },
  {
    id: 4,
    clientId: 4,
    clientName: "DIT",
    mobile: "987398344",
    email: "DuneIT@gmail.com",
    website: "www.dit.com",
    address: "Somer Adddress 4",
    city: "Dehradun",
    state: "UK",
    pinCode: "222883",
    gstNumber: "",
    notes: "",
    status: true,
  },
];

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
