import { UserIcon } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"


export const UserMenu = () => {
    const { user, handleLogout } = useAuth();

  return (
    <DropdownMenu >
        <DropdownMenuTrigger className="py-3 px-4 rounded-xl text-md bg-surface hover:bg-background cursor-pointer border border-primary text-primary flex gap-2 items-center">
          <UserIcon size={18} />
          {user?.first_name}
      </DropdownMenuTrigger>
        <DropdownMenuContent className={"font-space"}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Meu Perfil</DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href={'/about'} className="w-full h-full">Ver Perfil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem><Link href={'/listings'}>Meu Anúncios</Link></DropdownMenuItem>
          <DropdownMenuItem><Link href={'/messages'}>Mensagens</Link></DropdownMenuItem>
          <DropdownMenuItem><Link href={'/settings'}>Configurações</Link></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    )
}