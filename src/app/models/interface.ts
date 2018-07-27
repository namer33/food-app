

// ข้อมูลอาหาร
export interface Food {
    idFood: string;
    imageUrl: string;
    name: string;
    detail: string;
    price: number;
    idCategory: string;  // =>
    status: boolean; //  สถานะอาหาร
}

// ข้อมูลประเภทอาหาร
export interface Category {
    idCategory: string;
    name: string;
}

// ข้อมูลลูกค้า
export interface User {
    idUser: string;
    email: string;
    password: string;
    fname: string;
    lname: string;
    address: string;
    landmarks: string;   ///  จุดสังเกต
    tel: number;
    date_Signup: string;
    photoURL: string;
}


// ข้อมูลผู้ดูแลระบบ
export interface Admin {
    idAdmin: string;
    email: string;
    password: string;
    fname: string;
    lname: string;
    address: string;
    tel: number;
    date_Signup: string;
    photoURL: string;
}


// รายการสั่งซื้อ
export interface Order {
    idOrder: string;
    date: number;
    foods: any[]; // รายการอาหารทั้งหมด =>
    count: number;  // จำนวนรายการอาหารทั้งหมด
    total: number;     // จำนวนเงินทั้งหมด
    payment: string;  // -- วิธีชำระเงิน
    idUser: string;   // ลูกค้า =>
    statusOrder: string;
}


// ข้อมูลการจัดส่ง
export interface Delivery {
    idDelivery: string;
    idOrder: string; // =>
    signature: any;   //  ลายเซ็น
    statusDelivery: string;
}



