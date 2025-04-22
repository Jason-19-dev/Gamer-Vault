
// 
export type Product = {
    id: number
    name: string
    description: string
    price: number
    stock: number
    available: boolean
    image_url: string
    create_at: string
    category_name?: string
  }
  

export type Customer = {
    id: number
    nameUser: string
    email: string
    phone: string
    birthday_date: string
    address:string
    contry:string
    password: string
    is_active: boolean
    role: string
    create_at: string

}


export type order = {
    nombre: string
    fecha: string
    tipo_entrega: string
    total: number
    estado: string
    item: items[] // dymano
}

export type items = {
    item_id: number
    name:string
    cantidad: number
    precio_unitario: number
}

export type Wallet = {
    balance: number
    user_id: string
}