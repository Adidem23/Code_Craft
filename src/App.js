import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark, dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { solidityCompiler, getCompilerVersions } from "@agnostico/browser-solidity-compiler";

const App = () => {

  const [Input, setInput] = useState("");
  const [ResData, setResData] = useState("");

  const Genres = async () => {

    const options = {
      method: 'POST',
      url: 'https://simple-chatgpt-api.p.rapidapi.com/ask',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'fd1a7d902emshe342975c062f109p1af02cjsn4779124560ac',
        'X-RapidAPI-Host': 'simple-chatgpt-api.p.rapidapi.com'
      },
      data: {
        question: `${Input}`
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      const solidityCodeRegex =/```solidity\n([\s\S]*?)\n```/;
      const matches = response.data.answer.match(solidityCodeRegex);
      const solidityCode = matches ? matches[1] : null;
      setResData(solidityCode);
    } catch (error) {
      console.error(error);
    }
  }

  const openRemixIde = () => {
    const remixIdeUrl = 'https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.21+commit.d9974bed.js';

    const encodedCode = encodeURIComponent(ResData);
    const urlWithCode = `${remixIdeUrl}&code=${encodedCode}`;

    window.open(urlWithCode, '_blank');
  };

  const genABI = async () => {

    const options = {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }

    const ABIres=await solidityCompiler({
      version: `https://binaries.soliditylang.org/bin/0.8.0`,
      contractBody: `${Input}`,
      options,
    });

    console.log("ABI is : "+ABIres);     

  }

  return (
    <>
      <input placeholder='Enter Query' onChange={(e) => { setInput(e.target.value) }} />

      <button onClick={Genres}>Click</button>

      <div style={{ maxWidth: 'fit-content', resize: "false" }}>

        <p>
          <SyntaxHighlighter language="solidity" style={dracula}>
            {ResData}
          </SyntaxHighlighter>
        </p>

        <button onClick={openRemixIde}>Open In Remix IDE</button>

        <button onClick={genABI}>Generate ABI</button>

        <br />
        <br />


      </div>

    </>
  )
}

export default App