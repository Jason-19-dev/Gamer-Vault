
//
export type GameItem = {
    id: string
    name: string
    price: number
    image_url: string
    product_id?: string
  }

export type CoinItem = {
    id: string
    game_name: string // Nombre del juego o moneda
    image_url: string
    product_id?: string
}


export type Order = {
    order_id: number
    status: string
    total: number
    savings: number
    created_at: string
    payment_method: string
    description: Order_Details[]
}

export type Order_Details = {
    order_id: number
    savings: number
    name: string
    price: number
    image_url: string
    quantity: number
}

export type Wallet = {
    balance: number
    user_id: string
}