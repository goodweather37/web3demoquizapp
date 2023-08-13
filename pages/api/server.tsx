import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { PRIZE_CONTRACT_ADDRESS, QUIZ_CONTRACT_ADDRESS } from "../../const/addresses";

export default async function Server(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { claimerAddress } = JSON.parse(req.body);

        if (!process.env.PRIVATE_KEY) {
            throw new Error("Missing private key");
        }

        const sdk = ThirdwebSDK.fromPrivateKey(
            process.env.PRIVATE_KEY,
            "mumbai"
        );

        const quizContract = await sdk.getContract(QUIZ_CONTRACT_ADDRESS);

        const prizeContract = await sdk.getContract(PRIZE_CONTRACT_ADDRESS, "nft-collection");

        const isCorrect = await quizContract.call(
            "isCorrect",
            [claimerAddress]
        )

        if (!isCorrect) {
            res.status(400).json({error: "You did not answer correctly"});
        }

        const isClaimed = (await prizeContract.balanceOf(claimerAddress)).gt(0);

        if (isClaimed) {
            res.status(400).json({error: "You have already claimed your prize"});
        }

        const payload = {
            to: claimerAddress
        }

        const signedPayload = await prizeContract.erc721.signature.generate(payload);

        res.status(200).json({
            signedPayload: JSON.parse(JSON.stringify(signedPayload))
        })
    
        } catch (error) {
            res.status(500).json({statusCode: 500, message: `server error ${error}`})
        }
}