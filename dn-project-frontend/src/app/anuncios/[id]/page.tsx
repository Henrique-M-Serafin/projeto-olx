'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getListingById } from "@/services/services";
import { Listing } from "@/types";
import { Calendar, CalendarDays, Car, Diamond, DiamondPercent, DiamondPlus, Fuel, Gem, Key, KeySquare, Motorbike, Radar, Send, Terminal } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const listingTypes: Record<string, string> = {
    car: 'Carro',
    motorcycle: 'Moto',
};

const fuelTypes: Record<string, string> = {
    GASOLINE: 'Gasolina',
    FLEX: 'Flex',
    DIESEL: 'Diesel',
    ELECTRIC: 'Elétrico',
}


export default function ListingDetailPage() {
    const { id } = useParams();
    const [details, setDetails] = useState<Listing | null>(null);
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await getListingById(Number(id));
                setDetails(response);
            } catch (error) {
                console.error('Error fetching listing:', error);
            }
        };
        fetchDetails();
    }, [id]);
    return (
        <main className="px-24 py-4">
            {details && (
                <>
                    <div className="w-full grid grid-cols-5 gap-4">

                        {/* Fotos — 3/5 da tela */}
                        {details.listing_photos?.length > 0 ? (
                            <div className="col-span-3 grid grid-cols-2 gap-2">
                                <div className="relative aspect-[4/3]">
                                    <Image
                                        src={details.listing_photos[0].url}
                                        alt="Primeira foto do anúncio"
                                        fill
                                        className="object-cover rounded-lg"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/fallback-image-error.jpg';
                                        }}
                                    />
                                </div>
                                {details.listing_photos.length > 1 && (
                                    <div className="grid grid-cols-2 gap-2">
                                        {details.listing_photos.slice(1, 5).map((photo, index) => (
                                            <div key={index} className="relative aspect-[4/3]">
                                                <Image
                                                    src={photo.url}
                                                    alt={`Foto ${index + 2} do anúncio`}
                                                    fill
                                                    className="object-cover rounded-md"
                                                    onError={(e) => {   // 👈 faltava nas fotos menores também
                                                        (e.target as HTMLImageElement).src = '/fallback-image-error.jpg';
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            
                            <div className="col-span-3  bg-muted rounded-lg flex items-center justify-center">
                                <p className="text-muted-foreground">Sem fotos disponíveis</p>
                            </div>
                        )}

                        {/* Card — 2/5 da tela */}
                        <div className="col-span-2 h-full">
                            <Card className="h-full border-1 border-secondary-2">
                                <CardHeader className="mt-auto">
                                    <CardTitle className="text-4xl font-space text-primary-2">R$ {details.price.toFixed(2)}</CardTitle>
                                    <CardDescription className="text-lg">{details.user.first_name} {details.user.last_name}</CardDescription>
                                </CardHeader>
                                <CardFooter className="mt-auto border-t-1 border-terciary-2 ">
                                    <Button variant={"secondary"} className="p-8 w-full text-lg uppercase rounded-xl"><Send /> Entrar em contato</Button>
                                </CardFooter>
                            </Card>
                        </div>

                    </div>
                    <Separator className={"m-4 bg-terciary-2"}></Separator>
                    <div className="w-full h-full grid grid-cols-5">
                        <div className="col-span-2 h-full">
                            <h2 className="text-2xl font-bold">{details.title}</h2>
                            <p className="text-muted-foreground text-lg">{details.description}</p>
                        </div>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle className="p-1 border-1 border-secondary text-secondary rounded-lg mb-1 text-center text-lg uppercase">Detalhes</CardTitle>
                                <Separator className={"bg-terciary-2"}></Separator>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-1 text-center">
                                <div className="p-0.5 border-1 flex justify-center items-center border-primary-2 rounded-md truncate">{details.listing_type == "motorcycle" ? <Motorbike className="h-4 w-4 mr-1 text-primary-2" /> : <Car className="h-4 w-4 mr-1 text-primary-2" />}<p>Categoria: {listingTypes[details.listing_type] || details.listing_type}</p></div>
                                <div className="p-0.5 border-1 flex justify-center items-center border-primary-2 rounded-md truncate"><Gem className="h-4 w-4 mr-1 text-primary-2" />  <p>Marca: {details.vehicles.brand}</p></div>
                                <div className="p-0.5 border-1 flex justify-center items-center border-primary-2 rounded-md truncate"><KeySquare className="h-4 w-4 mr-1 text-primary-2" /> <p>Modelo: {details.vehicles.model}</p></div>
                                <div className="p-0.5 border-1 flex justify-center items-center border-primary-2 rounded-md truncate"><CalendarDays className="h-4 w-4 mr-1 text-primary-2" /> <p>Ano: <span className="font-space">{details.vehicles.year}</span></p></div>
                                <div className="p-0.5 border-1 flex justify-center items-center border-primary-2 rounded-md truncate"><Radar className="h-4 w-4 mr-1 text-primary-2" /> <p>Quilometragem: <span className="font-space">{details.vehicles.mileage}</span></p></div>
                                <div className="p-0.5 border-1 flex justify-center items-center border-primary-2 rounded-md truncate"><Fuel className="h-4 w-4 mr-1 text-primary-2" /> <p>Combustível: {fuelTypes[details.vehicles.fuel_type] || details.vehicles.fuel_type}</p></div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </main>
    );
}