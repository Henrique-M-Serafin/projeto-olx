"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getListings, searchListings } from "@/services/services";
import { Listing } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
export default function Home() {

  const [listings, setListings] = useState<Listing[]>([]);
  const searchParams = useSearchParams();
  const q = searchParams.get('q');

  useEffect(() => {
    const fetchData = async () => {
      try {
         const response = q ? await searchListings(q) : await getListings();
                setListings(response);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchData();
  }, [q]);

  return (
      <main className="w-full font-space p-6">
        <div className="grid grid-cols-5  gap-4 w-full">
        {listings.map((listing: Listing) => (
          <Card key={listing.ID}
            className=" "
          >
            {listing.listing_photos?.[0]?.url && (
                <Image
                  src={listing.listing_photos[0].url} 
                  alt={listing.title}
                  width={300}
                  height={200}
                  className="w-full"
                />
              )}
            <CardHeader>
              <CardTitle className="font-space">{listing.title}</CardTitle>
            </CardHeader>
            <CardContent className="font-space">
              
              <p>Price: ${listing.price.toFixed(2)}</p>
              <p>{new Date(listing.CreatedAt).toLocaleString('pt-BR')}</p>
            </CardContent>
          </Card>
        ))}
        </div>
      </main>
  );
}