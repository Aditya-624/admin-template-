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

export const initialContacts: Contact[] = [
  {
    id: 1,
    clientId: 1,
    client: "ABC University",
    contact: "Anand Rao",
    designation: "COE",
    department: "Examinations",
    mobile: "899993489",
    email: "abcuniversity@gmail.com",
    website: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    notes: "",
    status: true,
  },
  {
    id: 2,
    clientId: 2,
    client: "Bell Schools",
    contact: "Babu Rao",
    designation: "Assistant Examiner",
    department: "Examinations",
    mobile: "988328387",
    email: "bellschools@gmail.com",
    website: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    notes: "",
    status: true,
  },
  {
    id: 3,
    clientId: 3,
    client: "Crest International",
    contact: "Chintamani",
    designation: "HOD",
    department: "IT",
    mobile: "878234773",
    email: "crestinternational@gmail.com",
    website: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    notes: "",
    status: true,
  },
  {
    id: 4,
    clientId: 4,
    client: "DIT",
    contact: "Dorai Swamy",
    designation: "COE",
    department: "Examinations",
    mobile: "987398344",
    email: "DuneIT@gmail.com",
    website: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    notes: "",
    status: true,
  },
];

export const clientOptions = [
  { id: 1, name: "ABC University" },
  { id: 2, name: "Bell Schools" },
  { id: 3, name: "Crest International" },
  { id: 4, name: "DIT" },
];

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
