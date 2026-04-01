'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { login, register } from "@/services/services";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { LoginData, RegisterData } from "@/types";

export interface LoginDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
    const { handleLogin, handleRegister } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);
    const [loginFormData, setLoginFormData] = useState<LoginData>({
        email: '',
        password: '',
    });

    const [registerData, setRegisterData] = useState<RegisterData>({
        first_name: '',
        last_name: '',
        cpf: '',
        phone: '',
        email: '',
        password: '',
        confirm_password: '',
        birth_date: '',

    });

    function handleSubmitLogin () {
        try {
            handleLogin(loginFormData);
            toast.success('Login bem-sucedido!');
            onOpenChange(false)
        } catch (error) {
            console.error('Error submitting login form:', error);
        }
    }

   function handleSubmitRegister () {
        if (registerData.password !== registerData.confirm_password) {
            toast.error('As senhas não coincidem.');
            return;
        }
        try {
            const {confirm_password, ...data} = registerData;
            handleRegister(data); // ✅ passa o data sem confirm_password
            toast.success('Cadastro bem-sucedido!');
            onOpenChange(false)
        } catch (error) {
            console.error('Error submitting register form:', error);
        }
    }
    return (
        <Dialog open={open} onOpenChange={() => {
            onOpenChange(false);
            setIsRegistering(false);
        }}>
            <DialogContent className={"font-space"}>
            <DialogHeader>
                <DialogTitle className="text-lg font-space text-center">Entre na sua conta</DialogTitle>
            </DialogHeader> 
                <div className={`${isRegistering ? 'hidden' : 'flex'} flex-col gap-2`}>
                    <Label htmlFor="email">Email</Label>
                    <Input onChange={(e) => setLoginFormData({...loginFormData, email: e.target.value})} id="email" type="email" placeholder="Digite seu e-mail" />
                    <Label htmlFor="password">Senha</Label>
                    <Input onChange={(e) => setLoginFormData({...loginFormData, password: e.target.value})} id="password" type="password" placeholder="Digite sua senha" />
                    <Button onClick={handleSubmitLogin}>Entrar</Button>
                    <p className="text-center">Não tem uma conta? <Button onClick={() => setIsRegistering(true)} className="bg-transparent text-primary px-0">Cadastre-se</Button></p>
                </div>
                <div className={`${isRegistering ? 'flex' : 'hidden'} flex-col gap-2`}>
                    <Label htmlFor="firstName">Nome</Label>
                    <Input onChange={(e) => setRegisterData({...registerData, first_name: e.target.value})} id="firstName" type="text" placeholder="Digite seu nome" />
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input onChange={(e) => setRegisterData({...registerData, last_name: e.target.value})} id="lastName" type="text" placeholder="Digite seu sobrenome" />
                    <Label htmlFor="cpf">CPF</Label>
                    <Input onChange={(e) => setRegisterData({...registerData, cpf: e.target.value})} id="cpf" type="text" placeholder="Digite seu CPF" />
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input onChange={(e) => setRegisterData({...registerData, birth_date: e.target.value})} id="birthDate" type="date" placeholder="Digite sua data de nascimento" />
                    <Label htmlFor="email">Email</Label>
                    <Input onChange={(e) => setRegisterData({...registerData, email: e.target.value})} id="email" type="email" placeholder="Digite seu e-mail" />
                    <Label htmlFor="phone">Telefone</Label>
                    <Input onChange={(e) => setRegisterData({...registerData, phone: e.target.value})} id="phone" type="tel" placeholder="Digite seu telefone" />
                    <Label htmlFor="password">Senha</Label>
                    <Input onChange={(e) => setRegisterData({...registerData, password: e.target.value})} id="password" type="password" placeholder="Digite sua senha" />
                    <Label htmlFor="confirmPassword">Confirme sua senha</Label>
                    <Input onChange={(e) => setRegisterData({...registerData, confirm_password: e.target.value})} id="confirmPassword" type="password" placeholder="Confirme sua senha" />
                    <Button variant={'secondary'} onClick={handleSubmitRegister}>Cadastrar</Button>
                    <p className="text-center">Já tem uma conta? <Button onClick={() => setIsRegistering(false)} className="bg-transparent text-secondary px-0">Entre</Button></p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

