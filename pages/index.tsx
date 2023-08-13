import { ConnectWallet, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { NextPage } from "next";
import { QUIZ_CONTRACT_ADDRESS } from "../const/addresses";
import Quiz from "../components/Quiz";
import Claim from "../components/Claim";

const Home: NextPage = () => {
  const address = useAddress();

  const {
    contract: quizContract
  } = useContract(QUIZ_CONTRACT_ADDRESS);

  const {
    data: hasAnswered,
    isLoading: isHasAnsweredLoading
  } = useContractRead(
    quizContract,
    "hasAnswered",
    [address]
  )

  const {
    data: isCorrect,
    isLoading: isCorrectLoading
  } = useContractRead(
    quizContract,
    "isCorrect",
    [address]
  );

  return (
    <div>
      <ConnectWallet />
      {!isHasAnsweredLoading ? (
        !hasAnswered ? (
          <Quiz />
        ) : (
          !isCorrectLoading && isCorrect ? (
            <Claim />
          ) : (
            <p>Sorry, your choos the wrong answer.</p>
          )
        )
      ) : (
        <p>Checking the status of the quiz.</p>
      )}
    </div>
  );
};

export default Home;
