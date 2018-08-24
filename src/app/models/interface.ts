

// ข้อมูลอาหาร
export interface Food {
    idFood?: string;
    date?: number;
    imageUrl?: string;
    imageName?: string;
    name?: string;
    detail?: string;
    price?: number;
    category?: string;  // =>
    status?: boolean; //  สถานะอาหาร
    promotion?: boolean; //  เมนูแนะนำ
}

// ข้อมูลประเภทอาหาร
export interface Category {
    idCategory?: string;
    name?: string;
}

// ข้อมูลลูกค้า
export interface User {
    idUser?: string;
    email?: string;
    password?: string;
    fname?: string;
    lname?: string;
    address?: string;
    landmarks?: string;   ///  จุดสังเกต
    tel?: number;
    date_Signup?: string;
    photoURL?: string;
    photoName?: string;
}


// ข้อมูลผู้ดูแลระบบ
export interface Admin {
    idAdmin?: string;
    email?: string;
    password?: string;
    fname?: string;
    lname?: string;
    address?: string;
    tel?: number;
    date_Signup?: string;
    photoURL?: string;
    photoName?: string;
}


// รายการสั่งซื้อ
export interface Order {
    idOrder?: string;
    date?: number;
    foods?: any[]; // รายการอาหารทั้งหมด =>
    count?: number;  // จำนวนรายการอาหารทั้งหมด
    total?: number;     // จำนวนเงินทั้งหมด
    payment?: string;  // -- วิธีชำระเงิน
    user?: any; // =>   // ลูกค้า =>
    statusOrder: any;
}


// ข้อมูลการจัดส่ง
export interface Delivery {
    idDelivery?: string;
    date?: number;
    order?: any; // =>
    signature?: string;   //  ลายเซ็น
    statusDelivery?: any;
}



