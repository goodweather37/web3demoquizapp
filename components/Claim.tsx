import { Web3Button, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { PRIZE_CONTRACT_ADDRESS } from "../const/addresses";

export default function Claim() {
    const address = useAddress();

    const {
        contract: prizeContract
    } = useContract(PRIZE_CONTRACT_ADDRESS);

        const mintWithSignature = async () => {
            try {
                const signedPayloadRes = await fetch('api/server', {
                    method: "POST",
                    body: JSON.stringify({
                        claimerAddress: address
                    })
                });
                
                const resData = await signedPayloadRes.json();
        
                if (!signedPayloadRes.ok) {
                    throw new Error(resData.message);
                }
        
                const signedPayload = resData.signedPayload;
        
                const prize = await prizeContract?.erc721.signature.generate(signedPayload);
        
                alert("NFT has been Claimed!");
            } catch (error) {
                console.log(error)
            }
        }
     

    return (
        <div>
            <h1>Congratulations</h1>
            <Web3Button
            contractAddress={PRIZE_CONTRACT_ADDRESS}
            action={mintWithSignature}
            >
                Claim
            </Web3Button>
        </div>
    )
}