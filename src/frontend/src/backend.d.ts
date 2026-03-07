import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: string;
    availableMaterials: Array<Material>;
    name: string;
    room: Room;
    isNewArrival: boolean;
    description: string;
    category: Category;
    availableUpholstery: Array<Upholstery>;
    priceInr: bigint;
}
export interface ShowroomLead {
    id: string;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
    phone: string;
    pincode: string;
}
export enum Category {
    bed = "bed",
    sofa = "sofa",
    mediaUnit = "mediaUnit",
    diningTable = "diningTable"
}
export enum Material {
    matteWalnut = "matteWalnut",
    naturalTeak = "naturalTeak",
    charcoalAsh = "charcoalAsh"
}
export enum Room {
    bedroom = "bedroom",
    dining = "dining",
    living = "living"
}
export enum Upholstery {
    italianVelvet = "italianVelvet",
    performanceBoucle = "performanceBoucle"
}
export interface backendInterface {
    getMostLoved(limit: bigint): Promise<Array<Product>>;
    getNewArrivals(): Promise<Array<Product>>;
    getProductById(id: string): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getProductsByMaterial(material: string): Promise<Array<Product>>;
    getProductsByRoom(room: string): Promise<Array<Product>>;
    getShowroomLeads(): Promise<Array<ShowroomLead>>;
    recordView(productId: string): Promise<void>;
    submitShowroomLead(name: string, email: string, phone: string, pincode: string, message: string): Promise<string>;
}
