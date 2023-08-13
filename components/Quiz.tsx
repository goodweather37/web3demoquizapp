import { Web3Button, useAddress, useContract, useContractRead } from "@thirdweb-dev/react"
import { QUIZ_CONTRACT_ADDRESS } from "../const/addresses";
import { useState } from "react";

export default function Quiz() {
    const address = useAddress();

    const {
        contract: quizContract
    } = useContract(QUIZ_CONTRACT_ADDRESS);

    const {
        data: quiz,
        isLoading: isQuizLoading
    } = useContractRead(quizContract,
        "getQuiz");

    const [answerIndex, setAnswerIndex] = useState<number>(0);

    return (
        <div>
            {!isQuizLoading ? (
                <div>
                    <h2>{quiz[0]}</h2>
                    {quiz[1].map((answer: string, index: number) => (
                        <div key={index} onClick={() => setAnswerIndex(index)}>
                            <p>{answer}</p>
                        </div>
                    ))}
                    <Web3Button
                    contractAddress={QUIZ_CONTRACT_ADDRESS}
                    action={(contract) => contract.call("answerQuestion", [answerIndex])}
                    >
                        Submit
                    </Web3Button>
                </div>
                
            ) : (
                <p>loading ....</p>
            )}
        </div>
    )
}