import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [apiKeyInput, setapiKeyInput] = useState("");
  const [result, setResult] = useState();
  const [error, setError] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput, apiKey: apiKeyInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
      setError("");
      if (!document.querySelector('input[name="savekey"]').checked) {
      setapiKeyInput("");
      }
      
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      // alert(error.message);
      setError(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <p>
          This is a simple example of how to use the{" "}
          <a href="https://openai.com/blog/openai-api/">OpenAI API</a> with{" "}
          <a href="https://nextjs.org/">Next.js</a>.
          You will need an API key to use this example. You can get one{" "}
          <a href="https://beta.openai.com/account/api-keys">here</a>.
        </p>
        <h3>Name my pet</h3>
        <form onSubmit={onSubmit}>
          <label>Animal</label>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <label>API Key</label>
          <input
            type="password"
            name="apikey"
            label="API Key"
            placeholder="Enter your API key"
            value={apiKeyInput}
            onChange={(e) => setapiKeyInput(e.target.value)}
          />
          <br></br>
          <input type="submit" value="Generate names" />
        </form>
        <br></br>
        <div>
        <label>Click to Save API Key</label>
          <input 
            type="checkbox"
            name="savekey"
            placeholder="Save API Key"
            value="savekey"
          />
        </div>
        <div className={styles.result}>{result}</div>
        <div 
        className={styles.error}
        style={{ display: error ? "block" : "none" }}
        >
          {error}
        </div>
      </main>
    </div>
  );
}
