/**
 * @fileoverview Servicio de datos para el panel de administrador
 * Contiene datos mock para dashboard, pedidos, clientes e inventario de telas.
 * Cuando conectes la BD real, reemplaza cada función por la llamada correspondiente.
 */
 
// ─── PEDIDOS ────────────────────────────────────────────────────────────────
 
export const MOCK_ORDERS = [
  { id: "#1082", client: "Laura Medina",  initials: "LM", products: ["Camisa Slim"],           total: 95000,  date: "10 may", status: "entregado"  },
  { id: "#1081", client: "Carlos Ruiz",   initials: "CR", products: ["Camisa Oxford", "Chino"], total: 177000, date: "9 may",  status: "transito"   },
  { id: "#1080", client: "Ana Soto",      initials: "AS", products: ["Camisa Azul"],            total: 85000,  date: "9 may",  status: "confirmado" },
  { id: "#1079", client: "Miguel Pérez",  initials: "MP", products: ["Suéter", "Blusa"],        total: 210000, date: "8 may",  status: "entregado"  },
  { id: "#1078", client: "Sofía Vargas",  initials: "SV", products: ["Camisa Rayas"],           total: 93000,  date: "7 may",  status: "cancelado"  },
  { id: "#1077", client: "Jorge Pinto",   initials: "JP", products: ["Camisa Oxford"],          total: 88000,  date: "6 may",  status: "entregado"  },
  { id: "#1076", client: "María Ríos",    initials: "MR", products: ["Camisa Lino", "Chino"],   total: 200000, date: "6 may",  status: "transito"   },
];
 
export const ORDER_STATUS = {
  entregado:  { label: "Entregado",   color: "#3B6D11", bg: "#EAF3DE" },
  transito:   { label: "En tránsito", color: "#854F0B", bg: "#FAEEDA" },
  confirmado: { label: "Confirmado",  color: "#185FA5", bg: "#E6F1FB" },
  cancelado:  { label: "Cancelado",   color: "#A32D2D", bg: "#FCEBEB" },
  pendiente:  { label: "Pendiente",   color: "#5F5E5A", bg: "#F1EFE8" },
};
 
// ─── CLIENTES ────────────────────────────────────────────────────────────────
 
export const MOCK_CLIENTS = [
  { id: 1, name: "Laura Medina",  initials: "LM", email: "laura.m@gmail.com",    orders: 7, total: 620000, lastOrder: "10 may", active: true,  avatarBg: "#E6F1FB", avatarColor: "#185FA5" },
  { id: 2, name: "Carlos Ruiz",   initials: "CR", email: "c.ruiz@hotmail.com",   orders: 4, total: 410000, lastOrder: "9 may",  active: true,  avatarBg: "#EAF3DE", avatarColor: "#3B6D11" },
  { id: 3, name: "Ana Soto",      initials: "AS", email: "anasoto@gmail.com",    orders: 2, total: 170000, lastOrder: "9 may",  active: true,  avatarBg: "#FAEEDA", avatarColor: "#854F0B" },
  { id: 4, name: "Miguel Pérez",  initials: "MP", email: "mperez@yahoo.com",     orders: 9, total: 890000, lastOrder: "8 may",  active: true,  avatarBg: "#EEEDFE", avatarColor: "#534AB7" },
  { id: 5, name: "Sofía Vargas",  initials: "SV", email: "sofia.v@gmail.com",    orders: 1, total: 93000,  lastOrder: "7 may",  active: false, avatarBg: "#FAECE7", avatarColor: "#993C1D" },
  { id: 6, name: "Jorge Pinto",   initials: "JP", email: "jpinto@gmail.com",     orders: 5, total: 480000, lastOrder: "6 may",  active: true,  avatarBg: "#E1F5EE", avatarColor: "#0F6E56" },
  { id: 7, name: "María Ríos",    initials: "MR", email: "m.rios@outlook.com",   orders: 3, total: 340000, lastOrder: "6 may",  active: true,  avatarBg: "#FBEAF0", avatarColor: "#993556" },
];
 
// ─── INVENTARIO DE TELAS ─────────────────────────────────────────────────────
 
export const MOCK_FABRICS = [
  { id: 1, name: "Algodón pima",  stock: 90,  maxStock: 100, unit: "m", color: "#378ADD", low: false },
  { id: 2, name: "Lino crudo",    stock: 75,  maxStock: 100, unit: "m", color: "#639922", low: false },
  { id: 3, name: "Oxford",        stock: 68,  maxStock: 100, unit: "m", color: "#7F77DD", low: false },
  { id: 4, name: "Denim ligero",  stock: 55,  maxStock: 100, unit: "m", color: "#BA7517", low: false },
  { id: 5, name: "Tencel",        stock: 40,  maxStock: 100, unit: "m", color: "#D85A30", low: false },
  { id: 6, name: "Jersey modal",  stock: 62,  maxStock: 100, unit: "m", color: "#1D9E75", low: false },
  { id: 7, name: "Popelina",      stock: 18,  maxStock: 100, unit: "m", color: "#E24B4A", low: true  },
  { id: 8, name: "Franela",       stock: 12,  maxStock: 100, unit: "m", color: "#888780", low: true  },
];
 
export const MOCK_FABRIC_MOVEMENTS = [
  { fabric: "Lino crudo",   type: "entrada", qty: 40,  date: "7 may" },
  { fabric: "Algodón pima", type: "entrada", qty: 30,  date: "5 may" },
  { fabric: "Popelina",     type: "uso",     qty: -12, date: "4 may" },
  { fabric: "Oxford",       type: "uso",     qty: -8,  date: "3 may" },
  { fabric: "Franela",      type: "uso",     qty: -20, date: "2 may" },
  { fabric: "Tencel",       type: "entrada", qty: 40,  date: "1 may" },
];
 
// ─── MÉTRICAS DASHBOARD ──────────────────────────────────────────────────────
 
export const MOCK_METRICS = {
  salesMonth:    4200000,
  ordersMonth:   138,
  activeClients: 294,
  avgTicket:     30000,
  weeklyData:    [820000, 1100000, 980000, 1300000],
  weeklyLabels:  ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
  categoryData:  [52, 20, 15, 8, 5],
  categoryLabels:["Camisas", "Pantalones", "Suéteres", "Blusas", "Otros"],
  topProducts: [
    { name: "Camisa Slim Fit",  pct: 82 },
    { name: "Camisa Oxford",    pct: 67 },
    { name: "Pantalón Chino",   pct: 54 },
    { name: "Blusa Floral",     pct: 38 },
    { name: "Suéter Clásico",   pct: 29 },
  ],
};