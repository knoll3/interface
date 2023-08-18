import { useState, useEffect } from 'react';
import { web3AuthInstance } from '@/src/hooks/web3AuthInstance';
import { getPublicCompressed } from "@toruslabs/eccrypto";

export const userDataHook = () => {
    const [userEmail, setUserEmail] = useState<string>("");
    const [userToken, setUserToken] = useState<string>("");
    const [publicKey, setPublicKey] = useState<string>("");


    const loadUserData = async () => {
        const user = await web3AuthInstance.getUserInfo();
        const privateKey = await web3AuthInstance.provider?.request({
            method: "eth_private_key", 
        }) as string;
    
        const publicKey = getPublicCompressed(Buffer.from(privateKey.padStart(64, "0"), "hex")).toString("hex");

        setUserEmail(user.email!);
        setUserToken(user.idToken!);
        setPublicKey(publicKey);
    };
    
    useEffect(() => {
        if (web3AuthInstance.connected)
            loadUserData();
    }, [web3AuthInstance.connected]);

    return { userEmail, userToken, publicKey };
};
