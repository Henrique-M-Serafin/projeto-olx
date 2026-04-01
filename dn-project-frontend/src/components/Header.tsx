    'use client'

    import Image from "next/image";
    import { Input } from "./ui/input";
    import { Button } from "./ui/button";
    import { LogOut, SearchIcon, UserIcon } from "lucide-react";
    import { CreateListingDialog } from "./CreateListingDIalog";
    import { LoginDialog } from "./LoginDialog";
    import { useEffect, useState } from "react";
    import { useAuth } from "@/context/AuthContext";
    import { UserMenu } from "./UserMenu";
    import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./ui/input-group";
    import Link from "next/link";
    import { useRouter } from "next/navigation";


    type ListingTypes = 'car' | 'motorcycle';
    const listingTypes: Record<string, ListingTypes>
    = {
        Carro: 'car',
        Moto: 'motorcycle',
    }

    export const Header = () => {
        const { user }  = useAuth();
        const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false)
        const [searchQuery, setSearchQuery] = useState<string>('');
        const  router  = useRouter();

        useEffect(() => {
            if (!searchQuery.trim()) {
                router.push('/');
            }
        }, [searchQuery]);

        const handleSearch = async () => {
            if (!searchQuery.trim()) return;
            router.push(`/?q=${encodeURIComponent(searchQuery)}`);
        };


        return (
            <header className="fixed top-0 left-0 right-0 z-50 font-space px-24 bg-surface flex items-center gap-2 ">
                <Link className="" href="/">
                    <Image className="w-full" src="/logo.png" alt="Logo" width={160} height={160} />
                </Link>
                <InputGroup className="px-2 py-6">
                    <InputGroupInput placeholder="O que você procura?"  value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}></InputGroupInput>
                    <InputGroupAddon>
                        <SearchIcon/>
                    </InputGroupAddon>
                    <InputGroupAddon align={"inline-end"}>
                        <InputGroupButton className="p-4" variant={'outline'} onClick={handleSearch}>Procurar</InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
                <div className="flex gap-2">
                    {!user && (
                        <Button onClick={
                            () => setOpenLoginDialog(true)
                        } variant={"default"} className="p-6 rounded-xl text-md bg-surface hover:bg-background cursor-pointer border-primary text-primary">Entrar</Button>
                    )}
                    {user && (
                       <UserMenu/>
                    )}
                    
                    <CreateListingDialog />
                </div>
                <LoginDialog open={openLoginDialog} onOpenChange={setOpenLoginDialog} />


            </header>
        );
    }